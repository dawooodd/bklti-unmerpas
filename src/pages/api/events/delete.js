import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "DELETE") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan. Gunakan DELETE." });
  }

  const id = parseInt(req.query.id);
  if (!id || isNaN(id)) {
    return res.status(400).json({ success: false, message: "Parameter id tidak valid." });
  }

  try {
    await prisma.eventRegistration.delete({ where: { id } });
    return res.status(200).json({ success: true, message: "Data pendaftar berhasil dihapus." });
  } catch (error) {
    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Data tidak ditemukan." });
    }
    console.error("Error saat menghapus pendaftar:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
}
