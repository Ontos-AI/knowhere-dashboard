import { beforeEach, describe, expect, it, vi } from "vitest";

const createDatabasePool = vi.fn(() => ({ pool: "main" }));
const drizzle = vi.fn(() => ({ database: "main" }));

vi.mock("@lib/db/database-pool", () => ({ createDatabasePool }));
vi.mock("@lib/db/database-ssl", () => ({ getDatabaseSslConfig: () => false }));
vi.mock("@lib/db/auth-schema", () => ({ user: "auth-schema" }));
vi.mock("@lib/db/schema", () => ({ account: "app-schema" }));
vi.mock("drizzle-orm/node-postgres", () => ({ drizzle }));
vi.mock("@lib/env", () => ({
  env: {
    DATABASE_POOL_CONNECTION_TIMEOUT_MS: 5_000,
    DATABASE_POOL_IDLE_TIMEOUT_MS: 10_000,
    DATABASE_POOL_MAX: 2,
    DATABASE_URL: "postgres://main.example/knowhere",
    UNSAFE_DB_SSL_ENABLED: "false",
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("main database", () => {
  it("uses the bounded main pool configuration", async () => {
    const { db } = await import("@lib/db");

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
    expect(db).toEqual({ database: "main" });
  });
});
