// Run database migrations by executing SQL files
// This script runs before the Next.js app starts in Docker
// Uses only 'pg' package which is already included in Next.js standalone
const { Pool } = require("pg");
const fs = require("fs");
const path = require("path");

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

  try {
    const client = await pool.connect();
    console.log("✅ Connected to database");

    // Get migration files
    const migrationsDir = path.join(__dirname, "../drizzle");
    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // Ensure migrations run in order

    console.log(`📂 Found ${files.length} migration files`);

    // Check if migrations table exists
    await client.query(`
      CREATE TABLE IF NOT EXISTS __drizzle_migrations (
        id SERIAL PRIMARY KEY,
        hash TEXT NOT NULL,
        created_at BIGINT
      )
    `);

    // Get applied migrations
    const { rows: applied } = await client.query("SELECT hash FROM __drizzle_migrations");
    const appliedHashes = new Set(applied.map((row) => row.hash));

    // Run pending migrations
    let executedCount = 0;
    for (const file of files) {
      const filePath = path.join(migrationsDir, file);
      const sql = fs.readFileSync(filePath, "utf-8");
      const hash = file; // Use filename as hash

      if (appliedHashes.has(hash)) {
        console.log(`⏭️  Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`🔄 Applying ${file}...`);
      await client.query(sql);
      await client.query("INSERT INTO __drizzle_migrations (hash, created_at) VALUES ($1, $2)", [
        hash,
        Date.now(),
      ]);
      executedCount++;
      console.log(`✅ Applied ${file}`);
    }

    client.release();
    await pool.end();

    if (executedCount === 0) {
      console.log("✅ Database is up to date (no pending migrations)");
    } else {
      console.log(`✅ Successfully applied ${executedCount} migration(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    await pool.end();
    process.exit(1);
  }
}

runMigrations();
