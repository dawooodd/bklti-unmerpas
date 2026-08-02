import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import path from "path";

// ============================================
// Prisma Client Singleton untuk Next.js
// ============================================
// Pola Singleton mencegah kebocoran koneksi (too many connections)
// saat hot-reloading di development mode (next dev).
// Referensi: https://www.prisma.io/docs/guides/other/troubleshooting-orm/help-articles/nextjs-prisma-client-dev-practices

const globalForPrisma = globalThis;

function createPrismaClient() {
  // Path absolut ke file database SQLite, relatif dari root project.
  // Ini memastikan path konsisten baik saat dipanggil dari API route,
  // getServerSideProps, maupun dari prisma.config.ts.
  const dbPath = path.join(process.cwd(), "prisma", "dev.db");
  const adapter = new PrismaBetterSqlite3({ url: `file:${dbPath}` });
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
