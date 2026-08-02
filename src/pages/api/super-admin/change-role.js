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

  // 1. Pengecekan Autentikasi dan Otorisasi (Hanya SUPER_ADMIN)
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Hanya SUPER_ADMIN yang dapat mengubah hak akses pengguna.",
    });
  }

  const { userId, newRole } = req.body;

  if (!userId || !newRole) {
    return res.status(400).json({
      success: false,
      message: "Parameter userId dan newRole wajib disertakan.",
    });
  }

  if (newRole !== "ADMIN" && newRole !== "USER") {
    return res.status(400).json({
      success: false,
      message: "Role yang diizinkan hanya 'ADMIN' atau 'USER'.",
    });
  }

  try {
    // 2. Logika KUOTA Admin: Maksimal 2 Admin
    if (newRole === "ADMIN") {
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount >= 2) {
        return res.status(403).json({
          success: false,
          message: "Kuota Admin Penuh (Maksimal 2). Turunkan salah satu Admin sebelum mengangkat yang baru.",
        });
      }
    }

    // Hindari Super Admin mengubah role-nya sendiri
    if (userId === session.user.id) {
        return res.status(403).json({
            success: false,
            message: "SUPER_ADMIN tidak bisa mengubah role-nya sendiri dari halaman ini."
        });
    }

    // 3. Eksekusi Update Role
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });

    return res.status(200).json({
      success: true,
      message: `Hak akses pengguna ${updatedUser.name} berhasil diubah menjadi ${newRole}.`,
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        role: updatedUser.role,
      },
    });
  } catch (error) {
    console.error("Error changing role:", error);
    
    // Tangani jika user ID tidak ditemukan
    if (error.code === "P2025") {
      return res.status(404).json({
        success: false,
        message: "Pengguna tidak ditemukan di database.",
      });
    }

    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan server saat memproses pembaruan role.",
    });
  }
}
