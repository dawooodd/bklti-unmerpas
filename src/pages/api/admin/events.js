import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim() + "-" + Date.now().toString(36);
}

export default async function handler(req, res) {
  
  const session = await getServerSession(req, res, authOptions);
  if (!session || session.user.role !== "SUPER_ADMIN") {
    return res.status(403).json({ success: false, message: "Akses ditolak. Hanya SUPER_ADMIN." });
  }

  const { method } = req;

  try {
    
    if (method === "GET") {
      const events = await prisma.event.findMany({
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true, email: true } } },
      });

      const serialized = events.map((e) => ({
        ...e,
        date: e.date.toISOString(),
        createdAt: e.createdAt.toISOString(),
        updatedAt: e.updatedAt.toISOString(),
      }));

      return res.status(200).json({ success: true, data: serialized });
    }

    if (method === "POST") {
      const { title, description, date, location, imageUrl, category, isPublished } = req.body;

      if (!title || !description || !date) {
        return res.status(400).json({
          success: false,
          message: "Judul, deskripsi, dan tanggal wajib diisi.",
        });
      }

      const event = await prisma.event.create({
        data: {
          title: title.trim(),
          slug: generateSlug(title),
          description: description.trim(),
          date: new Date(date),
          location: location?.trim() || null,
          imageUrl: imageUrl?.trim() || null,
          category: category || "KEGIATAN",
          isPublished: isPublished ?? false,
          authorId: session.user.id,
        },
      });

      return res.status(201).json({ success: true, message: "Event berhasil dibuat.", data: event });
    }

    if (method === "PUT") {
      const { id, title, description, date, location, imageUrl, category, isPublished } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID event wajib disertakan." });
      }

      const event = await prisma.event.update({
        where: { id: Number(id) },
        data: {
          ...(title && { title: title.trim() }),
          ...(description && { description: description.trim() }),
          ...(date && { date: new Date(date) }),
          ...(location !== undefined && { location: location?.trim() || null }),
          ...(imageUrl !== undefined && { imageUrl: imageUrl?.trim() || null }),
          ...(category && { category }),
          ...(isPublished !== undefined && { isPublished }),
        },
      });

      return res.status(200).json({ success: true, message: "Event berhasil diperbarui.", data: event });
    }

    if (method === "DELETE") {
      const { id } = req.body;

      if (!id) {
        return res.status(400).json({ success: false, message: "ID event wajib disertakan." });
      }

      await prisma.event.delete({ where: { id: Number(id) } });

      return res.status(200).json({ success: true, message: "Event berhasil dihapus." });
    }

    return res.status(405).json({ success: false, message: `Method ${method} tidak diizinkan.` });
  } catch (error) {
    console.error("Error API /admin/events:", error);

    if (error.code === "P2025") {
      return res.status(404).json({ success: false, message: "Event tidak ditemukan." });
    }

    return res.status(500).json({ success: false, message: "Terjadi kesalahan server." });
  }
}
