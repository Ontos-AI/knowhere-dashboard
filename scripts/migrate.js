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

  let client;

  try {
    client = await pool.connect();
    console.log("✅ Connected to database");

    // Get migration files
    const migrationsDir = path.join(__dirname, "../drizzle");

    // Check if migrations directory exists
    if (!fs.existsSync(migrationsDir)) {
      console.error(`❌ Migrations directory not found: ${migrationsDir}`);
      process.exit(1);
    }

    const files = fs
      .readdirSync(migrationsDir)
      .filter((file) => file.endsWith(".sql"))
      .sort(); // Ensure migrations run in order

    console.log(`📂 Found ${files.length} migration files in ${migrationsDir}`);

    // Create migrations tracking table
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
      const hash = file; // Use filename as hash

      if (appliedHashes.has(hash)) {
        console.log(`⏭️  Skipping ${file} (already applied)`);
        continue;
      }

      console.log(`🔄 Applying ${file}...`);

      const sql = fs.readFileSync(filePath, "utf-8");

      try {
        // Use transaction for each migration file
        await client.query("BEGIN");

        // Execute the migration SQL
        await client.query(sql);

        // Record the migration
        await client.query("INSERT INTO __drizzle_migrations (hash, created_at) VALUES ($1, $2)", [
          hash,
          Date.now(),
        ]);

        // Commit transaction
        await client.query("COMMIT");

        executedCount++;
        console.log(`✅ Applied ${file}`);
      } catch (error) {
        // Rollback transaction on error
        await client.query("ROLLBACK");
        console.error(`❌ Failed to apply ${file}:`, error.message);
        throw error;
      }
    }

    if (executedCount === 0) {
      console.log("✅ Database is up to date (no pending migrations)");
    } else {
      console.log(`✅ Successfully applied ${executedCount} migration(s)`);
    }

    process.exit(0);
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  } finally {
    // Clean up
    if (client) {
      client.release();
    }
    await pool.end();
  }
}

runMigrations();
