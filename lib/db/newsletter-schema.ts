import { createId } from "@paralleldrive/cuid2";
import { boolean, index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const newsletterSubscription = pgTable(
  "newsletterSubscription",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    email: text("email").notNull(),
    status: text("status").notNull().default("pending"),
    confirmationTokenHash: text("confirmationTokenHash"),
    confirmationTokenExpiresAt: timestamp("confirmationTokenExpiresAt", {
      withTimezone: true,
    }),
    confirmationSentAt: timestamp("confirmationSentAt", { withTimezone: true }),
    confirmedAt: timestamp("confirmedAt", { withTimezone: true }),
    unsubscribedAt: timestamp("unsubscribedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    emailUnique: uniqueIndex("newsletterSubscription_email_unique").on(table.email),
    confirmationTokenHashUnique: uniqueIndex(
      "newsletterSubscription_confirmationTokenHash_unique"
    ).on(table.confirmationTokenHash),
    statusIndex: index("newsletterSubscription_status_idx").on(table.status),
  })
);

/**
 * Blog email ledger shared with knowhere-metrics-dashboard.
 * This app owns the blog email cron, WordPress fetch, and Resend send.
 * knowhere-metrics-dashboard writes the switch and lists deliveries in this database.
 * Metrics queries these SQL names directly; do not rename a column in only one repo.
 *
 * blogEmailSettings: id, enabled, audience, testRecipient, updatedAt
 *   single row id "default"; enabled defaults false; audience is "test" or "live" (default "test")
 * blogEmailPreviewRequest: id, requestedAt, status, completedAt, result, wordpressPostId, message, email
 *   single row id "default"; status is "pending", "processing", or "completed"
 *   result is "sent", "already_sent", "no_post", "missing_test_recipient", or "failed"
 *   email plus wordpressPostId is one manual send and runs even when enabled is false
 * blogEmailCursor: id, seededAt, updatedAt
 * blogPostDispatch: wordpressPostId, status, publishedAt, title, permalink, createdAt, updatedAt, sentAt, lastError
 * blogDelivery: id, wordpressPostId, email, postTitle, source, status, resendId, error, sentAt, createdAt, updatedAt
 *   source is "preview", "test", or "live"; status is "sent" or "failed"
 * blogEmailSuppression: email, createdAt
 *   blog-only opt-out. Newsletter subscribe, confirm, and unsubscribe do not write this table.
 */
export const blogEmailSettings = pgTable("blogEmailSettings", {
  id: text("id").primaryKey(),
  enabled: boolean("enabled").notNull().default(false),
  audience: text("audience").notNull().default("test"),
  testRecipient: text("testRecipient"),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const blogEmailPreviewRequest = pgTable("blogEmailPreviewRequest", {
  id: text("id").primaryKey(),
  requestedAt: timestamp("requestedAt", { withTimezone: true }).notNull(),
  status: text("status").notNull().default("pending"),
  completedAt: timestamp("completedAt", { withTimezone: true }),
  result: text("result"),
  wordpressPostId: text("wordpressPostId"),
  message: text("message"),
  email: text("email"),
});

export const blogEmailCursor = pgTable("blogEmailCursor", {
  id: text("id").primaryKey(),
  seededAt: timestamp("seededAt", { withTimezone: true }),
  updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
});

export const blogPostDispatch = pgTable(
  "blogPostDispatch",
  {
    wordpressPostId: text("wordpressPostId").primaryKey(),
    status: text("status").notNull(),
    publishedAt: timestamp("publishedAt", { withTimezone: true }).notNull(),
    title: text("title").notNull(),
    permalink: text("permalink"),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
    sentAt: timestamp("sentAt", { withTimezone: true }),
    lastError: text("lastError"),
  },
  (table) => ({
    statusPublishedAtIndex: index("blogPostDispatch_status_publishedAt_idx").on(
      table.status,
      table.publishedAt
    ),
  })
);

export const blogDelivery = pgTable(
  "blogDelivery",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    wordpressPostId: text("wordpressPostId").notNull(),
    email: text("email").notNull(),
    postTitle: text("postTitle").notNull(),
    source: text("source").notNull(),
    status: text("status").notNull(),
    resendId: text("resendId"),
    error: text("error"),
    sentAt: timestamp("sentAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
    updatedAt: timestamp("updatedAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    postEmailUnique: uniqueIndex("blogDelivery_post_email_unique").on(
      table.wordpressPostId,
      table.email
    ),
    sentAtIndex: index("blogDelivery_sentAt_idx").on(table.sentAt),
    emailIndex: index("blogDelivery_email_idx").on(table.email),
  })
);

export const blogEmailSuppression = pgTable("blogEmailSuppression", {
  email: text("email").primaryKey(),
  createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
});
