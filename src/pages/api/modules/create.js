import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, message: "Method tidak diizinkan. Gunakan POST." });
  }

  try {
    const { title, category, fileUrl } = req.body;

    const missingFields = [];
    if (!title?.trim()) missingFields.push("title");
    if (!category?.trim()) missingFields.push("category");
    if (!fileUrl?.trim()) missingFields.push("fileUrl");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal. Semua field wajib diisi.",
        errors: missingFields.map((f) => ({ field: f, message: `${f} tidak boleh kosong.` })),
      });
    }

    const document = await prisma.document.create({
      data: {
        title: title.trim(),
        category: category.trim(),
        fileUrl: fileUrl.trim(),
      },
    });

    return res.status(201).json({ success: true, message: "Modul berhasil disimpan.", data: document });
  } catch (error) {
    console.error("Error saat membuat modul:", error);
    return res.status(500).json({ success: false, message: "Terjadi kesalahan pada server." });
  }
}
