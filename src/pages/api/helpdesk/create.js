import { prisma } from "@/lib/prisma";

/**
 * Generate nomor tiket unik dengan format: TIK-YYYYMMDD-XXXX
 * Contoh: TIK-20260731-a3f9
 */
function generateTicketNumber() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  const random = Math.random().toString(36).substring(2, 6); // 4 karakter alfanumerik

  return `TIK-${year}${month}${day}-${random}`;
}

export default async function handler(req, res) {
  // Hanya terima method POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan. Gunakan POST.`,
    });
  }

  try {
    const { nama, emailOrNim, kategori, deskripsi } = req.body;

    // Validasi: pastikan semua field terisi
    const missingFields = [];
    if (!nama?.trim()) missingFields.push("nama");
    if (!emailOrNim?.trim()) missingFields.push("emailOrNim");
    if (!kategori?.trim()) missingFields.push("kategori");
    if (!deskripsi?.trim()) missingFields.push("deskripsi");

    if (missingFields.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Validasi gagal. Semua field wajib diisi.",
        errors: missingFields.map((field) => ({
          field,
          message: `${field} tidak boleh kosong.`,
        })),
      });
    }

    // Validasi kategori
    const validCategories = ["konsultasi", "perbaikan", "jaringan", "lainnya"];
    if (!validCategories.includes(kategori.trim().toLowerCase())) {
      return res.status(400).json({
        success: false,
        message: `Kategori tidak valid. Pilihan: ${validCategories.join(", ")}.`,
      });
    }

    // Generate nomor tiket unik (retry jika collision)
    let ticketNumber;
    let isUnique = false;
    let attempts = 0;

    while (!isUnique && attempts < 5) {
      ticketNumber = generateTicketNumber();
      const existing = await prisma.helpdeskTicket.findUnique({
        where: { ticketNumber },
      });
      if (!existing) isUnique = true;
      attempts++;
    }

    if (!isUnique) {
      return res.status(500).json({
        success: false,
        message: "Gagal membuat nomor tiket unik. Silakan coba lagi.",
      });
    }

    // Simpan ke database via Prisma
    const ticket = await prisma.helpdeskTicket.create({
      data: {
        ticketNumber,
        nama: nama.trim(),
        emailOrNim: emailOrNim.trim(),
        kategori: kategori.trim().toLowerCase(),
        deskripsi: deskripsi.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Tiket berhasil dibuat.",
      data: {
        id: ticket.id,
        ticketNumber: ticket.ticketNumber,
        status: ticket.status,
        createdAt: ticket.createdAt,
      },
    });
  } catch (error) {
    console.error("Error saat membuat tiket:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    });
  }
}
