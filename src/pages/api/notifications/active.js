import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan." });
  }

  // Cek session — hanya user yang login bisa melihat notifikasi
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ success: false, message: "Silakan login terlebih dahulu." });
  }

  try {
    const userRole = session.user.role || "USER";

    // Ambil notifikasi yang relevan untuk user ini
    // targetRole "ALL" → semua user | "MAHASISWA" → hanya role USER
    const notifications = await prisma.notification.findMany({
      where: {
        OR: [
          { targetRole: "ALL" },
          ...(userRole === "USER" ? [{ targetRole: "MAHASISWA" }] : []),
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 5,
    });

    const serialized = notifications.map((n) => ({
      ...n,
      date: n.date.toISOString(),
      createdAt: n.createdAt.toISOString(),
    }));

    return res.status(200).json({ success: true, data: serialized });
  } catch (error) {
    console.error("Error fetching active notifications:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}
