import { getDatabaseSslConfig } from "@lib/db/database-ssl";
import * as newsletterSchema from "@lib/db/newsletter-schema";
import { env } from "@lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

function getNewsletterDatabaseUrl(): string {
  return env.NEWSLETTER_DATABASE_URL ?? env.DATABASE_URL;
}

const newsletterPool = new Pool({
  connectionString: getNewsletterDatabaseUrl(),
  ssl: getDatabaseSslConfig(env.UNSAFE_DB_SSL_ENABLED),
});

export const newsletterDb = drizzle({
  client: newsletterPool,
  schema: newsletterSchema,
});
