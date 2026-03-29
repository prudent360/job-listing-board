-- Add slug field to jobs, generating slugs for existing rows
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;

CREATE TABLE "new_jobs" (
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
);

-- Insert existing rows with auto-generated slugs based on company + title + id
INSERT INTO "new_jobs" ("approved_by_id", "category", "company", "created_at", "description", "external_apply_url", "id", "location", "posted_by_id", "salary", "slug", "status", "tags", "title", "type", "updated_at")
SELECT "approved_by_id", "category", "company", "created_at", "description", "external_apply_url", "id", "location", "posted_by_id", "salary",
  LOWER(REPLACE(REPLACE(REPLACE("company", ' ', '-'), '''', ''), '.', '') || '-is-hiring-for-' || REPLACE(REPLACE(REPLACE("title", ' ', '-'), '''', ''), '.', '') || '-' || "id"),
  "status", "tags", "title", "type", "updated_at"
FROM "jobs";

DROP TABLE "jobs";
ALTER TABLE "new_jobs" RENAME TO "jobs";
CREATE UNIQUE INDEX "jobs_slug_key" ON "jobs"("slug");

PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
