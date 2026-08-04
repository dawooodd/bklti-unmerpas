import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  try {
    const { name, email, nim, prodi } = req.body;

    // Validasi input dasar
    if (!name || !email || !nim || !prodi) {
      return res.status(400).json({ message: "Semua field wajib diisi." });
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: "Format email tidak valid." });
    }

    // TAHAP 3: Logika Bootstrapping Super Admin (Tendik Only)
    let assignedRole = "USER";

    if (prodi === "Tendik (Tenaga Kependidikan)") {
      // Cek apakah sudah ada SUPER_ADMIN di database
      const superAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN" },
      });

      // Jika belum ada sama sekali, jadikan pendaftar Tendik pertama ini sebagai SUPER_ADMIN
      if (superAdminCount === 0) {
        assignedRole = "SUPER_ADMIN";
        console.log(`[BOOTSTRAP] Pengguna pertama (Tendik) mendaftar. Diberikan role SUPER_ADMIN: ${email}`);
      }
    }

    // TAHAP 1: Operasi Create dengan Blok try..catch spesifik
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        nim: nim.trim(),
        prodi: prodi.trim(),
        role: assignedRole,
        adminRequestStatus: "NONE",
      },
    });

    return res.status(200).json({
      message: "Pendaftaran berhasil",
      user: newUser,
    });
  } catch (error) {
    // TAHAP 1: Penanganan Error Spesifik
    
    // Cek jika error dari Prisma (P2002: Unique Constraint Violation)
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email atau NIM sudah terdaftar!" });
    }

    // TAHAP 3: Tambahkan log mendetail untuk debugging di Vercel
    console.error("PRISMA ERROR DETAILS:", error);

    // Tangkap error lain (terutama masalah koneksi Neon DB Serverless)
    return res.status(500).json({ error: error.message });
  }
}
