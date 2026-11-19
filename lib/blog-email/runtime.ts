import { randomUUID } from "node:crypto";
import { runBlogEmailCron } from "@lib/blog-email/dispatch";
import { blogEmailStore } from "@lib/blog-email/store";
import {
  BLOG_EMAIL_BATCH_SIZE,
  type BlogEmailCronResult,
  type BlogEmailRuntime,
  type BlogEmailSendBatch,
  type BlogEmailSendResult,
  type BlogEmailSubscriptionRow,
  type BlogEmailUserRow,
} from "@lib/blog-email/types";
import {
  getLatestPublishedWordpressPost,
  getPublishedWordpressPost,
  listPublishedWordpressPostSummaries,
  wordpressOriginFromSite,
} from "@lib/blog-email/wordpress";
import { newsletterDb } from "@lib/db/newsletter";
import { newsletterSubscription } from "@lib/db/newsletter-schema";
import { listVerifiedUsers } from "@lib/db/user-readonly";
import { env } from "@lib/env";
import { eq } from "drizzle-orm";
import { Resend } from "resend";

async function loadBlogEmailSubscriptions(): Promise<readonly BlogEmailSubscriptionRow[]> {
  return newsletterDb
    .select({
      email: newsletterSubscription.email,
      status: newsletterSubscription.status,
    })
    .from(newsletterSubscription)
    .where(eq(newsletterSubscription.status, "confirmed"));
}

async function loadBlogEmailUsers(): Promise<readonly BlogEmailUserRow[]> {
  return listVerifiedUsers();
}

async function sendBlogEmailBatch(batch: BlogEmailSendBatch): Promise<BlogEmailSendResult> {
  if (!env.RESEND_API_KEY) {
    return { error: "RESEND_API_KEY is not configured", ok: false };
  }

  const resend = new Resend(env.RESEND_API_KEY);
  const response = await resend.batch.send(
    batch.messages.map((message) => ({
      from: env.RESEND_FROM,
      headers: { ...message.headers },
      html: message.html,
      subject: message.subject,
      text: message.text,
      to: message.to,
    })),
    { idempotencyKey: batch.idempotencyKey }
  );

  if (response.error || !response.data) {
    return { error: response.error?.message ?? "Resend rejected the batch", ok: false };
  }

  return { ids: response.data.data.map((item) => item.id), ok: true };
}

function createBlogEmailRuntime(): BlogEmailRuntime {
  return {
    appUrl: env.NEXT_PUBLIC_APP_URL,
    batchSize: BLOG_EMAIL_BATCH_SIZE,
    createDeliveryId: () => randomUUID(),
    getLatestPublishedPost: () => getLatestPublishedWordpressPost({ site: env.WORDPRESS_SITE }),
    getPublishedPost: (wordpressPostId) =>
      getPublishedWordpressPost({ site: env.WORDPRESS_SITE, wordpressPostId }),
    listPublishedPosts: () => listPublishedWordpressPostSummaries({ site: env.WORDPRESS_SITE }),
    loadSubscriptions: loadBlogEmailSubscriptions,
    loadUsers: loadBlogEmailUsers,
    now: () => new Date(),
    sendBatch: sendBlogEmailBatch,
    store: blogEmailStore,
    unsubscribeSecret: env.BETTER_AUTH_SECRET,
    wordpressOrigin: wordpressOriginFromSite(env.WORDPRESS_SITE),
  };
}

export async function runScheduledBlogEmailDispatch(): Promise<BlogEmailCronResult> {
  return runBlogEmailCron(createBlogEmailRuntime());
}
