import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  if (req.method !== "PUT") {
    return res.status(405).json({ message: "Method tidak diizinkan" });
  }

  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401).json({ message: "Harap login terlebih dahulu" });
  }

  try {
    const { action, name, email } = req.body;
    const userId = session.user.id;

    if (action === "UPDATE_INFO") {
      if (!name || !email) {
        return res.status(400).json({ message: "Nama dan Email wajib diisi." });
      }
      
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { name: name.trim(), email: email.trim().toLowerCase() },
      });
      return res.status(200).json({ success: true, user: updatedUser });
    }

    if (action === "REQUEST_ADMIN") {
      // Pastikan bukan Super Admin (tidak perlu request)
      if (session.user.role === "SUPER_ADMIN" || session.user.role === "ADMIN") {
         return res.status(400).json({ message: "Anda sudah memiliki akses admin." });
      }

      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: { adminRequestStatus: "PENDING" },
      });
      return res.status(200).json({ success: true, user: updatedUser });
    }

    return res.status(400).json({ message: "Aksi tidak dikenali." });

  } catch (error) {
    console.error("Error updating profile:", error);
    // Jika email sudah dipakai orang lain (Unique constraint failed)
    if (error.code === "P2002") {
      return res.status(400).json({ message: "Email ini sudah digunakan." });
    }
    return res.status(500).json({ message: "Terjadi kesalahan pada server." });
  }
}
