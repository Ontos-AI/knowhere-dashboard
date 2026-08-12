import { createDatabasePool } from "@lib/db/database-pool";
import { attachDatabasePool } from "@vercel/functions";
import type { Pool } from "pg";
import { afterEach, describe, expect, it, vi } from "vitest";

vi.mock("@vercel/functions", (): { attachDatabasePool: ReturnType<typeof vi.fn> } => ({
  attachDatabasePool: vi.fn(),
}));

afterEach((): void => {
  vi.clearAllMocks();
  vi.unstubAllEnvs();
});

describe("createDatabasePool", (): void => {
  it("creates a bounded pool without Vercel lifecycle registration outside Vercel", async (): Promise<void> => {
    vi.stubEnv("VERCEL", undefined);

    const pool: Pool = createDatabasePool({
      connectionString: "postgres://user:pass@example.com:5432/knowhere",
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      max: 2,
      ssl: false,
    });

    expect(pool.options).toMatchObject({
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      max: 2,
    });
    expect(attachDatabasePool).not.toHaveBeenCalled();
    await pool.end();
  });

  it("registers the bounded pool with the Vercel lifecycle", async (): Promise<void> => {
    vi.stubEnv("VERCEL", "1");

    const pool: Pool = createDatabasePool({
      connectionString: "postgres://user:pass@example.com:5432/knowhere",
      connectionTimeoutMillis: 5_000,
      idleTimeoutMillis: 10_000,
      max: 1,
      ssl: false,
    });

    expect(attachDatabasePool).toHaveBeenCalledOnce();
    expect(attachDatabasePool).toHaveBeenCalledWith(pool);
    expect(pool.options.max).toBe(1);
    await pool.end();
  });
});
