import crypto from "node:crypto";
import { newsletterDb } from "@lib/db/newsletter";
import { newsletterSubscription } from "@lib/db/newsletter-schema";
import { env } from "@lib/env";
import {
  createNewsletterConfirmationUrl,
  NEWSLETTER_CONFIRMATION_TOKEN_TTL_MS,
  type NewsletterConfirmationStatus,
  normalizeNewsletterEmail,
  shouldThrottleNewsletterConfirmationEmail,
} from "@lib/newsletter";
import { ORPCError } from "@orpc/server";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

type NewsletterSubscriptionResult = {
  readonly success: true;
  readonly status: "confirmation_sent" | "already_confirmed" | "recently_sent";
};

type NewsletterConfirmationResult = {
  readonly status: NewsletterConfirmationStatus;
};

type NewsletterUnsubscribeResult = {
  readonly success: true;
};

const TOKEN_BYTE_LENGTH = 32;
const PENDING_SUBSCRIPTION_STATUS = "pending";
const CONFIRMED_SUBSCRIPTION_STATUS = "confirmed";
const UNSUBSCRIBED_SUBSCRIPTION_STATUS = "unsubscribed";

function createConfirmationToken(): string {
  return crypto.randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
}

function hashConfirmationToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function createNewsletterEmailHtml(confirmationUrl: string): string {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="color-scheme" content="light dark">
      <meta name="supported-color-schemes" content="light dark">
      <style>
        @media (prefers-color-scheme: dark) {
          .body-bg { background-color: #09090b !important; }
          .content-text { color: #ffffff !important; }
          .secondary-text { color: #a1a1aa !important; }
          .button-primary { background-color: #fafafa !important; color: #09090b !important; }
          .link-text { color: #a1a1aa !important; }
          .divider { border-color: #27272a !important; }
        }
      </style>
    </head>
    <body class="body-bg" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 0; background-color: #ffffff;">
      <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
        <h2 class="content-text" style="color: #09090b; margin-bottom: 24px; font-size: 24px; font-weight: 600;">Confirm your Knowhere newsletter subscription</h2>
        <p class="content-text" style="color: #09090b; margin-bottom: 24px; line-height: 1.6; font-size: 16px;">
          Click the button below to confirm this email address and finish subscribing to product updates from Knowhere.
        </p>

        <a href="${confirmationUrl}" class="button-primary" style="display: inline-block; padding: 12px 24px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
          Confirm Subscription
        </a>

        <div class="divider" style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
          <p class="secondary-text" style="font-size: 14px; color: #666666; margin-bottom: 12px; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:</p>
          <a href="${confirmationUrl}" class="link-text" style="font-size: 13px; color: #666666; text-decoration: underline; word-break: break-all; line-height: 1.6; display: block;">
            ${confirmationUrl}
          </a>
        </div>

        <p class="secondary-text" style="margin-top: 32px; font-size: 12px; color: #a1a1aa;">
          This link expires in 7 days. If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    </body>
    </html>
  `;
}

async function sendNewsletterConfirmationEmail(
  email: string,
  confirmationUrl: string
): Promise<void> {
  if (!env.RESEND_API_KEY) {
    if (env.NODE_ENV === "development") {
      console.log(
        `\n[Newsletter] RESEND_API_KEY is not set. Confirmation link:\n${confirmationUrl}\n`
      );
      return;
    }

    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "RESEND_API_KEY is required for newsletter confirmation email",
    });
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const { error } = await resend.emails.send({
    from: env.RESEND_FROM,
    to: email,
    subject: "Confirm your Knowhere newsletter subscription",
    html: createNewsletterEmailHtml(confirmationUrl),
  });

  if (error) {
    console.error("[Newsletter] Resend error:", error);
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "Failed to send newsletter confirmation email",
    });
  }
}

export async function requestNewsletterSubscription(
  emailInput: string
): Promise<NewsletterSubscriptionResult> {
  const email = normalizeNewsletterEmail(emailInput);
  const now = new Date();

  const existingSubscription = await newsletterDb.query.newsletterSubscription.findFirst({
    where: eq(newsletterSubscription.email, email),
  });

  if (existingSubscription?.status === CONFIRMED_SUBSCRIPTION_STATUS) {
    return { success: true, status: "already_confirmed" };
  }

  if (
    existingSubscription &&
    shouldThrottleNewsletterConfirmationEmail(existingSubscription.confirmationSentAt, now)
  ) {
    return { success: true, status: "recently_sent" };
  }

  const token = createConfirmationToken();
  const confirmationTokenHash = hashConfirmationToken(token);
  const confirmationTokenExpiresAt = new Date(now.getTime() + NEWSLETTER_CONFIRMATION_TOKEN_TTL_MS);
  const confirmationUrl = createNewsletterConfirmationUrl(env.NEXT_PUBLIC_APP_URL, token);

  if (existingSubscription) {
    await newsletterDb
      .update(newsletterSubscription)
      .set({
        status: PENDING_SUBSCRIPTION_STATUS,
        confirmationTokenHash,
        confirmationTokenExpiresAt,
        confirmationSentAt: now,
        confirmedAt: null,
        unsubscribedAt: null,
        updatedAt: now,
      })
      .where(eq(newsletterSubscription.id, existingSubscription.id));
  } else {
    await newsletterDb.insert(newsletterSubscription).values({
      email,
      status: PENDING_SUBSCRIPTION_STATUS,
      confirmationTokenHash,
      confirmationTokenExpiresAt,
      confirmationSentAt: now,
      createdAt: now,
      updatedAt: now,
    });
  }

  try {
    await sendNewsletterConfirmationEmail(email, confirmationUrl);
  } catch (error) {
    await newsletterDb
      .update(newsletterSubscription)
      .set({ confirmationSentAt: null, updatedAt: new Date() })
      .where(eq(newsletterSubscription.email, email));
    throw error;
  }

  return { success: true, status: "confirmation_sent" };
}

export async function confirmNewsletterSubscription(
  token: string
): Promise<NewsletterConfirmationResult> {
  const normalizedToken = token.trim();

  if (!normalizedToken) {
    return { status: "invalid" };
  }

  const confirmationTokenHash = hashConfirmationToken(normalizedToken);
  const subscription = await newsletterDb.query.newsletterSubscription.findFirst({
    where: eq(newsletterSubscription.confirmationTokenHash, confirmationTokenHash),
  });

  if (!subscription) {
    return { status: "invalid" };
  }

  const now = new Date();

  if (!subscription.confirmationTokenExpiresAt || subscription.confirmationTokenExpiresAt < now) {
    await newsletterDb
      .update(newsletterSubscription)
      .set({
        confirmationTokenHash: null,
        confirmationTokenExpiresAt: null,
        updatedAt: now,
      })
      .where(eq(newsletterSubscription.id, subscription.id));

    return { status: "expired" };
  }

  await newsletterDb
    .update(newsletterSubscription)
    .set({
      status: CONFIRMED_SUBSCRIPTION_STATUS,
      confirmedAt: now,
      confirmationTokenHash: null,
      confirmationTokenExpiresAt: null,
      unsubscribedAt: null,
      updatedAt: now,
    })
    .where(eq(newsletterSubscription.id, subscription.id));

  return { status: "confirmed" };
}

export async function unsubscribeNewsletterSubscription(
  emailInput: string
): Promise<NewsletterUnsubscribeResult> {
  const email = normalizeNewsletterEmail(emailInput);
  const now = new Date();

  await newsletterDb
    .update(newsletterSubscription)
    .set({
      status: UNSUBSCRIBED_SUBSCRIPTION_STATUS,
      confirmationTokenHash: null,
      confirmationTokenExpiresAt: null,
      confirmationSentAt: null,
      unsubscribedAt: now,
      updatedAt: now,
    })
    .where(eq(newsletterSubscription.email, email));

  return { success: true };
}
