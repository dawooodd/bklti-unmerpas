const { PrismaClient } = require("@prisma/client");
const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const bcrypt = require("bcryptjs");

const adapter = new PrismaBetterSqlite3({ url: "file:./dev.db" });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding database...\n");

  // =============================================
  // Buat akun Admin default
  // =============================================
  const adminPassword = await bcrypt.hash("admin123", 10);
  const admin = await prisma.user.upsert({
    where: { email: "admin@bklti.ac.id" },
    update: {},
    create: {
      email: "admin@bklti.ac.id",
      password: adminPassword,
      name: "Admin BKLTI",
      role: "ADMIN",
    },
  });
  console.log(`✅ Admin: ${admin.email} (role: ${admin.role})`);

  // =============================================
  // Buat akun Mahasiswa contoh
  // =============================================
  const mahasiswaPassword = await bcrypt.hash("mhs123", 10);
  const mahasiswa = await prisma.user.upsert({
    where: { email: "mahasiswa@unmerpas.ac.id" },
    update: {},
    create: {
      email: "mahasiswa@unmerpas.ac.id",
      password: mahasiswaPassword,
      name: "Budi Santoso",
      role: "MAHASISWA",
    },
  });
  console.log(`✅ Mahasiswa: ${mahasiswa.email} (role: ${mahasiswa.role})`);

  // =============================================
  // Buat notifikasi contoh
  // =============================================
  const notifications = await prisma.notification.createMany({
    data: [
      {
        type: "SPP",
        message: "Batas pembayaran SPP semester genap 2025/2026 adalah 15 September 2026.",
        targetRole: "MAHASISWA",
        date: new Date("2026-09-15"),
      },
      {
        type: "UJIAN",
        message: "Ujian Tengah Semester (UTS) dimulai tanggal 20 Oktober 2026.",
        targetRole: "MAHASISWA",
        date: new Date("2026-10-20"),
      },
      {
        type: "PENGUMUMAN",
        message: "Maintenance server kampus akan dilaksanakan pada 10 Agustus 2026 pukul 22:00 - 06:00 WIB.",
        targetRole: "ALL",
        date: new Date("2026-08-10"),
      },
    ],
    skipDuplicates: true,
  });
  console.log(`✅ ${notifications.count} notifikasi dibuat`);

  console.log("\n🎉 Seeding selesai!");
  console.log("\n📋 Akun Login:");
  console.log("   Admin     → admin@bklti.ac.id / admin123");
  console.log("   Mahasiswa → mahasiswa@unmerpas.ac.id / mhs123");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
