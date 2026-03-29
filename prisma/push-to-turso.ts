import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

async function pushSchema() {
  const client = createClient({
    url: process.env.LIBSQL_URL!,
    authToken: process.env.LIBSQL_AUTH_TOKEN!,
  });

  console.log("Connected to Turso:", process.env.LIBSQL_URL);

  // Check existing tables
  const existing = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("Existing tables:", existing.rows.map(r => r.name));

  // Apply all migrations in order
  const migrations = [
    // 1. Initial tables
    `CREATE TABLE IF NOT EXISTS "users" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "email" TEXT NOT NULL,
      "password" TEXT NOT NULL,
      "first_name" TEXT NOT NULL,
      "last_name" TEXT NOT NULL,
      "phone" TEXT,
      "location" TEXT,
      "linkedin" TEXT,
      "github" TEXT,
      "role" TEXT NOT NULL DEFAULT 'JOB_SEEKER',
      "is_active" BOOLEAN NOT NULL DEFAULT true,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "users_email_key" ON "users"("email")`,

    `CREATE TABLE IF NOT EXISTS "jobs" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "title" TEXT NOT NULL,
      "slug" TEXT NOT NULL,
      "company" TEXT NOT NULL,
      "location" TEXT NOT NULL,
      "type" TEXT NOT NULL DEFAULT 'Full-time',
      "salary" TEXT NOT NULL,
      "category" TEXT NOT NULL,
      "description" TEXT NOT NULL,
      "tags" TEXT NOT NULL DEFAULT '',
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "external_apply_url" TEXT,
      "posted_by_id" INTEGER NOT NULL,
      "approved_by_id" INTEGER,
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL,
      CONSTRAINT "jobs_posted_by_id_fkey" FOREIGN KEY ("posted_by_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "jobs_slug_key" ON "jobs"("slug")`,

    `CREATE TABLE IF NOT EXISTS "applications" (
      "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
      "job_id" INTEGER NOT NULL,
      "user_id" INTEGER NOT NULL,
      "cover_note" TEXT NOT NULL DEFAULT '',
      "status" TEXT NOT NULL DEFAULT 'SUBMITTED',
      "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updated_at" DATETIME NOT NULL,
      CONSTRAINT "applications_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "jobs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      CONSTRAINT "applications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    )`,
    `CREATE UNIQUE INDEX IF NOT EXISTS "applications_job_id_user_id_key" ON "applications"("job_id", "user_id")`,

    `CREATE TABLE IF NOT EXISTS "settings" (
      "key" TEXT NOT NULL PRIMARY KEY,
      "value" TEXT NOT NULL,
      "updated_at" DATETIME NOT NULL
    )`,
  ];

  for (const sql of migrations) {
    try {
      await client.execute(sql);
      console.log("✓", sql.slice(0, 60) + "...");
    } catch (err: any) {
      // Ignore "already exists" errors
      if (err.message?.includes("already exists")) {
        console.log("⊘ Already exists:", sql.slice(0, 60) + "...");
      } else {
        console.error("✗ Error:", err.message, "\n  SQL:", sql.slice(0, 80));
      }
    }
  }

  // Verify
  const tables = await client.execute("SELECT name FROM sqlite_master WHERE type='table'");
  console.log("\nFinal tables:", tables.rows.map(r => r.name));
  console.log("Done!");
}

pushSchema().catch(console.error);
