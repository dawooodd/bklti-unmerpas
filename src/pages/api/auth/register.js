import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: `Method ${req.method} tidak diizinkan` });
  }

  try {
    const { name, email, password, nim, prodi } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Nama, email, dan password wajib diisi" });
    }

    // Cek apakah email sudah terdaftar
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return res.status(409).json({ message: "Email sudah terdaftar" });
    }

    // Cek apakah NIM sudah terdaftar (jika diisi)
    if (nim) {
      const existingNim = await prisma.user.findUnique({
        where: { nim },
      });

      if (existingNim) {
        return res.status(409).json({ message: "NIM sudah terdaftar" });
      }
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Simpan user baru ke database
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        nim: nim || null,
        prodi: prodi || null,
        // Role default adalah USER (diambil otomatis dari default skema)
      },
    });

    return res.status(201).json({
      message: "Pendaftaran berhasil",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error("Error Registration:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server saat pendaftaran" });
  }
}
