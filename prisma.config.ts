import { defineConfig } from "prisma/config";
import fs from "fs";
import path from "path";

function getDatabaseUrl() {
  if (process.env.DATABASE_URL) return process.env.DATABASE_URL;
  try {
    const envFile = fs.readFileSync(path.resolve(process.cwd(), ".env"), "utf-8");
    const match = envFile.match(/^DATABASE_URL=(.*)$/m);
    if (match) {
      return match[1].replace(/["']/g, "");
    }
  } catch (e) {
    console.warn("Could not read DATABASE_URL from .env");
  }
  return "";
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: getDatabaseUrl(),
  },
});
