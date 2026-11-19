import { createDatabasePool } from "@lib/db/database-pool";
import { env } from "@lib/env";
import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import { boolean, pgTable, text } from "drizzle-orm/pg-core";
import type { Pool } from "pg";

export const USER_DATABASE_READONLY_OPTIONS = "-c default_transaction_read_only=on";

const authUser = pgTable("user", {
  email: text("email").notNull(),
  emailVerified: boolean("emailVerified").notNull(),
});

export class UserDatabaseUnavailableError extends Error {
  constructor() {
    super("Knowhere user database is not configured. Set KNOWHERE_USER_DATABASE_URL.");
    this.name = "UserDatabaseUnavailableError";
  }
}

type UserReadDatabase = ReturnType<typeof drizzle>;

let userReadPool: Pool | undefined;

function getUserReadPool(): Pool {
  const connectionString = env.KNOWHERE_USER_DATABASE_URL;
  if (!connectionString) {
    throw new UserDatabaseUnavailableError();
  }

  if (!userReadPool) {
    userReadPool = createDatabasePool({
      application_name: "knowhere-dashboard-user-readonly",
      connectionString,
      connectionTimeoutMillis: env.DATABASE_POOL_CONNECTION_TIMEOUT_MILLISECONDS,
      idleTimeoutMillis: env.DATABASE_POOL_IDLE_TIMEOUT_MILLISECONDS,
      max: 1,
      options: USER_DATABASE_READONLY_OPTIONS,
      query_timeout: 10_000,
      statement_timeout: 10_000,
    });
  }

  return userReadPool;
}

function getUserReadDb(): UserReadDatabase {
  return drizzle({ client: getUserReadPool() });
}

export async function listVerifiedUsers(): Promise<
  readonly { email: string; emailVerified: boolean }[]
> {
  return getUserReadDb()
    .select({
      email: authUser.email,
      emailVerified: authUser.emailVerified,
    })
    .from(authUser)
    .where(eq(authUser.emailVerified, true));
}
