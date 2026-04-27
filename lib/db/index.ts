import * as authSchema from "@lib/db/auth-schema";
import * as appSchema from "@lib/db/schema";
import { env } from "@lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

const UNSAFE_DB_SSL_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

function getDatabaseSslConfig(unsafeDbSslEnabled: string | undefined):
  | false
  | {
      rejectUnauthorized: boolean;
    } {
  const shouldDisableDatabaseSsl = UNSAFE_DB_SSL_ENABLED_VALUES.has(
    (unsafeDbSslEnabled ?? "false").trim().toLowerCase()
  );

  if (shouldDisableDatabaseSsl) {
    return false;
  }

  return {
    rejectUnauthorized: true,
  };
}

// Connection pool for dashboard auth/account data.
const pool = new Pool({
  connectionString: env.DATABASE_URL,
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
