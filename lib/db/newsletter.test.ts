import { beforeEach, describe, expect, it, type Mock, vi } from "vitest";

interface PoolStub {
  readonly pool: string;
}

interface DatabaseStub {
  readonly database: string;
}

const createDatabasePool: Mock<() => PoolStub> = vi.fn((): PoolStub => ({ pool: "newsletter" }));
const drizzle: Mock<() => DatabaseStub> = vi.fn((): DatabaseStub => ({ database: "newsletter" }));

vi.mock("@lib/db/database-pool", (): { createDatabasePool: typeof createDatabasePool } => ({
  createDatabasePool,
}));
vi.mock("@lib/db/database-ssl", (): { getDatabaseSslConfig: () => boolean } => ({
  getDatabaseSslConfig: (): boolean => false,
}));
vi.mock("@lib/db/newsletter-schema", (): { subscription: string } => ({
  subscription: "newsletter-schema",
}));
vi.mock("drizzle-orm/node-postgres", (): { drizzle: typeof drizzle } => ({ drizzle }));
vi.mock("@lib/env", (): { env: Readonly<Record<string, number | string>> } => ({
  env: {
    DATABASE_POOL_CONNECTION_TIMEOUT_MILLISECONDS: 5_000,
    DATABASE_POOL_IDLE_TIMEOUT_MILLISECONDS: 10_000,
    DATABASE_URL: "postgres://main.example/knowhere",
    NEWSLETTER_DATABASE_POOL_MAX: 1,
    NEWSLETTER_DATABASE_URL: "postgres://newsletter.example/knowhere",
    UNSAFE_DB_SSL_ENABLED: "false",
  },
}));

beforeEach((): void => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("newsletter database", (): void => {
  it("uses the independent bounded newsletter pool", async (): Promise<void> => {
    const newsletterModule: typeof import("@lib/db/newsletter") = await import(
      "@lib/db/newsletter"
    );

    expect(createDatabasePool).toHaveBeenCalledWith({
      connectionString: "postgres://newsletter.example/knowhere",
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      max: 1,
      ssl: false,
    });
    expect(drizzle).toHaveBeenCalledWith({
      client: { pool: "newsletter" },
      schema: {
        subscription: "newsletter-schema",
      },
    });
    expect(newsletterModule.newsletterDb).toEqual({ database: "newsletter" });
  });
});
