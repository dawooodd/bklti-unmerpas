import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export default async function handler(req, res) {
  
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ success: false, message: "Akses ditolak. Hanya SUPER_ADMIN." });
  }

  const { method } = req;

  try {
    
    if (method === "GET") {
      const modules = await prisma.module.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, email: true } } },
      });

      const serialized = modules.map((m) => ({
        ...m,
        createdAt: m.createdAt.toISOString(),
        updatedAt: m.updatedAt.toISOString(),
      }));

      return res.status(200).json({ success: true, data: serialized });
    }

    if (method === "POST") {
      const { title, description, category, fileUrl, isPublished } = req.body;

      if (!title || !category || !fileUrl) {
        return res.status(400).json({
          success: false,
          message: "Judul, kategori, dan URL file wajib diisi.",
        });
      }

      const module = await prisma.module.create({
        data: {
          title: title.trim(),
          description: description?.trim() || null,
          category: category.trim(),
          fileUrl: fileUrl.trim(),
          isPublished: isPublished ?? false,
          authorId: session.user.id,
        },
      });

      return res.status(201).json({ success: true, message: "Modul berhasil diunggah.", data: module });
    }

    if (method === "PUT") {
      const { id, title, description, category, fileUrl, isPublished } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID modul wajib disertakan." });
      }

      const module = await prisma.module.update({
        where: { id: Number(id) },
        data: {
          ...(title && { title: title.trim() }),
          ...(description !== undefined && { description: description?.trim() || null }),
          ...(category && { category: category.trim() }),
          ...(fileUrl && { fileUrl: fileUrl.trim() }),
          ...(isPublished !== undefined && { isPublished }),
        },
      });

      return res.status(200).json({ success: true, message: "Modul berhasil diperbarui.", data: module });
    }

    if (method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID modul wajib disertakan." });
      }

      await prisma.module.delete({ where: { id: Number(id) } });

      return res.status(200).json({ success: true, message: "Modul berhasil dihapus." });
    }

    return res.status(405).json({ success: false, message: `Method ${method} tidak diizinkan.` });
  } catch (error) {
    console.error("Error API /admin/modules:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Modul tidak ditemukan." });
    }

    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}
