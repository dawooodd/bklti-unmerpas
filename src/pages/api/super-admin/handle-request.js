import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions, isCampusEmail } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method tidak diizinkan." });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ message: "Akses ditolak. Hanya Super Admin." });
  }

  try {
    const { userId, action } = req.body;
    if (!userId || !action) {
      return res.status(400).json({ message: "Parameter tidak lengkap." });
    }

    if (action === "DELETE") {
      await prisma.user.delete({ where: { id: userId } });
      return res.status(200).json({ message: "Akun pengguna berhasil dihapus." });
    }

    if (action === "REJECT") {
      await prisma.user.update({
        where: { id: userId },
        data: { adminRequestStatus: "REJECTED" },
      });
      return res.status(200).json({ message: "Pengajuan ditolak." });
    }

    if (action === "APPROVE") {
      // 1. Cek Kuota Admin (Maksimal 3)
      const adminCount = await prisma.user.count({
        where: { role: "ADMIN" },
      });

      if (adminCount >= 3) {
        // Otomatis tolak jika kuota penuh
        await prisma.user.update({
          where: { id: userId },
          data: { adminRequestStatus: "REJECTED" },
        });
        return res.status(403).json({ message: "Gagal: Slot Admin sudah penuh (Maksimal 3). Request ini otomatis ditolak." });
      }

      // 2. Ambil user target
      const targetUser = await prisma.user.findUnique({
        where: { id: userId },
        select: { email: true },
      });

      if (!targetUser) {
        return res.status(404).json({ message: "Pengguna tidak ditemukan." });
      }

      // 3. Validasi Domain Kampus
      if (!isCampusEmail(targetUser.email)) {
        await prisma.user.update({
          where: { id: userId },
          data: { adminRequestStatus: "REJECTED" },
        });
        return res.status(403).json({ message: "Gagal: Hanya email kampus (@unmerpas.ac.id) yang bisa dijadikan Admin." });
      }

      // 4. Eksekusi Persetujuan
      await prisma.user.update({
        where: { id: userId },
        data: { role: "ADMIN", adminRequestStatus: "APPROVED" },
      });
      
      return res.status(200).json({ message: "Pengajuan disetujui. Pengguna sekarang menjadi ADMIN." });
    }

    return res.status(400).json({ message: "Aksi tidak dikenali." });

  } catch (error) {
    console.error("Error handling request:", error);
    if (error.code === "P2025") {
      return res.status(404).json({ message: "Data tidak ditemukan." });
    }
    return res.status(500).json({ message: "Terjadi kesalahan server." });
  }
}
