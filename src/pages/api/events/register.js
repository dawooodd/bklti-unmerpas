import { prisma } from "@/lib/prisma";

export default async function handler(req, res) {
  // Hanya terima method POST
  if (req.method !== "POST") {
    return res.status(405).json({
      success: false,
      message: `Method ${req.method} tidak diizinkan. Gunakan POST.`,
    });
  }

  try {
    const { eventSlug, nama, nim, instansi, noWa } = req.body;

    // Validasi: pastikan semua field terisi
    const missingFields = [];
    if (!eventSlug?.trim()) missingFields.push("eventSlug");
    if (!nama?.trim()) missingFields.push("nama");
    if (!nim?.trim()) missingFields.push("nim");
    if (!instansi?.trim()) missingFields.push("instansi");
    if (!noWa?.trim()) missingFields.push("noWa");

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

    // Simpan ke database via Prisma
    const registration = await prisma.eventRegistration.create({
      data: {
        eventSlug: eventSlug.trim(),
        nama: nama.trim(),
        nim: nim.trim(),
        instansi: instansi.trim(),
        noWa: noWa.trim(),
      },
    });

    return res.status(201).json({
      success: true,
      message: "Pendaftaran berhasil disimpan.",
      data: registration,
    });
  } catch (error) {
    console.error("Error saat menyimpan pendaftaran:", error);
    return res.status(500).json({
      success: false,
      message: "Terjadi kesalahan pada server. Silakan coba lagi nanti.",
    });
  }
}
