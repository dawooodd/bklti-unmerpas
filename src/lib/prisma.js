import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';


const connectionString = `${process.env.DATABASE_URL}`;


const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

// Global Singleton pattern untuk Next.js agar tidak bocor koneksi
const globalForPrisma = global;

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}