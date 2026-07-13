import type { Config } from "drizzle-kit";

const newsletterDatabaseUrl = process.env.NEWSLETTER_DATABASE_URL?.trim() || process.env.DATABASE_URL!;

export default {
  schema: "./lib/db/newsletter-schema.ts",
  out: "./drizzle-newsletter",
  dialect: "postgresql",
  dbCredentials: {
    url: newsletterDatabaseUrl,
  },
} satisfies Config;
