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

    const cleanName = name?.trim();
    const cleanEmail = email?.trim().toLowerCase();
    const cleanNim = nim?.trim();
    const cleanProdi = prodi?.trim();

    if (!cleanName || !cleanEmail || !cleanNim || !cleanProdi || !password) {
      return res.status(400).json({ message: "Semua field (termasuk password) wajib diisi." });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(cleanEmail)) {
      return res.status(400).json({ message: "Format email tidak valid." });
    }

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

    const hashedPassword = await bcrypt.hash(password, 10);

    let assignedRole = "USER";

    if (cleanProdi === "Tendik (Tenaga Kependidikan)") {
      
      const superAdminCount = await prisma.user.count({
        where: { role: "SUPER_ADMIN" },
      });

      if (superAdminCount === 0) {
        assignedRole = "SUPER_ADMIN";
        console.log(`[BOOTSTRAP] Pengguna pertama (Tendik) mendaftar. Diberikan role SUPER_ADMIN: ${cleanEmail}`);
      }
    }

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

    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email atau NIM sudah terdaftar!" });
    }

    console.error("🔥 FATAL REGISTER ERROR 🔥:", error);

    return res.status(500).json({ 
      error: error.message || 'Error internal server', 
      details: error.toString() 
    });
  }
}
