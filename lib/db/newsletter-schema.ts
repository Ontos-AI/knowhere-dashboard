import { createId } from "@paralleldrive/cuid2";
import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

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
