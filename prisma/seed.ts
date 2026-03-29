import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../src/generated/prisma/client.js";
import bcrypt from "bcryptjs";
import path from "path";

const dbPath = path.join(__dirname, "..", "dev.db");
const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
const prisma = new PrismaClient({ adapter });

async function main() {
  const password = await bcrypt.hash("password123", 12);

  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@reekruitr.com" },
    update: {},
    create: {
      email: "superadmin@reekruitr.com",
      password,
      firstName: "Super",
      lastName: "Admin",
      role: "SUPER_ADMIN",
    },
  });

  const admin = await prisma.user.upsert({
    where: { email: "admin@reekruitr.com" },
    update: {},
    create: {
      email: "admin@reekruitr.com",
      password,
      firstName: "Admin",
      lastName: "User",
      role: "ADMIN",
    },
  });

  const staff = await prisma.user.upsert({
    where: { email: "staff@reekruitr.com" },
    update: {},
    create: {
      email: "staff@reekruitr.com",
      password,
      firstName: "Staff",
      lastName: "Member",
      role: "STAFF",
    },
  });

  console.log("Seeded users:");
  console.log(`  SUPER_ADMIN: ${superAdmin.email}`);
  console.log(`  ADMIN:       ${admin.email}`);
  console.log(`  STAFF:       ${staff.email}`);
  console.log("\nAll passwords: password123");

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
