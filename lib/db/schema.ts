import { user } from "@lib/db/auth-schema";
import { createId } from "@paralleldrive/cuid2";
import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export const mcpAuthorizationCode = pgTable(
  "mcpAuthorizationCode",
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
    codeHashUnique: uniqueIndex("mcpAuthorizationCode_codeHash_unique").on(table.codeHash),
    userIdIndex: index("mcpAuthorizationCode_userId_idx").on(table.userId),
  })
);

export const mcpRefreshToken = pgTable(
  "mcpRefreshToken",
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
    tokenHashUnique: uniqueIndex("mcpRefreshToken_tokenHash_unique").on(table.tokenHash),
    userIdIndex: index("mcpRefreshToken_userId_idx").on(table.userId),
  })
);
