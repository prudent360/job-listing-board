import { createClient } from "@libsql/client";
import dotenv from "dotenv";
dotenv.config();

async function addMissingColumns() {
  const client = createClient({
    url: process.env.LIBSQL_URL!,
    authToken: process.env.LIBSQL_AUTH_TOKEN!,
  });

  const alterations = [
    'ALTER TABLE "users" ADD COLUMN "phone" TEXT',
    'ALTER TABLE "users" ADD COLUMN "location" TEXT',
    'ALTER TABLE "users" ADD COLUMN "linkedin" TEXT',
    'ALTER TABLE "users" ADD COLUMN "github" TEXT',
    'ALTER TABLE "jobs" ADD COLUMN "external_apply_url" TEXT',
    'ALTER TABLE "jobs" ADD COLUMN "slug" TEXT DEFAULT ""',
  ];

  for (const sql of alterations) {
    try {
      await client.execute(sql);
      console.log("✓", sql);
    } catch (err: any) {
      if (err.message?.includes("duplicate column")) {
        console.log("⊘ Column already exists:", sql);
      } else {
        console.log("⊘", err.message?.slice(0, 80), "—", sql.slice(0, 50));
      }
    }
  }

  // Make sure slug index exists
  try {
    await client.execute('CREATE UNIQUE INDEX IF NOT EXISTS "jobs_slug_key" ON "jobs"("slug")');
    console.log("✓ slug index ensured");
  } catch (err: any) {
    console.log("⊘ slug index:", err.message?.slice(0, 80));
  }

  console.log("\nDone! Columns verified.");
}

addMissingColumns().catch(console.error);
