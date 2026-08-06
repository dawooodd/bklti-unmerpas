import { useState, useRef } from "react";
import Head from "next/head";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/base";
import { Header, Footer } from "@/components/sections";
import { header, footer } from "@/data";
import { Icon } from "@iconify/react";

const categories = [
  { value: "", label: "— Pilih Kategori Layanan —" },
  { value: "konsultasi", label: "Konsultasi Skripsi / Tugas Akhir IT" },
  { value: "perbaikan", label: "Perbaikan Perangkat / Instalasi Software" },
  { value: "jaringan", label: "Gangguan Jaringan / Wi-Fi" },
  { value: "lainnya", label: "Lainnya" },
];

const steps = [
  {
    icon: "tabler:pencil",
    title: "Isi Formulir",
    description:
      "Lengkapi formulir pengajuan tiket dengan data diri dan deskripsi masalah yang kamu alami.",
  },
  {
    icon: "tabler:send",
    title: "Kirim Tiket",
    description:
      "Setelah terkirim, tiket akan masuk ke sistem dan mendapat nomor antrian unik.",
  },
  {
    icon: "tabler:headset",
    title: "Tim Merespon",
    description:
      "Tim teknis BKLTI akan meninjau tiketmu dan memberikan solusi dalam waktu 1×24 jam kerja.",
  },
  {
    icon: "tabler:circle-check",
    title: "Masalah Selesai",
    description:
      "Setelah masalah ditangani, tiket ditutup dan kamu bisa memberikan feedback.",
  },
];

const services = [
  {
    icon: "tabler:message-chatbot",
    label: "Konsultasi Skripsi IT",
    description: "Bimbingan topik, metodologi, dan implementasi proyek TI.",
  },
  {
    icon: "tabler:tool",
    label: "Perbaikan & Instalasi",
    description: "Instalasi OS, software, driver, dan troubleshooting hardware.",
  },
  {
    icon: "tabler:wifi",
    label: "Jaringan & Konektivitas",
    description: "Gangguan Wi-Fi kampus, konfigurasi jaringan, dan VPN.",
  },
  {
    icon: "tabler:shield-lock",
    label: "Keamanan & Recovery",
    description: "Pemulihan data, malware removal, dan konsultasi keamanan.",
  },
];

export default function HelpdeskPage() {
  const fileInputRef = useRef(null);
  const [formData, setFormData] = useState({
    nama: "",
    email: "",
    kategori: "",
    deskripsi: "",
  });
  const [fileName, setFileName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ticketNumber, setTicketNumber] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setIsSubmitting(true);

    if (!formData.kategori) {
      setErrorMsg("Harap pilih kategori layanan terlebih dahulu.");
      setIsSubmitting(false);
      return;
    }
    if (!formData.deskripsi.trim()) {
      setErrorMsg("Harap isi deskripsi masalah terlebih dahulu.");
      setIsSubmitting(false);
      return;
    }

    try {
      
      const res = await fetch("/api/helpdesk/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nama: formData.nama,
          emailOrNim: formData.email, 
          kategori: formData.kategori,
          deskripsi: formData.deskripsi,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Gagal membuat tiket.");
      }

      const generatedTicket = data.data.ticketNumber;
      setTicketNumber(generatedTicket);

      const kategoriLabel = categories.find((c) => c.value === formData.kategori)?.label || formData.kategori;
      const pesan = `Halo Admin BKLTI, saya ingin konsultasi/meminta bantuan layanan TI terkait: ${kategoriLabel}\n\n*Nomor Tiket:* ${generatedTicket}\n*Detail:* ${formData.deskripsi.trim()}`;
      const waUrl = `https://wa.me/6283833504040?text=${encodeURIComponent(pesan)}`;

      alert(`Tiket berhasil dibuat dengan nomor: ${generatedTicket}\n\nMenghubungkan ke WhatsApp Admin BKLTI...`);

      window.open(waUrl, "_blank", "noopener,noreferrer");
      setIsSubmitted(true);
    } catch (error) {
      setErrorMsg(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({ nama: "", email: "", kategori: "", deskripsi: "" });
    setFileName("");
    setIsSubmitted(false);
  };

  return (
    <>
      <Head>
        <title>Helpdesk & Ticketing — BKLTI Unmerpas</title>
        <meta
          name="description"
          content="Ajukan tiket bantuan TI untuk konsultasi, perbaikan perangkat, gangguan jaringan, dan layanan lainnya dari BKLTI Universitas Merdeka Pasuruan."
        />
      </Head>

      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />

      <section className="relative overflow-hidden pt-32 pb-16 px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-100/60 via-primary-50/30 to-transparent dark:from-primary-900/20 dark:via-primary-950/10 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto">
          <SectionHeading
            badge={{
              leading: true,
              icon: "tabler:headset",
              label: "HELPDESK BKLTI",
            }}
            title="Pusat Bantuan & Ticketing"
            description="Alami kendala TI di kampus? Ajukan tiket bantuan dan tim teknis BKLTI akan membantu menyelesaikan masalahmu dengan cepat dan profesional."
          />
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-12">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-10">

            <div className="lg:w-5/12 flex flex-col gap-8">

              <div>
                <h2 className="text-xl font-display font-semibold text-title mb-1">
                  Layanan yang Tersedia
                </h2>
                <p className="text-sm text-muted mb-5">
                  Kami siap membantu berbagai kebutuhan TI civitas akademika.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                  {services.map((service, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-4 p-4 rounded-xl bg-base-50 dark:bg-base-900 border border-base-200 dark:border-base-800 hover:border-primary-300 dark:hover:border-primary-700 transition-colors duration-200"
                    >
                      <div className="shrink-0 w-10 h-10 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                        <Icon
                          icon={service.icon}
                          className="w-5 h-5 text-primary-500"
                        />
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-title">
                          {service.label}
                        </h3>
                        <p className="text-xs text-muted mt-0.5">
                          {service.description}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-5 rounded-xl bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40">
                <div className="flex items-start gap-3">
                  <Icon
                    icon="tabler:alert-triangle"
                    className="w-5 h-5 text-amber-500 mt-0.5 shrink-0"
                  />
                  <div>
                    <h4 className="text-sm font-semibold text-amber-800 dark:text-amber-300">
                      Sebelum Mengajukan Tiket
                    </h4>
                    <ul className="mt-2 space-y-1.5 text-xs text-amber-700 dark:text-amber-400">
                      <li className="flex items-start gap-2">
                        <span className="mt-1 shrink-0 w-1 h-1 rounded-full bg-amber-500" />
                        Pastikan masalah belum terjawab di FAQ kami.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 shrink-0 w-1 h-1 rounded-full bg-amber-500" />
                        Jelaskan masalah dengan detail agar respon lebih cepat.
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="mt-1 shrink-0 w-1 h-1 rounded-full bg-amber-500" />
                        Lampirkan screenshot jika memungkinkan.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-7/12">
              <div className="bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-2xl p-8 shadow-lg">
                {!isSubmitted ? (
                  <>

                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-11 h-11 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                        <Icon
                          icon="tabler:ticket"
                          className="w-6 h-6 text-primary-500"
                        />
                      </div>
                      <div>
                        <h2 className="text-xl font-display font-semibold text-title">
                          Formulir Pengajuan Tiket
                        </h2>
                        <p className="text-xs text-muted">
                          Isi data berikut untuk membuat tiket bantuan baru
                        </p>
                      </div>
                    </div>

                    <form
                      onSubmit={handleSubmit}
                      className="flex flex-col gap-5"
                    >

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">

                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="hd-nama"
                            className="text-sm font-medium text-title"
                          >
                            Nama Lengkap{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="hd-nama"
                            name="nama"
                            required
                            placeholder="Masukkan nama lengkap"
                            value={formData.nama}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                          />
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label
                            htmlFor="hd-email"
                            className="text-sm font-medium text-title"
                          >
                            Email / NIM{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            id="hd-email"
                            name="email"
                            required
                            placeholder="Email atau NIM"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="hd-kategori"
                          className="text-sm font-medium text-title"
                        >
                          Kategori Layanan{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <div className="relative">
                          <select
                            id="hd-kategori"
                            name="kategori"
                            required
                            value={formData.kategori}
                            onChange={handleChange}
                            className="w-full appearance-none px-4 py-3 pr-10 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200"
                          >
                            {categories.map((cat) => (
                              <option key={cat.value} value={cat.value}>
                                {cat.label}
                              </option>
                            ))}
                          </select>
                          <Icon
                            icon="tabler:chevron-down"
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-base-400 pointer-events-none"
                          />
                        </div>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label
                          htmlFor="hd-deskripsi"
                          className="text-sm font-medium text-title"
                        >
                          Deskripsi Masalah{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          id="hd-deskripsi"
                          name="deskripsi"
                          required
                          rows={5}
                          placeholder="Jelaskan masalah yang kamu alami secara detail..."
                          value={formData.deskripsi}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title text-sm placeholder:text-base-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all duration-200 resize-none"
                        />
                        <p className="text-xs text-muted">
                          Semakin detail deskripsimu, semakin cepat kami bisa
                          membantu.
                        </p>
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-sm font-medium text-title">
                          Lampiran Screenshot{" "}
                          <span className="text-xs text-muted font-normal">
                            (opsional)
                          </span>
                        </label>
                        <div
                          onClick={() => fileInputRef.current?.click()}
                          className="group cursor-pointer flex flex-col items-center justify-center gap-3 p-6 rounded-xl border-2 border-dashed border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800/50 hover:border-primary-400 dark:hover:border-primary-600 hover:bg-primary-50/30 dark:hover:bg-primary-950/10 transition-all duration-200"
                        >
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                          />
                          <div className="w-12 h-12 rounded-full bg-base-100 dark:bg-base-900 flex items-center justify-center group-hover:scale-110 transition-transform">
                            <Icon icon="tabler:upload" className="w-6 h-6 text-primary-500" />
                          </div>
                          <div className="text-center">
                            <p className="text-sm font-medium text-title group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                              {fileName ? fileName : "Klik untuk mengunggah gambar"}
                            </p>
                            <p className="text-xs text-muted mt-1">PNG, JPG, max 5MB</p>
                          </div>
                        </div>
                      </div>
                      <div className="pt-2 flex flex-col gap-3">
                        {errorMsg && (
                          <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 rounded-xl border border-red-200 dark:border-red-800">
                            {errorMsg}
                          </div>
                        )}
                        <Button
                          type="submit"
                          label={isSubmitting ? "Memproses..." : "Kirim via WhatsApp"}
                          color="primary"
                          block={true}
                          icon={isSubmitting ? "tabler:loader" : "tabler:brand-whatsapp"}
                          leading={true}
                          disabled={isSubmitting}
                        />
                        <p className="text-xs text-muted text-center">
                          Kamu akan diarahkan ke WhatsApp untuk mengirim pesan ke Admin BKLTI.
                        </p>
                      </div>
                    </form>
                  </>
                ) : (
                  
                  <div className="flex flex-col items-center text-center gap-5 py-10">
                    <div className="relative">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center">
                        <Icon
                          icon="tabler:circle-check-filled"
                          className="w-12 h-12 text-emerald-500"
                        />
                      </div>
                      <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-primary-500 flex items-center justify-center">
                        <Icon
                          icon="tabler:ticket"
                          className="w-3.5 h-3.5 text-white"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-2xl font-display font-bold text-title">
                        Tiket Berhasil Dibuat!
                      </h3>
                      <p className="text-sm text-muted mt-2 max-w-sm">
                        Terima kasih, <strong>{formData.nama}</strong>. Tiketmu
                        telah masuk ke sistem. Tim BKLTI akan merespons dalam{" "}
                        <strong>1×24 jam kerja</strong>.
                      </p>
                    </div>

                    <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-base-50 dark:bg-base-800 border border-base-200 dark:border-base-700">
                      <Icon
                        icon="tabler:hash"
                        className="w-5 h-5 text-primary-500"
                      />
                      <span className="text-sm text-muted">Nomor Tiket:</span>
                      <span className="text-sm font-mono font-bold text-title">
                        {ticketNumber}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-4">
                      <Button
                        label="Buat Tiket Baru"
                        color="primary"
                        size="small"
                        icon="tabler:plus"
                        leading={true}
                        onClick={handleReset}
                      />
                      <Button
                        label="Kembali ke Beranda"
                        href="/"
                        color="light"
                        size="small"
                        icon="tabler:home"
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

      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-display font-semibold text-title text-center mb-10">
            Bagaimana Cara Kerjanya?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {steps.map((step, idx) => (
              <div key={idx} className="relative flex flex-col items-center text-center gap-4 p-6">

                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-10 left-[calc(50%+28px)] w-[calc(100%-56px)] h-px bg-gradient-to-r from-primary-300 to-primary-100 dark:from-primary-700 dark:to-primary-900" />
                )}

                <div className="relative">
                  <div className="w-14 h-14 rounded-2xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
                    <Icon
                      icon={step.icon}
                      className="w-7 h-7 text-primary-500"
                    />
                  </div>
                  <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary-500 text-white text-xs font-bold flex items-center justify-center">
                    {idx + 1}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-title">
                  {step.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
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
