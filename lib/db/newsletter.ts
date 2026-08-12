import { createDatabasePool } from "@lib/db/database-pool";
import { getDatabaseSslConfig } from "@lib/db/database-ssl";
import * as newsletterSchema from "@lib/db/newsletter-schema";
import { env } from "@lib/env";
import { drizzle } from "drizzle-orm/node-postgres";

function getNewsletterDatabaseUrl(): string {
  return env.NEWSLETTER_DATABASE_URL ?? env.DATABASE_URL;
}

const newsletterPool: ReturnType<typeof createDatabasePool> = createDatabasePool({
  connectionString: getNewsletterDatabaseUrl(),
  connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MS,
  idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MS,
  max: env.NEWSLETTER_DATABASE_POOL_MAX,
  ssl: getDatabaseSslConfig(env.UNSAFE_DB_SSL_ENABLED),
});

export const newsletterDb = drizzle({
  client: newsletterPool,
  schema: newsletterSchema,
});
