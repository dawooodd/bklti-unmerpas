import Head from "next/head";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/base";
import { Header, Footer, FaqSection } from "@/components/sections";
import { header, footer } from "@/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const rplFaqs = [
  {
    title: "Apakah lulusan RPL mendapat ijazah yang sama?",
    body: "Ya, lulusan program RPL mendapatkan ijazah dan gelar yang sama dengan mahasiswa reguler. Tidak ada perbedaan dalam legalitas dan pengakuan ijazah.",
  },
  {
    title: "Berapa lama masa studi program RPL?",
    body: "Masa studi program RPL bervariasi tergantung jumlah SKS yang diakui dari pengalaman kerja sebelumnya. Umumnya berkisar antara 2-3 semester untuk menyelesaikan sisa SKS.",
  },
  {
    title: "Apakah perkuliahan RPL bisa dilakukan secara online?",
    body: "Program RPL menggunakan metode blended learning, kombinasi pertemuan tatap muka di akhir pekan dan pembelajaran daring melalui platform e-learning kampus.",
  },
  {
    title: "Apa saja dokumen yang dibutuhkan untuk asesmen RPL?",
    body: "Dokumen yang dibutuhkan meliputi: ijazah terakhir, transkrip nilai, sertifikat kompetensi/pelatihan, surat keterangan kerja, portofolio proyek, dan CV lengkap.",
  },
  {
    title: "Bagaimana proses asesmen RPL dilakukan?",
    body: "Asesmen dilakukan oleh tim asesor yang mengevaluasi dokumen portofolio, melakukan wawancara, dan jika diperlukan mengadakan uji kompetensi praktik untuk menentukan SKS yang dapat diakui.",
  },
];

const requirements = [
  "Warga Negara Indonesia (WNI) dengan usia minimal 25 tahun.",
  "Memiliki ijazah SMA/SMK/sederajat atau Diploma.",
  "Memiliki pengalaman kerja minimal 3 tahun di bidang terkait.",
  "Memiliki sertifikat kompetensi atau pelatihan yang relevan.",
  "Mampu mengoperasikan komputer dan mengakses internet.",
  "Mengisi formulir pendaftaran dan melengkapi dokumen yang dipersyaratkan.",
  "Bersedia mengikuti proses asesmen yang dijadwalkan oleh kampus.",
  "Membayar biaya pendaftaran dan asesmen sesuai ketentuan.",
];

const benefits = [
  {
    icon: "tabler:clock-bolt",
    title: "Masa Studi Lebih Singkat",
    description:
      "Pengalaman kerja dan sertifikat diakui sebagai SKS, mempersingkat waktu kuliah secara signifikan.",
  },
  {
    icon: "tabler:calendar-week",
    title: "Jadwal Fleksibel",
    description:
      "Perkuliahan di akhir pekan dan blended learning, cocok untuk profesional yang masih bekerja.",
  },
  {
    icon: "tabler:certificate",
    title: "Ijazah Resmi & Diakui",
    description:
      "Gelar sarjana yang setara dengan program reguler, diakui oleh Kemendikbudristek.",
  },
  {
    icon: "tabler:wallet",
    title: "Biaya Terjangkau",
    description:
      "Biaya kuliah lebih efisien karena hanya membayar sisa SKS yang perlu ditempuh.",
  },
];

const registrationSteps = [
  {
    step: 1,
    title: "Pendaftaran Online",
    description:
      "Isi formulir pendaftaran online dan unggah dokumen persyaratan melalui portal kampus.",
    icon: "tabler:clipboard-text",
  },
  {
    step: 2,
    title: "Verifikasi Berkas",
    description:
      "Tim admisi memverifikasi kelengkapan dan keabsahan dokumen yang telah diunggah.",
    icon: "tabler:file-search",
  },
  {
    step: 3,
    title: "Asesmen RPL",
    description:
      "Mengikuti proses asesmen berupa evaluasi portofolio, wawancara, dan/atau uji kompetensi.",
    icon: "tabler:checklist",
  },
  {
    step: 4,
    title: "Pengumuman & Registrasi",
    description:
      "Hasil asesmen diumumkan beserta jumlah SKS yang diakui. Lakukan registrasi ulang dan mulai perkuliahan.",
    icon: "tabler:confetti",
  },
];

const waText = "Halo Admin, saya tertarik untuk mendaftar Program Perkuliahan Jalur RPL. Mohon informasi selengkapnya.";
const waUrl = `https://wa.me/6281235226522?text=${encodeURIComponent(waText)}`;

export default function ProgramRPLPage() {
  return (
    <>
      <Head>
        <title>Program Perkuliahan Jalur RPL — BKLTI Unmerpas</title>
        <meta
          name="description"
          content="Program Rekognisi Pembelajaran Lampau (RPL) Universitas Merdeka Pasuruan. Raih gelar sarjana dengan pengakuan pengalaman kerja dan sertifikasi profesional Anda."
        />
      </Head>

      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />

      <section className="relative overflow-hidden pt-32 pb-20 px-6 lg:px-8">

        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 z-[-1] opacity-5 bg-[url('/logo-unmer-watermark.png')] bg-no-repeat bg-center bg-contain md:bg-auto"></div>
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-gradient-to-b from-primary-100/70 via-primary-50/30 to-transparent dark:from-primary-900/25 dark:via-primary-950/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-gradient-to-tl from-amber-100/40 to-transparent dark:from-amber-900/10 rounded-full blur-3xl -z-10" />
        </div>

        <div className="max-w-5xl mx-auto text-center">

          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-500 dark:text-primary-300 text-sm font-medium mb-6">
            <Icon icon="tabler:award" className="w-5 h-5" />
            PROGRAM RPL — UNIVERSITAS MERDEKA PASURUAN
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-bold text-title leading-tight mb-6">
            Program Khusus{" "}
            <span className="title-gradient">Jalur RPL</span>
          </h1>

          <p className="text-lg text-base-600 dark:text-base-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Raih gelar sarjana dengan pengakuan pengalaman kerja dan sertifikasi
            profesional Anda. Program RPL dirancang khusus bagi praktisi yang
            ingin meningkatkan kualifikasi akademik tanpa harus meninggalkan
            karier.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4">
            <Button
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              label="Daftar Sekarang via WA"
              color="primary"
              icon="tabler:brand-whatsapp"
              leading={true}
            />
            <Button
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              label="Download Panduan"
              color="light"
              icon="tabler:download"
              leading={true}
            />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-16 max-w-3xl mx-auto">
            {[
              { value: "100+", label: "Lulusan Alumni" },
              { value: "2-3", label: "Semester" },
              { value: "95%", label: "Tingkat Kelulusan" },
              { value: "B", label: "Akreditasi" },
            ].map((stat, idx) => (
              <div
                key={idx}
                className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-white/60 dark:bg-base-900/60 backdrop-blur-sm border border-base-200/60 dark:border-base-800/60"
              >
                <span className="text-2xl font-display font-bold text-primary-500">
                  {stat.value}
                </span>
                <span className="text-xs text-muted">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-12 lg:py-16 bg-base-50 dark:bg-base-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12 items-start">

            <div className="lg:w-5/12 lg:sticky lg:top-28">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-500 text-xs font-semibold mb-4">
                <Icon icon="tabler:info-circle" className="w-4 h-4" />
                TENTANG PROGRAM
              </div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-title leading-tight">
                Apa itu RPL?
              </h2>
            </div>

            <div className="lg:w-7/12">
              <div className="space-y-5 text-base-600 dark:text-base-400 leading-relaxed">
                <p>
                  <strong className="text-title">
                    Rekognisi Pembelajaran Lampau (RPL)
                  </strong>{" "}
                  adalah pengakuan atas capaian pembelajaran seseorang yang
                  diperoleh dari pendidikan formal, nonformal, informal,
                  dan/atau pengalaman kerja ke dalam pendidikan formal. Program
                  ini diatur dalam{" "}
                  <strong className="text-title">
                    Permendikbudristek No. 41 Tahun 2021
                  </strong>
                  .
                </p>
                <p>
                  Melalui program RPL di Universitas Merdeka Pasuruan,
                  pengalaman kerja, sertifikat kompetensi, dan pelatihan
                  profesional Anda dapat dikonversi menjadi Satuan Kredit
                  Semester (SKS). Ini berarti Anda tidak perlu mengulang
                  mata kuliah yang materinya sudah Anda kuasai dari
                  pengalaman di dunia kerja.
                </p>
                <p>
                  Program ini sangat cocok bagi para profesional di bidang
                  teknologi informasi, jaringan komputer, sistem informasi,
                  dan bidang terkait lainnya yang ingin mendapatkan pengakuan
                  akademik atas kompetensi yang telah dimiliki.
                </p>

                <div className="p-5 rounded-xl bg-primary-50 dark:bg-primary-950/30 border border-primary-200 dark:border-primary-800/40 mt-6">
                  <div className="flex items-start gap-3">
                    <Icon
                      icon="tabler:bulb"
                      className="w-6 h-6 text-primary-500 mt-0.5 shrink-0"
                    />
                    <div>
                      <h4 className="text-sm font-semibold text-title mb-1">
                        Tahukah Anda?
                      </h4>
                      <p className="text-sm text-base-600 dark:text-base-400">
                        Dengan RPL, pengalaman kerja 3+ tahun di bidang IT bisa
                        dikonversi menjadi hingga <strong className="text-title">60 SKS</strong>,
                        sehingga masa studi Anda bisa ditempuh hanya dalam{" "}
                        <strong className="text-title">2-3 semester</strong>.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-500 text-xs font-semibold mb-4">
              <Icon icon="tabler:sparkles" className="w-4 h-4" />
              KEUNTUNGAN
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-title">
              Mengapa Memilih Jalur RPL?
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {benefits.map((item, idx) => (
              <div
                key={idx}
                className="group flex items-start gap-5 p-6 rounded-2xl bg-white dark:bg-base-900 border border-base-200 dark:border-base-800 hover:border-primary-300 dark:hover:border-primary-700 hover:shadow-lg transition-all duration-300"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center group-hover:bg-primary-500 transition-colors duration-300">
                  <Icon
                    icon={item.icon}
                    className="w-6 h-6 text-primary-500 group-hover:text-white transition-colors duration-300"
                  />
                </div>
                <div>
                  <h3 className="text-base font-semibold text-title mb-1">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8 py-12 lg:py-16 bg-base-50 dark:bg-base-900">
        <div className="max-w-4xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-12">

            <div className="lg:w-5/12">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 text-xs font-semibold mb-4">
                <Icon icon="tabler:list-check" className="w-4 h-4" />
                PERSYARATAN
              </div>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-title leading-tight mb-3">
                Syarat & Ketentuan
              </h2>
              <p className="text-sm text-muted leading-relaxed">
                Pastikan Anda memenuhi seluruh persyaratan berikut sebelum
                mendaftar program RPL.
              </p>
            </div>

            <div className="lg:w-7/12">
              <div className="bg-white dark:bg-base-950 rounded-2xl border border-base-200 dark:border-base-800 p-6 sm:p-8">
                <ul className="space-y-4">
                  {requirements.map((req, idx) => (
                    <li key={idx} className="flex items-start gap-4">
                      <div className="shrink-0 w-7 h-7 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 flex items-center justify-center mt-0.5">
                        <Icon
                          icon="tabler:check"
                          className="w-4 h-4 text-emerald-600 dark:text-emerald-400"
                        />
                      </div>
                      <span className="text-sm text-base-600 dark:text-base-400 leading-relaxed">
                        {req}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="pendaftaran" className="px-6 lg:px-8 py-12 lg:py-16">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary-100 dark:bg-primary-950 text-primary-500 text-xs font-semibold mb-4">
              <Icon icon="tabler:route" className="w-4 h-4" />
              ALUR PENDAFTARAN
            </div>
            <h2 className="text-3xl lg:text-4xl font-display font-bold text-title mb-3">
              Langkah Pendaftaran RPL
            </h2>
            <p className="text-sm text-muted max-w-lg mx-auto">
              Proses pendaftaran yang mudah dan transparan, dari awal hingga
              Anda resmi menjadi mahasiswa.
            </p>
          </div>

          <div className="relative">

            <div className="hidden lg:block absolute top-[52px] left-[calc(12.5%+24px)] right-[calc(12.5%+24px)] h-0.5 bg-gradient-to-r from-primary-300 via-primary-400 to-primary-300 dark:from-primary-700 dark:via-primary-600 dark:to-primary-700" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
              {registrationSteps.map((item, idx) => (
                <div key={idx} className="relative flex flex-col items-center text-center">

                  {idx < registrationSteps.length - 1 && (
                    <div className="lg:hidden absolute top-[104px] left-1/2 -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-primary-300 to-primary-100 dark:from-primary-700 dark:to-primary-900" />
                  )}

                  <div className="relative mb-5">
                    <div className="w-[104px] h-[104px] rounded-3xl bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-950/60 dark:to-primary-900/40 border-2 border-primary-200 dark:border-primary-800 flex items-center justify-center shadow-sm">
                      <Icon
                        icon={item.icon}
                        className="w-10 h-10 text-primary-500"
                      />
                    </div>

                    <span className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-primary-500 text-white text-sm font-bold flex items-center justify-center shadow-lg shadow-primary-500/30">
                      {item.step}
                    </span>
                  </div>

                  <h3 className="text-base font-display font-semibold text-title mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-muted leading-relaxed max-w-[240px]">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center mt-14">
            <Button
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              label="Mulai Pendaftaran"
              color="primary"
              icon="tabler:brand-whatsapp"
            />
          </div>
        </div>
      </section>

      <FaqSection
        id="faq-rpl"
        title="Pertanyaan Seputar RPL"
        description="Temukan jawaban atas pertanyaan yang sering diajukan mengenai program RPL di Universitas Merdeka Pasuruan."
        buttons={[
          {
            label: "Hubungi Kami",
            href: waUrl,
            target: "_blank",
            rel: "noopener noreferrer",
            color: "primary",
            variant: "link",
            icon: "tabler:brand-whatsapp",
          },
        ]}
        faqs={rplFaqs}
      />

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
