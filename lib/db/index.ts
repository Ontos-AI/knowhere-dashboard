import * as authSchema from "@lib/db/auth-schema";
import { getDatabaseSslConfig } from "@lib/db/database-ssl";
import * as appSchema from "@lib/db/schema";
import { env } from "@lib/env";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

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
