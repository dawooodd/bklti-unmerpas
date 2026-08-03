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

    // Cek apakah email sudah terdaftar
    const existingEmail = await prisma.user.findUnique({
      where: { email },
    });
    if (existingEmail) {
      return res.status(400).json({ message: "Email ini sudah terdaftar. Silakan langsung masuk." });
    }

    // Cek apakah NIM sudah terdaftar (NIM harus unik)
    const existingNim = await prisma.user.findUnique({
      where: { nim },
    });
    if (existingNim) {
      return res.status(400).json({ message: "NIM ini sudah terdaftar oleh pengguna lain." });
    }

    // Simpan ke database dengan role default USER dan status NONE
    const newUser = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        nim: nim.trim(),
        prodi: prodi.trim(),
        role: "USER",
        adminRequestStatus: "NONE",
      },
    });

    return res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil",
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Error Registration API:", error);
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}
