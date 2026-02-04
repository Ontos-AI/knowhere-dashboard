// Run database migrations using drizzle-orm
// This script runs before the Next.js app starts in Docker
const { drizzle } = require("drizzle-orm/node-postgres");
const { migrate } = require("drizzle-orm/node-postgres/migrator");
const { Pool } = require("pg");

async function runMigrations() {
  console.log("🔄 Running database migrations...");

  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL is not set!");
    process.exit(1);
  }

  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false, // AWS RDS requires SSL
    },
  });

  const db = drizzle({ client: pool });

  try {
    await migrate(db, { migrationsFolder: "./drizzle" });
    console.log("✅ Database migrations completed successfully");
    await pool.end();
    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
