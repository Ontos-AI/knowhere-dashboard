import { beforeEach, describe, expect, it, vi } from "vitest";

const createDatabasePool = vi.fn(() => ({ pool: "newsletter" }));
const drizzle = vi.fn(() => ({ database: "newsletter" }));

vi.mock("@lib/db/database-pool", () => ({ createDatabasePool }));
vi.mock("@lib/db/database-ssl", () => ({ getDatabaseSslConfig: () => false }));
vi.mock("@lib/db/newsletter-schema", () => ({ subscription: "newsletter-schema" }));
vi.mock("drizzle-orm/node-postgres", () => ({ drizzle }));
vi.mock("@lib/env", () => ({
  env: {
    DATABASE_POOL_CONNECTION_TIMEOUT_MS: 5_000,
    DATABASE_POOL_IDLE_TIMEOUT_MS: 10_000,
    DATABASE_URL: "postgres://main.example/knowhere",
    NEWSLETTER_DATABASE_POOL_MAX: 1,
    NEWSLETTER_DATABASE_URL: "postgres://newsletter.example/knowhere",
    UNSAFE_DB_SSL_ENABLED: "false",
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
  vi.resetModules();
});

describe("newsletter database", () => {
  it("uses the independent bounded newsletter pool", async () => {
    const { newsletterDb } = await import("@lib/db/newsletter");

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
    expect(newsletterDb).toEqual({ database: "newsletter" });
  });
});
