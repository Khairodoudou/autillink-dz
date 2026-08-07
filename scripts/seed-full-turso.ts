// scripts/seed-full-turso.ts
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

  console.log("🔗 Seeding full demo data on Turso at:", url);
  const client = createClient({ url, authToken });

  const now = new Date().toISOString();
  const passHash = await bcrypt.hash("password123", 10);
  const pinHash = await bcrypt.hash("1234", 10);

  // 1. Center
  const centerId = "center-001";
  await client.execute({
    sql: `INSERT OR REPLACE INTO "Center" ("id", "name", "director", "wilaya", "address", "phone", "email", "status", "createdAt", "updatedAt")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [centerId, "مركز الأمل لرعاية التوحد", "د. فريد حاج", "الجزائر", "بئر خادم، الجزائر", "021456789", "contact@centre-amal.dz", "ACTIVE", now, now],
  });

  // 2. Center Subscription
  await client.execute({
    sql: `INSERT OR REPLACE INTO "Subscription" ("id", "centerId", "plan", "price", "startDate", "endDate", "status", "createdAt", "updatedAt")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: ["sub-001", centerId, "PREMIUM", 35000, now, "2026-12-31T23:59:59.000Z", "ACTIVE", now, now],
  });

  // 3. Specialist
  const specId = "spec-001";
  await client.execute({
    sql: `INSERT OR REPLACE INTO "User" ("id", "role", "name", "email", "password", "phone", "speciality", "licenseNumber", "experience", "wilaya", "isActive", "centerId", "createdAt", "updatedAt")
          VALUES (?, 'SPECIALIST', ?, ?, ?, ?, ?, ?, ?, ?, 1, ?, ?, ?);`,
    args: [specId, "د. سارة كمال", "specialist@gmail.com", passHash, "0550123456", "أخصائية نطق وتواصل", "ALG-SLT-2018-0042", 8, "الجزائر", centerId, now, now],
  });

  // 4. Parent
  const parentId = "parent-001";
  await client.execute({
    sql: `INSERT OR REPLACE INTO "User" ("id", "role", "name", "email", "password", "phone", "wilaya", "address", "isActive", "createdAt", "updatedAt")
          VALUES (?, 'PARENT', ?, ?, ?, ?, ?, ?, 1, ?, ?);`,
    args: [parentId, "مراد بن علي", "parent@gmail.com", passHash, "0661987654", "الجزائر", "حي ريم، الشراقة", now, now],
  });

  // 5. Parent Subscription
  await client.execute({
    sql: `INSERT OR REPLACE INTO "IndividualSubscription" ("id", "parentId", "price", "startDate", "endDate", "status", "createdAt", "updatedAt")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    args: ["indiv-sub-001", parentId, 800, now, "2026-12-31T23:59:59.000Z", "ACTIVE", now, now],
  });

  // 6. Child
  const childId = "child-1786065001670-lp6y7";
  await client.execute({
    sql: `INSERT OR REPLACE INTO "Child" ("id", "name", "birthDate", "autismLevel", "pinCode", "avatarColor", "avatarInitial", "parentId", "specialistId", "createdAt", "updatedAt")
          VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);`,
    args: [childId, "آدم بن علي", "2019-05-15T00:00:00.000Z", "MOYEN", pinHash, "#E97F6B", "آ", parentId, specId, now, now],
  });

  console.log("🎉 Full demo database successfully populated on Turso!");
  console.log("   👑 Admin: admin@gmail.com / admin1234");
  console.log("   🩺 Specialist: specialist@gmail.com / password123");
  console.log("   👨‍👩‍👧 Parent: parent@gmail.com / password123");
  console.log("   👶 Child Mode ID: child-1786065001670-lp6y7 (PIN: 1234)");
}

main().catch((err) => {
  console.error("❌ Full seed error:", err);
});
