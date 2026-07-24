import { user } from "@lib/db/auth-schema";
import { createId } from "@paralleldrive/cuid2";
import { index, pgTable, text, timestamp, uniqueIndex } from "drizzle-orm/pg-core";

export { newsletterSubscription } from "@lib/db/newsletter-schema";

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

export const marketingAttributionSession = pgTable(
  "marketing_attribution_sessions",
  {
    sessionId: text("session_id")
      .primaryKey()
      .$defaultFn(() => createId()),
    source: text("source").notNull(),
    channel: text("channel").notNull(),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    oppref: text("oppref"),
    landingPath: text("landing_path").notNull(),
    referrerHost: text("referrer_host"),
    capturedAt: timestamp("captured_at", { withTimezone: true }).notNull().defaultNow(),
    boundUserId: text("bound_user_id").references(() => user.id, { onDelete: "set null" }),
    boundAt: timestamp("bound_at", { withTimezone: true }),
  },
  (table) => ({
    boundUserIdIndex: index("marketingAttributionSession_boundUserId_idx").on(table.boundUserId),
    capturedAtIndex: index("marketingAttributionSession_capturedAt_idx").on(table.capturedAt),
    sourceCampaignIndex: index("marketingAttributionSession_sourceCampaign_idx").on(
      table.source,
      table.utmCampaign
    ),
  })
);

export const marketingPageView = pgTable(
  "marketing_page_views",
  {
    viewId: text("view_id")
      .primaryKey()
      .$defaultFn(() => createId()),
    acquisitionSessionId: text("acquisition_session_id"),
    source: text("source").notNull(),
    channel: text("channel").notNull(),
    utmSource: text("utm_source"),
    utmMedium: text("utm_medium"),
    utmCampaign: text("utm_campaign"),
    utmContent: text("utm_content"),
    utmTerm: text("utm_term"),
    oppref: text("oppref"),
    visitedPath: text("visited_path").notNull(),
    referrerHost: text("referrer_host"),
    viewedAt: timestamp("viewed_at", { withTimezone: true }).notNull().defaultNow(),
  },
  (table) => ({
    viewedAtIndex: index("marketingPageView_viewedAt_idx").on(table.viewedAt),
    visitedPathViewedAtIndex: index("marketingPageView_visitedPath_viewedAt_idx").on(
      table.visitedPath,
      table.viewedAt
    ),
    acquisitionSessionIdIndex: index("marketingPageView_acquisitionSessionId_idx").on(
      table.acquisitionSessionId
    ),
  })
);
