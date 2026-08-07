// scripts/seed-admin-turso.ts
import "dotenv/config";
import { createClient } from "@libsql/client";
import bcrypt from "bcryptjs";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN missing in .env");
    process.exit(1);
  }

  console.log("🔗 Connecting to Turso database at:", url);
  const client = createClient({ url, authToken });

  // 1. Hash Admin Password "admin1234"
  const passwordHash = await bcrypt.hash("admin1234", 10);
  const now = new Date().toISOString();

  // 2. Insert or replace Admin account
  await client.execute({
    sql: `INSERT OR REPLACE INTO "User" (
      "id", "role", "name", "email", "password", "phone", "wilaya", "isActive", "createdAt", "updatedAt"
    ) VALUES (?, ?, ?, ?, ?, ?, ?, 1, ?, ?);`,
    args: [
      "admin-user-001",
      "ADMIN",
      "مدير النظام",
      "admin@gmail.com",
      passwordHash,
      "0550000000",
      "الجزائر",
      now,
      now,
    ],
  });

  console.log("✅ Admin user added successfully to Turso Cloud!");
  console.log("   📧 Email: admin@gmail.com");
  console.log("   🔑 Password: admin1234");
}

main().catch((err) => {
  console.error("❌ Failed to add admin to Turso:", err);
  process.exit(1);
});
