import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

interface PoolStub {
  readonly pool: string;
}

interface DatabaseStub {
  readonly database: string;
}

const createDatabasePool: Mock<() => PoolStub> = vi.fn((): PoolStub => ({ pool: "main" }));
const drizzle: Mock<() => DatabaseStub> = vi.fn((): DatabaseStub => ({ database: "main" }));

vi.mock("@lib/db/database-pool", (): { createDatabasePool: typeof createDatabasePool } => ({
  createDatabasePool,
}));
vi.mock("@lib/db/database-ssl", (): { getDatabaseSslConfig: () => boolean } => ({
  getDatabaseSslConfig: (): boolean => false,
}));
vi.mock("@lib/db/auth-schema", (): { user: string } => ({ user: "auth-schema" }));
vi.mock("@lib/db/schema", (): { account: string } => ({ account: "app-schema" }));
vi.mock("drizzle-orm/node-postgres", (): { drizzle: typeof drizzle } => ({ drizzle }));
vi.mock("@lib/env", (): { env: Readonly<Record<string, number | string>> } => ({
  env: {
    DATABASE_POOL_CONNECTION_TIMEOUT_MILLISECONDS: 5_000,
    DATABASE_POOL_IDLE_TIMEOUT_MILLISECONDS: 10_000,
    DATABASE_POOL_MAX: 2,
    DATABASE_URL: "postgres://main.example/knowhere",
    UNSAFE_DB_SSL_ENABLED: "false",
  },
}));

beforeEach((): void => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("main database", (): void => {
  it("uses the bounded main pool configuration", async (): Promise<void> => {
    const databaseModule: typeof import("@lib/db") = await import("@lib/db");

    expect(createDatabasePool).toHaveBeenCalledWith({
      connectionString: "postgres://main.example/knowhere",
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      max: 2,
      ssl: false,
    });
    expect(drizzle).toHaveBeenCalledWith({
      client: { pool: "main" },
      schema: {
        account: "app-schema",
        user: "auth-schema",
      },
    });
    expect(databaseModule.db).toEqual({ database: "main" });
  });
});
