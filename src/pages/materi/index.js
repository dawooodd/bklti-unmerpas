import Head from "next/head";
import { SectionHeading } from "@/components/SectionHeading";
import { Badge, Button } from "@/components/base";
import { Header, Footer } from "@/components/sections";
import { header, footer } from "@/data";
import { Icon } from "@iconify/react";

// Data dummy materi/dokumen BKLTI
const materials = [
  {
    id: 1,
    title: "Modul Pelatihan Web Part 1 — HTML & CSS Dasar",
    category: "Web Dev",
    categoryIcon: "tabler:code",
    categoryColor:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
    fileType: "PDF",
    fileSize: "4.2 MB",
    uploadDate: "10 Januari 2026",
    downloadUrl: "#",
  },
  {
    id: 2,
    title: "Slide Presentasi — Dasar Jaringan Komputer",
    category: "Jaringan",
    categoryIcon: "tabler:network",
    categoryColor:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300",
    fileType: "PPTX",
    fileSize: "12.8 MB",
    uploadDate: "25 Februari 2026",
    downloadUrl: "#",
  },
  {
    id: 3,
    title: "Modul Pelatihan Web Part 2 — JavaScript ES6+",
    category: "Web Dev",
    categoryIcon: "tabler:code",
    categoryColor:
      "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300",
    fileType: "PDF",
    fileSize: "5.7 MB",
    uploadDate: "15 Maret 2026",
    downloadUrl: "#",
  },
  {
    id: 4,
    title: "Panduan Keamanan Siber untuk Mahasiswa",
    category: "Umum",
    categoryIcon: "tabler:shield-check",
    categoryColor:
      "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-300",
    fileType: "PDF",
    fileSize: "2.1 MB",
    uploadDate: "3 April 2026",
    downloadUrl: "#",
  },
  {
    id: 5,
    title: "Modul Konfigurasi MikroTik — Routing & Switching",
    category: "Jaringan",
    categoryIcon: "tabler:network",
    categoryColor:
      "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-300",
    fileType: "PDF",
    fileSize: "8.4 MB",
    uploadDate: "20 Mei 2026",
    downloadUrl: "#",
  },
];

// Ikon file berdasarkan tipe
const fileTypeConfig = {
  PDF: {
    icon: "tabler:file-type-pdf",
    color: "text-red-500",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  PPTX: {
    icon: "tabler:file-type-ppt",
    color: "text-orange-500",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  DOCX: {
    icon: "tabler:file-type-doc",
    color: "text-blue-500",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
};

export default function MateriPage() {
  return (
    <>
      <Head>
        <title>Repositori Materi — BKLTI Unmerpas</title>
        <meta
          name="description"
          content="Unduh modul pelatihan, slide presentasi, dan dokumen resmi dari BKLTI Universitas Merdeka Pasuruan."
        />
      </Head>

      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6 lg:px-8">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-100/60 via-primary-50/30 to-transparent dark:from-primary-900/20 dark:via-primary-950/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto">
          <SectionHeading
            badge={{
              leading: true,
              icon: "tabler:book-download",
              label: "REPOSITORI MATERI",
            }}
            title="Materi & Dokumen BKLTI"
            description="Akses dan unduh modul pelatihan, slide presentasi, serta dokumen resmi BKLTI untuk mendukung proses belajar civitas akademika Universitas Merdeka Pasuruan."
          />
        </div>
      </section>

      {/* Stats Bar */}
      <section className="px-6 lg:px-8 pb-8">
        <div className="max-w-5xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-base-50 dark:bg-base-900 border border-base-200 dark:border-base-800">
            <div className="flex items-center gap-6">
              <StatItem
                icon="tabler:files"
                value={materials.length}
                label="Total Dokumen"
              />
              <div className="w-px h-8 bg-base-200 dark:bg-base-700 hidden sm:block" />
              <StatItem
                icon="tabler:category"
                value={
                  new Set(materials.map((m) => m.category)).size
                }
                label="Kategori"
              />
            </div>
            <div className="flex items-center gap-2 text-sm text-muted">
              <Icon icon="tabler:info-circle" className="w-4 h-4" />
              <span>Klik tombol download untuk mengunduh materi</span>
            </div>
          </div>
        </div>
      </section>

      {/* Material List */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 shadow-sm overflow-hidden">
            {/* Table Header (desktop) */}
            <div className="hidden md:grid md:grid-cols-12 gap-4 px-6 py-3 bg-base-50 dark:bg-base-800/50 border-b border-base-200 dark:border-base-800 text-xs font-semibold text-muted uppercase tracking-wider">
              <div className="col-span-5">Judul Materi</div>
              <div className="col-span-2">Kategori</div>
              <div className="col-span-2">Tanggal Upload</div>
              <div className="col-span-1">Ukuran</div>
              <div className="col-span-2 text-right">Aksi</div>
            </div>

            {/* Rows */}
            <ul className="divide-y divide-base-100 dark:divide-base-800">
              {materials.map((item) => {
                const ftConfig = fileTypeConfig[item.fileType] || {
                  icon: "tabler:file",
                  color: "text-base-500",
                  bg: "bg-base-50 dark:bg-base-800",
                };

                return (
                  <li
                    key={item.id}
                    className="group grid grid-cols-1 md:grid-cols-12 gap-3 md:gap-4 items-center px-6 py-5 hover:bg-base-50 dark:hover:bg-base-800/40 transition-colors duration-200"
                  >
                    {/* Title + Icon */}
                    <div className="md:col-span-5 flex items-center gap-4">
                      <div
                        className={`shrink-0 w-11 h-11 rounded-xl ${ftConfig.bg} flex items-center justify-center`}
                      >
                        <Icon
                          icon={ftConfig.icon}
                          className={`w-6 h-6 ${ftConfig.color}`}
                        />
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-sm font-semibold text-title truncate group-hover:text-primary-500 transition-colors duration-200">
                          {item.title}
                        </h3>
                        <span className="text-xs text-muted md:hidden">
                          {item.fileType} • {item.fileSize} •{" "}
                          {item.uploadDate}
                        </span>
                      </div>
                    </div>

                    {/* Category Badge */}
                    <div className="md:col-span-2 hidden md:flex">
                      <Badge
                        label={item.category}
                        icon={item.categoryIcon}
                        leading={true}
                        className={`!text-xs !px-3 !py-1 !rounded-full ${item.categoryColor}`}
                      />
                    </div>

                    {/* Upload Date */}
                    <div className="md:col-span-2 hidden md:flex items-center gap-2 text-sm text-muted">
                      <Icon
                        icon="tabler:calendar"
                        className="w-4 h-4 shrink-0"
                      />
                      <span>{item.uploadDate}</span>
                    </div>

                    {/* File Size */}
                    <div className="md:col-span-1 hidden md:flex items-center text-sm text-muted">
                      {item.fileSize}
                    </div>

                    {/* Download Button */}
                    <div className="md:col-span-2 flex md:justify-end">
                      <Button
                        href={item.downloadUrl}
                        label="Download"
                        icon="tabler:download"
                        leading={true}
                        color="primary"
                        size="small"
                      />
                    </div>

                    {/* Mobile-only: Category Badge */}
                    <div className="md:hidden flex items-center gap-2">
                      <Badge
                        label={item.category}
                        icon={item.categoryIcon}
                        leading={true}
                        className={`!text-xs !px-3 !py-1 !rounded-full ${item.categoryColor}`}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* Footer */}
            <div className="flex items-center justify-between px-6 py-4 bg-base-50 dark:bg-base-800/50 border-t border-base-200 dark:border-base-800">
              <p className="text-xs text-muted">
                Menampilkan {materials.length} dari {materials.length} dokumen
              </p>
              <div className="flex items-center gap-1 text-xs text-muted">
                <Icon icon="tabler:lock" className="w-3.5 h-3.5" />
                <span>Hanya untuk civitas akademika Unmerpas</span>
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

// Komponen kecil untuk stat items
function StatItem({ icon, value, label }) {
  return (
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center">
        <Icon icon={icon} className="w-5 h-5 text-primary-500" />
      </div>
      <div>
        <p className="text-lg font-display font-bold text-title leading-none">
          {value}
        </p>
        <p className="text-xs text-muted">{label}</p>
      </div>
    </div>
  );
}
