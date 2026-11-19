import type { Config } from "drizzle-kit";

const newsletterDatabaseUrl = process.env.NEWSLETTER_DATABASE_URL?.trim() || process.env.DATABASE_URL!;

export default {
  schema: "./lib/db/newsletter-schema.ts",
  out: "./drizzle-newsletter",
  dialect: "postgresql",
  dbCredentials: {
    url: newsletterDatabaseUrl,
  },
  // The growth Neon database already uses drizzle.__drizzle_migrations for its own
  // tables. Newsletter migrations keep a separate journal so they cannot advance
  // that watermark or replay onto those tables.
  migrations: {
    schema: "drizzle_newsletter",
    table: "__drizzle_migrations",
  },
} satisfies Config
