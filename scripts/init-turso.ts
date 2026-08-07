// scripts/init-turso.ts
import "dotenv/config";
import { createClient } from "@libsql/client";

async function main() {
  const url = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!url || !authToken) {
    console.error("❌ TURSO_DATABASE_URL or TURSO_AUTH_TOKEN missing in .env");
    process.exit(1);
  }

  console.log("🔗 Connecting to Turso database at:", url);
  const client = createClient({ url, authToken });

  const statements = [
    `CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "role" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "email" TEXT NOT NULL UNIQUE,
      "phone" TEXT,
      "password" TEXT NOT NULL,
      "wilaya" TEXT,
      "address" TEXT,
      "speciality" TEXT,
      "licenseNumber" TEXT,
      "experience" INTEGER,
      "isActive" BOOLEAN NOT NULL DEFAULT true,
      "centerId" TEXT,
      "lastLoginAt" DATETIME,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "Center" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "director" TEXT,
      "wilaya" TEXT NOT NULL,
      "address" TEXT,
      "phone" TEXT,
      "email" TEXT,
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS "Subscription" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "centerId" TEXT NOT NULL UNIQUE,
      "plan" TEXT NOT NULL,
      "price" INTEGER NOT NULL,
      "startDate" DATETIME NOT NULL,
      "endDate" DATETIME NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("centerId") REFERENCES "Center" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "IndividualSubscription" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "parentId" TEXT NOT NULL UNIQUE,
      "price" INTEGER NOT NULL DEFAULT 800,
      "startDate" DATETIME NOT NULL,
      "endDate" DATETIME NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'ACTIVE',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );`,

    `CREATE TABLE IF NOT EXISTS "Child" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "name" TEXT NOT NULL,
      "birthDate" DATETIME NOT NULL,
      "autismLevel" TEXT,
      "pinCode" TEXT NOT NULL,
      "avatarColor" TEXT NOT NULL DEFAULT '#E97F6B',
      "avatarInitial" TEXT,
      "parentId" TEXT NOT NULL,
      "specialistId" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("parentId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("specialistId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "Report" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "childId" TEXT NOT NULL,
      "authorId" TEXT NOT NULL,
      "mood" INTEGER,
      "sleepHours" REAL,
      "tantrums" INTEGER,
      "newWords" TEXT,
      "exercises" TEXT,
      "notes" TEXT,
      "type" TEXT NOT NULL DEFAULT 'DAILY',
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("authorId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "Assessment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "childId" TEXT NOT NULL,
      "authorId" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "answers" TEXT NOT NULL,
      "score" INTEGER NOT NULL,
      "maxScore" INTEGER NOT NULL,
      "result" TEXT NOT NULL,
      "recommendation" TEXT,
      "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "Appointment" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "childId" TEXT NOT NULL,
      "specialistId" TEXT,
      "date" DATETIME NOT NULL,
      "time" TEXT,
      "duration" INTEGER NOT NULL DEFAULT 60,
      "type" TEXT NOT NULL DEFAULT 'SESSION',
      "status" TEXT NOT NULL DEFAULT 'PENDING',
      "location" TEXT,
      "notes" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL,
      FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
      FOREIGN KEY ("specialistId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "Message" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "senderId" TEXT NOT NULL,
      "receiverId" TEXT NOT NULL,
      "childId" TEXT,
      "content" TEXT NOT NULL,
      "read" BOOLEAN NOT NULL DEFAULT false,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("senderId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY ("receiverId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
      FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE SET NULL ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "GameScore" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "childId" TEXT NOT NULL,
      "gameType" TEXT NOT NULL,
      "stars" INTEGER NOT NULL,
      "playedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY ("childId") REFERENCES "Child" ("id") ON DELETE CASCADE ON UPDATE CASCADE
    );`,

    `CREATE TABLE IF NOT EXISTS "Complaint" (
      "id" TEXT NOT NULL PRIMARY KEY,
      "fromEmail" TEXT NOT NULL,
      "fromName" TEXT NOT NULL,
      "fromRole" TEXT,
      "subject" TEXT NOT NULL,
      "message" TEXT NOT NULL,
      "priority" TEXT NOT NULL DEFAULT 'MEDIUM',
      "status" TEXT NOT NULL DEFAULT 'OPEN',
      "assignedTo" TEXT,
      "resolution" TEXT,
      "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" DATETIME NOT NULL
    );`,
  ];

  for (const sql of statements) {
    await client.execute(sql);
  }

  console.log("✅ All 11 tables successfully created on Turso cloud!");
}

main().catch((err) => {
  console.error("❌ Turso Init Failed:", err);
  process.exit(1);
});
