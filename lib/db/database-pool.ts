import { attachDatabasePool } from "@vercel/functions";
import { Pool, type PoolConfig } from "pg";

export function createDatabasePool(config: PoolConfig): Pool {
  const pool = new Pool(config);

  if (process.env.VERCEL === "1") {
    attachDatabasePool(pool);
  }

  return pool;
}
