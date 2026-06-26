import { user } from "@lib/db/auth-schema";
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

export const oauthAuthorizationCode = pgTable(
  "oauthAuthorizationCode",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    codeHash: text("codeHash").notNull(),
    redirectUri: text("redirectUri").notNull(),
    codeChallenge: text("codeChallenge").notNull(),
    clientName: text("clientName").notNull(),
    permission: text("permission").notNull().default("full_access"),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    consumedAt: timestamp("consumedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    codeHashUnique: uniqueIndex("oauthAuthorizationCode_codeHash_unique").on(table.codeHash),
    userIdIndex: index("oauthAuthorizationCode_userId_idx").on(table.userId),
  })
);

export const oauthRefreshToken = pgTable(
  "oauthRefreshToken",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    userId: text("userId")
      .notNull()
      .references(() => user.id, { onDelete: "cascade" }),
    tokenHash: text("tokenHash").notNull(),
    name: text("name").notNull(),
    permission: text("permission").notNull().default("full_access"),
    expiresAt: timestamp("expiresAt", { withTimezone: true }).notNull(),
    revokedAt: timestamp("revokedAt", { withTimezone: true }),
    lastUsedAt: timestamp("lastUsedAt", { withTimezone: true }),
    createdAt: timestamp("createdAt", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    tokenHashUnique: uniqueIndex("oauthRefreshToken_tokenHash_unique").on(table.tokenHash),
    userIdIndex: index("oauthRefreshToken_userId_idx").on(table.userId),
  })
);
