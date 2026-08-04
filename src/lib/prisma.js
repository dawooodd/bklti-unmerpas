import { PrismaClient } from "@prisma/client";
import { Pool, neonConfig } from "@neondatabase/serverless";
import { PrismaNeon } from "@prisma/adapter-neon";
import ws from "ws";

// Set up WebSocket for Neon in Node.js (Serverless) environments
neonConfig.webSocketConstructor = ws;

// ============================================
// Prisma Client Singleton untuk Vercel Serverless
// ============================================
// Menggunakan @neondatabase/serverless agar koneksi database
// stabil dan mencegah error "connection limit reached".

const globalForPrisma = globalThis;

function createPrismaClient() {
  // Sanity Check: Pastikan URL eksis sebelum diteruskan ke Pool
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error(
      "❌ DATABASE_URL tidak ditemukan di environment variables! " +
      "Pastikan Anda telah mengisi DATABASE_URL di file .env atau Vercel settings."
    );
  }

  // Explicitly passing connectionString to Pool
  const pool = new Pool({ connectionString });
  const adapter = new PrismaNeon(pool);

  // Injeksi datasourceUrl secara eksplisit sesuai aturan Prisma 7
  return new PrismaClient({
    adapter,
    datasourceUrl: connectionString,
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
