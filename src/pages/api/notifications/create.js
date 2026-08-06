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

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "ADMIN") {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Anda tidak memiliki izin untuk melakukan aksi ini.",
    });
  }

  try {
    const { type, date, message } = req.body;

    if (!type || !date || !message) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal. Jenis Notifikasi, Tanggal, dan Pesan wajib diisi.",
      });
    }

    const targetRole = type === "PENGUMUMAN" ? "ALL" : "MAHASISWA";

    const notification = await prisma.notification.create({
      data: {
        type,
        message: message.trim(),
        targetRole,
        date: new Date(date), 
      },
    });

    return res.status(201).json({
      success: true,
      message: "Broadcast notifikasi berhasil dikirim.",
      data: notification,
    });
  } catch (error) {
    console.error("Error saat membuat notifikasi:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server saat memproses broadcast.",
    });
  }
}
