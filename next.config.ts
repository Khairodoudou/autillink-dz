import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for @libsql/client to work correctly in Vercel serverless
  serverExternalPackages: ["@libsql/client", "better-sqlite3"],
};

export default nextConfig;
