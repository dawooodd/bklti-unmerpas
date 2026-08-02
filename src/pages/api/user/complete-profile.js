import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan. Gunakan POST.`,
    });
  }

  // Cek apakah user sudah login
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user) {
    return res.status(401).json({
      success: false,
      message: "Tidak terautentikasi. Silakan login terlebih dahulu.",
    });
  }

  const { nim, prodi } = req.body;

  if (!nim || !nim.trim()) {
    return res.status(400).json({ success: false, message: "NIM wajib diisi." });
  }

  if (!prodi || !prodi.trim()) {
    return res.status(400).json({ success: false, message: "Program Studi wajib dipilih." });
  }

  try {
    // Update data user di database
    const updatedUser = await prisma.user.update({
      where: {
        id: session.user.id,
      },
      data: {
        nim: nim.trim(),
        prodi: prodi.trim(),
      },
    });

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui.",
      user: {
        id: updatedUser.id,
        nim: updatedUser.nim,
        prodi: updatedUser.prodi,
      },
    });
  } catch (error) {
    console.error("Error updating profile:", error);

    // Tangani error NIM duplikat (P2002 di Prisma)
    if (error.code === "P2002" && error.meta?.target?.includes("nim")) {
      return res.status(409).json({
        success: false,
        message: "NIM ini sudah terdaftar. Silakan hubungi Helpdesk jika ini adalah kesalahan.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat menyimpan profil.",
    });
  }
}
