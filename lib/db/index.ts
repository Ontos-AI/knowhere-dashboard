import * as authSchema from "@lib/db/auth-schema";
import { createDatabasePool } from "@lib/db/database-pool";
import { getDatabaseSslConfig } from "@lib/db/database-ssl";
import * as appSchema from "@lib/db/schema";
import { env } from "@lib/env";
import { drizzle } from "drizzle-orm/node-postgres";

// Connection pool for dashboard auth/account data.
const pool: ReturnType<typeof createDatabasePool> = createDatabasePool({
  connectionString: env.DATABASE_URL,
  connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MILLISECONDS,
  idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MILLISECONDS,
  max: env.DATABASE_POOL_MAX,
  ssl: getDatabaseSslConfig(env.UNSAFE_DB_SSL_ENABLED),
});

// Merge all schemas for type-safe db.query.* helpers
// This design allows easy addition of new schema files in the future
export const db = drizzle({
  client: pool,
  schema: {
    ...authSchema,
    ...appSchema,
  },
});
