// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // En production (Vercel) → Turso | En local → SQLite file
    url: process.env["TURSO_DATABASE_URL"] ?? process.env["DATABASE_URL"],
  },
});
