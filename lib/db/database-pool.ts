import { attachDatabasePool } from "@vercel/functions";
import { Pool, type PoolConfig } from "pg";

export function createDatabasePool(configuration: PoolConfig): Pool {
  const pool: Pool = new Pool(configuration);

  if (process.env.VERCEL === "1") {
    attachDatabasePool(pool);
  }

  return pool;
}
