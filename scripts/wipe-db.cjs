const { Pool } = require("pg");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../backend/.env") });

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
    console.error("❌ DATABASE_URL not found in .env");
    process.exit(1);
}

const pool = new Pool({ connectionString });

async function wipeDatabase() {
    console.log("🔥 WARNING: Wiping the entire database...");

    const client = await pool.connect();
    try {
        // Get all tables in the public schema
        const res = await client.query(`
      SELECT tablename 
      FROM pg_catalog.pg_tables 
      WHERE schemaname = 'public' AND tablename != '_prisma_migrations';
    `);

        const tables = res.rows.map(row => `"${row.tablename}"`);

        if (tables.length > 0) {
            console.log(`🧹 Truncating ${tables.length} tables...`);
            // Use CASCADE to handle foreign keys, RESTART IDENTITY to reset IDs
            await client.query(`TRUNCATE TABLE ${tables.join(", ")} RESTART IDENTITY CASCADE;`);
            console.log("✅ All tables cleared and identities reset.");
        } else {
            console.log("ℹ️ No tables found to truncate.");
        }
    } catch (err) {
        console.error("❌ Error during database wipe:", err);
    } finally {
        client.release();
        await pool.end();
    }
}

wipeDatabase();
