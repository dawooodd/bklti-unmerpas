import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (!process.env.DATABASE_URL) {
    return res.status(500).json({ error: "FATAL: DATABASE_URL tidak terbaca oleh server" });
  }

  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  try {
    console.log("INCOMING DATA:", req.body);
    const { name, email, nim, prodi, password } = req.body;
    
    // Bersihkan input
    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanNim = nim?.trim();
    const cleanProdi = prodi?.trim();

    // Validasi input dasar
    if (!cleanName || !cleanEmail || !cleanNim || !cleanProdi || !password) {
      return res.status(400).json({ message: "Semua field (termasuk password) wajib diisi." });
    }

    // Validasi format email sederhana
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Format email tidak valid." });
    }

    // Cek duplikasi email atau NIM
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: cleanEmail },
          { nim: cleanNim }
        ]
      }
    });

    if (existingUser) {
      if (existingUser.email === cleanEmail) {
        return res.status(400).json({ message: "Email sudah digunakan." });
      }
      return res.status(400).json({ message: "NIM sudah terdaftar." });
    }

    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);

    // TAHAP 3: Logika Bootstrapping Super Admin (Tendik Only)
    let assignedRole = "USER";

    if (cleanProdi === "Tendik (Tenaga Kependidikan)") {
      // Cek apakah sudah ada SUPER_ADMIN di database
      const superAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN" },
      });

      // Jika belum ada sama sekali, jadikan pendaftar Tendik pertama ini sebagai SUPER_ADMIN
      if (superAdminCount === 0) {
        assignedRole = "SUPER_ADMIN";
        console.log(`[BOOTSTRAP] Pengguna pertama (Tendik) mendaftar. Diberikan role SUPER_ADMIN: ${cleanEmail}`);
      }
    }

    // TAHAP 1: Operasi Create dengan Blok try..catch spesifik
    const newUser = await prisma.user.create({
      data: {
        name: cleanName,
        email: cleanEmail,
        nim: cleanNim,
        prodi: cleanProdi,
        password: hashedPassword,
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

    // TAHAP 2: Super-Logging
    console.error("🔥 FATAL REGISTER ERROR 🔥:", error);

    // Kembalikan detail error ke frontend
    return res.status(500).json({ 
      error: error.message || 'Error internal server', 
      details: error.toString() 
    });
  }
}
