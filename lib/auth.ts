import "./polyfill";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";
import { jwt, magicLink } from "better-auth/plugins";
import { Resend } from "resend";
import { ProxyAgent, setGlobalDispatcher } from "undici";
import { authCookies } from "@/lib/auth-cookie-config";
import { authRedirect } from "@/lib/auth-redirect";
import { db } from "@/lib/db";
import { env } from "@/lib/env";

type AuthEmailOptions = {
  readonly to: string;
  readonly subject: string;
  readonly title: string;
  readonly intro: string;
  readonly buttonText: string;
  readonly url: string;
  readonly fallbackLabel: string;
  readonly missingApiKeyMessage: string;
};

function createAuthEmailHtml(options: AuthEmailOptions): string {
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
        <h2 class="content-text" style="color: #09090b; margin-bottom: 24px; font-size: 24px; font-weight: 600;">${options.title}</h2>
        <p class="content-text" style="color: #09090b; margin-bottom: 24px; line-height: 1.6; font-size: 16px;">${options.intro}</p>

        <a href="${options.url}" class="button-primary" style="display: inline-block; padding: 12px 24px; background-color: #09090b; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 16px;">
          ${options.buttonText}
        </a>

        <div class="divider" style="margin-top: 32px; padding-top: 32px; border-top: 1px solid #e5e5e5;">
          <p class="secondary-text" style="font-size: 14px; color: #666666; margin-bottom: 12px; line-height: 1.5;">If the button doesn't work, copy and paste this link into your browser:</p>
          <a href="${options.url}" class="link-text" style="font-size: 13px; color: #666666; text-decoration: underline; word-break: break-all; line-height: 1.6; display: block;">
            ${options.url}
          </a>
        </div>

        <p class="secondary-text" style="margin-top: 32px; font-size: 12px; color: #a1a1aa;">
          If you didn't request this email, you can safely ignore it.
        </p>
      </div>
    </body>
    </html>
  `;
}

async function sendAuthEmail(options: AuthEmailOptions): Promise<void> {
  try {
    if (!env.RESEND_API_KEY) {
      if (env.NODE_ENV === "development") {
        console.log(
          `\n⚠️ [FALLBACK] RESEND_API_KEY is not set. ${options.fallbackLabel}:\n${options.url}\n`
        );
        return;
      }
      throw new Error(options.missingApiKeyMessage);
    }

    const resend = new Resend(env.RESEND_API_KEY);
    const { data, error } = await resend.emails.send({
      from: env.RESEND_FROM,
      to: options.to,
      subject: options.subject,
      html: createAuthEmailHtml(options),
    });

    if (error) {
      console.error("Resend error:", error);
      throw error;
    }

    console.log(`${options.fallbackLabel} sent to ${options.to}. Id: ${data?.id}`);
  } catch (error) {
    console.error(`Failed to send ${options.fallbackLabel}:`, error);
    if (env.NODE_ENV === "development") {
      console.log(`\n⚠️ [FALLBACK] Email failed. ${options.fallbackLabel}:\n${options.url}\n`);
      return;
    }
    throw error;
  }
}

// Enable global proxy in development to resolve domestic network issues with Google/GitHub OAuth
if (env.NODE_ENV === "development" || env.HTTPS_PROXY) {
  const proxyUrl = env.HTTPS_PROXY || env.HTTP_PROXY;
  if (proxyUrl) {
    try {
      const dispatcher = new ProxyAgent(proxyUrl);
      setGlobalDispatcher(dispatcher);
      console.log(`[Auth] Using proxy: ${proxyUrl}`);
    } catch (error) {
      console.error("[Auth] Failed to set proxy:", error);
    }
  }
}

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  // Explicitly specify trustedOrigins to prevent host validation failures in reverse proxy or Docker environments.
  // Allowlisted external callback origins (see NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS)
  // are folded in so Better Auth accepts them as post-login redirect
  // targets in cross-subdomain deployments.
  trustedOrigins: [
    env.NEXT_PUBLIC_APP_URL,
    env.BETTER_AUTH_URL,
    ...authRedirect.allowedExternalOrigins,
  ],
  secret: env.BETTER_AUTH_SECRET,

  // Drizzle ORM adapter — schema is automatically loaded from db instance
  database: drizzleAdapter(db, {
    provider: "pg",
  }),

  advanced: {
    cookiePrefix: authCookies.getCookiePrefix(),
    // When `AUTH_COOKIE_DOMAIN` is set, enable cross-subdomain session cookies
    // so the Better Auth session token is sent to sibling apps hosted under
    // the same parent domain. Unset → current host-only behavior.
    ...(env.AUTH_COOKIE_DOMAIN
      ? {
          crossSubDomainCookies: {
            enabled: true,
            domain: env.AUTH_COOKIE_DOMAIN,
          },
        }
      : {}),
  },

  // Enable performance optimization with joins (2-3x faster)
  experimental: {
    joins: true,
  },

  // Extend the default user schema with a custom role field for RBAC
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "user",
      },
    },
  },

  session: {
    // Cookie-based session caching reduces DB queries; session is valid for 30 days
    cookieCache: {
      enabled: true,
      maxAge: 30 * 24 * 60 * 60, // 30 days
      version: authCookies.getCookieCacheVersion(),
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    revokeSessionsOnPasswordReset: true,
    resetPasswordTokenExpiresIn: 60 * 60,
    sendResetPassword: async ({ user, url }) => {
      void sendAuthEmail({
        to: user.email,
        subject: "Reset your Knowhere password",
        title: "Reset your Knowhere password",
        intro: "You requested a password reset. Click the button below to set a new password:",
        buttonText: "Reset Password",
        url,
        fallbackLabel: "Password reset link",
        missingApiKeyMessage: "RESEND_API_KEY is required for password reset email",
      }).catch((error: unknown) => {
        console.error("Failed to send password reset email:", error);
      });
    },
  },

  // Email/password is the self-hosted baseline. OAuth and Magic Link remain optional add-ons.
  socialProviders: {
    ...(env.GITHUB_CLIENT_ID && env.GITHUB_CLIENT_SECRET
      ? {
          github: {
            clientId: env.GITHUB_CLIENT_ID,
            clientSecret: env.GITHUB_CLIENT_SECRET,
            redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/github`,
          },
        }
      : {}),
    ...(env.GOOGLE_CLIENT_ID && env.GOOGLE_CLIENT_SECRET
      ? {
          google: {
            clientId: env.GOOGLE_CLIENT_ID,
            clientSecret: env.GOOGLE_CLIENT_SECRET,
            redirectURI: `${env.BETTER_AUTH_URL}/api/auth/callback/google`,
          },
        }
      : {}),
  },
  plugins: [
    jwt({
      jwt: {
        expirationTime: "15m", // JWT expires in 15 minutes
        definePayload: ({ user }) => ({
          id: user.id, // Only include userId to maintain single source of truth
        }),
      },
    }),
    magicLink({
      sendMagicLink: async ({ email, url }) => {
        await sendAuthEmail({
          to: email,
          subject: "Knowhere Account Login Link",
          title: "Log in to Knowhere",
          intro: "You requested a login link. Click the button below to sign in:",
          buttonText: "Sign In",
          url,
          fallbackLabel: "Magic link",
          missingApiKeyMessage: "RESEND_API_KEY is required for magic-link email login",
        });
      },
    }),
    nextCookies(),
  ],
});
