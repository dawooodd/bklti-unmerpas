import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/base";
import { Header, Footer } from "@/components/sections";
import { header, footer } from "@/data";
import { Icon } from "@iconify/react";

// Data dummy acara (sama dengan index.js — dalam proyek nyata ini akan di-fetch dari API/database)
const events = [
  {
    slug: "pelatihan-web-part-6",
    title: "Pelatihan Web Development Part 6",
    date: "15 Agustus 2026",
    time: "09:00 - 15:00 WIB",
    location: "Lab Komputer BKLTI",
    image: "/BKLTI.png",
    category: "Pelatihan",
    description:
      "Pelajari dasar-dasar pengembangan web modern menggunakan HTML, CSS, JavaScript, dan framework populer seperti React & Next.js. Cocok untuk pemula maupun yang ingin memperdalam skill.",
    fullDescription:
      "Dalam pelatihan ini, peserta akan dibimbing langkah demi langkah untuk memahami fondasi pengembangan web modern. Materi dimulai dari dasar HTML5 & CSS3, dilanjutkan dengan JavaScript ES6+, hingga pengenalan React dan Next.js sebagai framework terdepan. Sesi hands-on interaktif dan proyek mini akan memastikan peserta langsung bisa mempraktikkan ilmu yang didapat. Sertifikat diberikan bagi peserta yang menyelesaikan pelatihan.",
    speaker: "Tim Instruktur BKLTI",
    quota: 40,
    requirements: [
      "Membawa laptop pribadi dengan spesifikasi minimal RAM 4GB",
      "Sudah menginstall VS Code & Node.js",
      "Memiliki koneksi internet yang stabil",
      "Pengetahuan dasar komputer",
    ],
    benefits: [
      "Sertifikat Pelatihan BKLTI",
      "Modul & Source Code Lengkap",
      "Akses Grup Belajar Eksklusif",
      "Konsultasi Pasca-Pelatihan",
    ],
  },
  {
    slug: "workshop-fotografi",
    title: "Workshop Fotografi & Videografi",
    date: "22 Agustus 2026",
    time: "10:00 - 16:00 WIB",
    location: "Studio Kreatif BKLTI",
    image: "/BKLTI.png",
    category: "Workshop",
    description:
      "Workshop intensif fotografi dan videografi untuk konten digital. Materi mencakup teknik komposisi, lighting, editing foto & video, serta strategi konten media sosial.",
    fullDescription:
      "Workshop sehari penuh yang dirancang untuk membekali peserta dengan keterampilan fotografi dan videografi profesional. Mulai dari teknik pengambilan gambar, pencahayaan, komposisi visual, hingga post-processing menggunakan Adobe Lightroom dan Premiere Pro. Peserta juga akan belajar strategi konten untuk platform media sosial seperti Instagram, TikTok, dan YouTube.",
    speaker: "Komunitas Kreatif Unmerpas",
    quota: 30,
    requirements: [
      "Membawa kamera DSLR/Mirrorless atau smartphone dengan kamera bagus",
      "Laptop untuk sesi editing (opsional)",
      "Minat di bidang fotografi/videografi",
    ],
    benefits: [
      "Sertifikat Workshop",
      "Preset Lightroom Gratis",
      "Portfolio Review oleh Profesional",
      "Networking dengan Komunitas Kreatif",
    ],
  },
  {
    slug: "turnamen-mlbb",
    title: "Turnamen Mobile Legends: Bang Bang",
    date: "5 September 2026",
    time: "08:00 - Selesai",
    location: "Aula Universitas Merdeka Pasuruan",
    image: "/BKLTI.png",
    category: "Turnamen",
    description:
      "Kompetisi e-sports Mobile Legends antar mahasiswa se-Jawa Tengah. Hadiah total jutaan rupiah! Daftarkan tim kamu sekarang dan buktikan skill-mu di arena pertandingan.",
    fullDescription:
      "Turnamen Mobile Legends: Bang Bang tingkat mahasiswa terbesar di Jawa Tengah! Pertandingan menggunakan format single elimination bracket dengan sistem BO3 untuk babak penyisihan dan BO5 untuk semifinal & final. Hadiah total senilai jutaan rupiah menanti tim terbaik. Setiap tim terdiri dari 5 pemain inti + 1 cadangan. Ayo tunjukkan bahwa kampusmu adalah yang terkuat!",
    speaker: "Divisi E-Sports BKLTI",
    quota: 64,
    requirements: [
      "Tim terdiri dari 5 pemain inti + 1 cadangan",
      "Semua anggota tim merupakan mahasiswa aktif",
      "Akun Mobile Legends minimal Rank Epic",
      "Koneksi internet stabil & perangkat memadai",
    ],
    benefits: [
      "Hadiah Uang Tunai Jutaan Rupiah",
      "Trophy & Medali",
      "Sertifikat Peserta",
      "Merchandise Eksklusif",
    ],
  },
];

export async function getStaticPaths() {
  const paths = events.map((event) => ({
    params: { slug: event.slug },
  }));
  return { paths, fallback: false };
}

export async function getStaticProps({ params }) {
  const event = events.find((e) => e.slug === params.slug);
  if (!event) {
    return { notFound: true };
  }
  return { props: { event } };
}

export default function EventDetailPage({ event }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    nama: "",
    nim: "",
    prodi: "",
    whatsapp: "",
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg("");

    try {
      const res = await fetch("/api/events/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          eventSlug: event.slug,
          nama: formData.nama,
          nim: formData.nim,
          instansi: formData.prodi,
          noWa: formData.whatsapp,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setIsSubmitted(true);
      } else {
        setErrorMsg(data.message || "Gagal mengirim pendaftaran.");
      }
    } catch (error) {
      setErrorMsg("Terjadi kesalahan jaringan.");
    } finally {
      setIsLoading(false);
    }
  };

  // Warna badge kategori
  const categoryColors = {
    Pelatihan:
      "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
    Workshop:
      "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
    Turnamen:
      "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
  };

  if (router.isFallback) {
    return <div className="min-h-screen flex items-center justify-center text-title">Memuat...</div>;
  }

  return (
    <>
      <Head>
        <title>{event.title} — BKLTI Unmerpas</title>
        <meta name="description" content={event.description} />
      </Head>

      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />

      {/* Hero Banner */}
      <section className="relative pt-28 pb-12 px-6 lg:px-8 overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-gradient-to-b from-primary-100/60 via-primary-50/30 to-transparent dark:from-primary-900/20 dark:via-primary-950/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-muted mb-8">
            <Link
              href="/"
              className="hover:text-primary-500 transition-colors"
            >
              Beranda
            </Link>
            <span>/</span>
            <Link
              href="/events"
              className="hover:text-primary-500 transition-colors"
            >
              Acara
            </Link>
            <span>/</span>
            <span className="text-title font-medium truncate max-w-[200px]">
              {event.title}
            </span>
          </nav>

          <div className="flex flex-col lg:flex-row gap-10">
            {/* Left: Event Image */}
            <div className="lg:w-1/2">
              <div className="relative rounded-2xl overflow-hidden aspect-video shadow-lg border border-base-200 dark:border-base-800">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover"
                />
                <span
                  className={`absolute top-4 left-4 text-xs font-semibold px-3 py-1.5 rounded-full ${categoryColors[event.category] || "bg-base-100 text-base-600"}`}
                >
                  {event.category}
                </span>
              </div>
            </div>

            {/* Right: Event Info */}
            <div className="lg:w-1/2 flex flex-col gap-5">
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-title leading-tight">
                {event.title}
              </h1>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <InfoItem
                  icon="tabler:calendar"
                  label="Tanggal"
                  value={event.date}
                />
                <InfoItem
                  icon="tabler:clock"
                  label="Waktu"
                  value={event.time}
                />
                <InfoItem
                  icon="tabler:map-pin"
                  label="Lokasi"
                  value={event.location}
                />
                <InfoItem
                  icon="tabler:user"
                  label="Narasumber"
                  value={event.speaker}
                />
                <InfoItem
                  icon="tabler:users"
                  label="Kuota"
                  value={`${event.quota} peserta`}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content + Form Section */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Left: Description & Details */}
            <div className="lg:w-1/2 flex flex-col gap-8">
              {/* Description */}
              <div>
                <h2 className="text-xl font-display font-semibold text-title mb-3">
                  Deskripsi Acara
                </h2>
                <p className="text-base-600 dark:text-base-400 leading-relaxed">
                  {event.fullDescription}
                </p>
              </div>

              {/* Requirements */}
              {event.requirements && (
                <div>
                  <h2 className="text-xl font-display font-semibold text-title mb-3">
                    Persyaratan
                  </h2>
                  <ul className="space-y-2">
                    {event.requirements.map((req, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Icon
                          icon="tabler:circle-check-filled"
                          className="w-5 h-5 text-primary-500 mt-0.5 shrink-0"
                        />
                        <span className="text-base-600 dark:text-base-400">
                          {req}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Benefits */}
              {event.benefits && (
                <div>
                  <h2 className="text-xl font-display font-semibold text-title mb-3">
                    Benefit Peserta
                  </h2>
                  <ul className="space-y-2">
                    {event.benefits.map((benefit, idx) => (
                      <li key={idx} className="flex items-start gap-3 text-sm">
                        <Icon
                          icon="tabler:star-filled"
                          className="w-5 h-5 text-amber-500 mt-0.5 shrink-0"
                        />
                        <span className="text-base-600 dark:text-base-400">
                          {benefit}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Right: Registration Form */}
            <div className="lg:w-1/2">
              <div className="sticky top-28 bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-8 shadow-lg">
                {!isSubmitted ? (
                  <>
                    <div className="flex items-center gap-3 mb-6">
                      <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                        <Icon
                          icon="tabler:pencil"
                          className="w-5 h-5 text-primary-500"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-semibold text-title">
                          Formulir Pendaftaran
                        </h2>
                        <p className="text-xs text-muted">
                          Isi data di bawah untuk mendaftar
                        </p>
                      </div>
                    </div>

                    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                      {/* Nama Lengkap */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="nama"
                          className="text-sm font-medium text-title"
                        >
                          Nama Lengkap <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="nama"
                          name="nama"
                          required
                          placeholder="Masukkan nama lengkap"
                          value={formData.nama}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                        />
                      </div>

                      {/* NIM */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="nim"
                          className="text-sm font-medium text-title"
                        >
                          NIM <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="nim"
                          name="nim"
                          required
                          placeholder="Contoh: 2023010001"
                          value={formData.nim}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                        />
                      </div>

                      {/* Asal Instansi / Prodi */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="prodi"
                          className="text-sm font-medium text-title"
                        >
                          Asal Instansi / Prodi{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="text"
                          id="prodi"
                          name="prodi"
                          required
                          placeholder="Contoh: Teknik Informatika"
                          value={formData.prodi}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                        />
                      </div>

                      {/* Nomor WhatsApp */}
                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="whatsapp"
                          className="text-sm font-medium text-title"
                        >
                          Nomor WhatsApp <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="tel"
                          id="whatsapp"
                          name="whatsapp"
                          required
                          placeholder="Contoh: 08123456789"
                          value={formData.whatsapp}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                        />
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2 flex flex-col gap-3">
                        {errorMsg && (
                          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800">
                            {errorMsg}
                          </div>
                        )}
                        <Button
                          label={isLoading ? "Mengirim..." : "Kirim Pendaftaran"}
                          color="primary"
                          block={true}
                          icon={isLoading ? "tabler:loader" : "tabler:send"}
                          onClick={() => {}}
                          disabled={isLoading}
                        />
                      </div>

                      <p className="text-xs text-muted text-center">
                        Dengan mendaftar, kamu menyetujui{" "}
                        <a href="#" className="text-primary-500 hover:underline">
                          syarat & ketentuan
                        </a>{" "}
                        yang berlaku.
                      </p>
                    </form>
                  </>
                ) : (
                  /* Success State */
                  <div className="flex flex-col items-center text-center gap-4 py-8">
                    <div className="w-16 h-16 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                      <Icon
                        icon="tabler:circle-check-filled"
                        className="w-10 h-10 text-emerald-500"
                      />
                    </div>
                    <h3 className="text-xl font-display font-semibold text-title">
                      Pendaftaran Berhasil!
                    </h3>
                    <p className="text-sm text-muted max-w-xs">
                      Terima kasih, <strong>{formData.nama}</strong>. Data
                      pendaftaranmu untuk{" "}
                      <strong>{event.title}</strong> telah kami
                      terima. Informasi lebih lanjut akan dikirim via WhatsApp.
                    </p>
                    <div className="flex gap-3 mt-4">
                      <Button
                        label="Kembali ke Daftar Acara"
                        href="/events"
                        color="primary"
                        size="small"
                        icon="tabler:arrow-left"
                        leading={true}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer
        id="footer"
        copyright={footer.copyright}
        logo={footer.logo}
        social={footer.social}
        links={footer.links}
      />
    </>
  );
}

// Komponen kecil untuk menampilkan info event
function InfoItem({ icon, label, value }) {
  return (
    <div className="flex items-start gap-3 p-3 rounded-xl bg-base-50 dark:bg-base-800/50 border border-base-100 dark:border-base-800">
      <Icon
        icon={icon}
        className="w-5 h-5 text-primary-500 mt-0.5 shrink-0"
      />
      <div>
        <p className="text-xs text-muted">{label}</p>
        <p className="text-sm font-medium text-title">{value}</p>
      </div>
    </div>
  );
}
