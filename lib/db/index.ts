import * as authSchema from "@lib/db/auth-schema";
import * as appSchema from "@lib/db/schema";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";

// Connection pool for Neon Postgres
const pool = new Pool({
  // biome-ignore lint/style/noNonNullAssertion: DATABASE_URL is validated at runtime by env schema
  connectionString: process.env.DATABASE_URL!,
  ssl: {
    rejectUnauthorized: true,
    // biome-ignore lint/suspicious/noExplicitAny: pg Pool type definition requires any for ssl options
  } as any,
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
