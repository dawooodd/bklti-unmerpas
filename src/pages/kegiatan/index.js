import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Header, Footer } from "@/components/sections";
import { header, footer } from "@/data";
import { Icon } from "@iconify/react";
import { cn } from "@/lib/utils";

const filterCategories = [
  { value: "semua", label: "Semua", icon: "tabler:layout-grid" },
  { value: "pelatihan", label: "Pelatihan", icon: "tabler:school" },
  { value: "kuliah-tamu", label: "Kuliah Tamu", icon: "tabler:microphone-2" },
  { value: "dokumentasi", label: "Dokumentasi", icon: "tabler:camera" },
];

const activities = [
  {
    id: 1,
    slug: "kuliah-tamu-big-data",
    title: "Jalan Pertama Menuju Masa Depan: Kuliah Tamu Big Data",
    excerpt:
      "Kuliah tamu bersama praktisi industri membahas peran Big Data dalam transformasi digital dan peluang karier di era data-driven.",
    date: "28 Juli 2026",
    category: "kuliah-tamu",
    categoryLabel: "Kuliah Tamu",
    image: "/BKLTI.png",
    readTime: "5 menit",
  },
  {
    id: 2,
    slug: "pelatihan-web-part-5",
    title: "Pelatihan Web Development Part 5: React & State Management",
    excerpt:
      "Sesi lanjutan pelatihan web yang membahas React Hooks, Context API, dan pengelolaan state pada aplikasi modern.",
    date: "15 Juli 2026",
    category: "pelatihan",
    categoryLabel: "Pelatihan",
    image: "/BKLTI.png",
    readTime: "4 menit",
  },
  {
    id: 3,
    slug: "dokumentasi-dies-natalis",
    title: "Dokumentasi Dies Natalis ke-12: Pameran Teknologi BKLTI",
    excerpt:
      "Rekap kegiatan pameran teknologi dalam rangka Dies Natalis Universitas, menampilkan karya mahasiswa dan demo produk inovatif.",
    date: "5 Juli 2026",
    category: "dokumentasi",
    categoryLabel: "Dokumentasi",
    image: "/BKLTI.png",
    readTime: "3 menit",
  },
  {
    id: 4,
    slug: "kuliah-tamu-cybersecurity",
    title: "Kuliah Tamu: Cybersecurity Awareness di Era Digital",
    excerpt:
      "Narasumber dari BSSN membagikan insight tentang ancaman siber terkini dan best practice keamanan untuk mahasiswa.",
    date: "20 Juni 2026",
    category: "kuliah-tamu",
    categoryLabel: "Kuliah Tamu",
    image: "/BKLTI.png",
    readTime: "6 menit",
  },
  {
    id: 5,
    slug: "pelatihan-jaringan-mikrotik",
    title: "Pelatihan Konfigurasi MikroTik: Routing & Firewall",
    excerpt:
      "Workshop hands-on konfigurasi router MikroTik untuk mahasiswa jaringan, mencakup routing dinamis dan keamanan firewall.",
    date: "10 Juni 2026",
    category: "pelatihan",
    categoryLabel: "Pelatihan",
    image: "/BKLTI.png",
    readTime: "4 menit",
  },
  {
    id: 6,
    slug: "dokumentasi-kunjungan-industri",
    title: "Kunjungan Industri ke Data Center Telkom Indonesia",
    excerpt:
      "Dokumentasi kunjungan mahasiswa ke fasilitas data center Telkom, melihat langsung infrastruktur server dan sistem pendingin.",
    date: "1 Juni 2026",
    category: "dokumentasi",
    categoryLabel: "Dokumentasi",
    image: "/BKLTI.png",
    readTime: "3 menit",
  },
];

const categoryStyle = {
  pelatihan:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  "kuliah-tamu":
    "bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300",
  dokumentasi:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

export default function KegiatanPage() {
  const [activeFilter, setActiveFilter] = useState("semua");

  const filteredActivities =
    activeFilter === "semua"
      ? activities
      : activities.filter((a) => a.category === activeFilter);

  return (
    <>
      <Head>
        <title>Dokumentasi Kegiatan — BKLTI Unmerpas</title>
        <meta
          name="description"
          content="Lihat dokumentasi kegiatan, jurnal pelatihan, kuliah tamu, dan kegiatan BKLTI Universitas Merdeka Pasuruan."
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
              icon: "tabler:notebook",
              label: "JURNAL KEGIATAN",
            }}
            title="Dokumentasi & Kegiatan"
            description="Jelajahi rangkuman kegiatan, pelatihan, kuliah tamu, dan momen-momen penting yang telah diselenggarakan oleh BKLTI Universitas Merdeka Pasuruan."
          />
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-10">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {filterCategories.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveFilter(cat.value)}
                className={cn(
                  "group inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 border",
                  activeFilter === cat.value
                    ? "bg-primary-500 text-white border-primary-500 shadow-lg shadow-primary-500/20"
                    : "bg-white dark:bg-base-900 text-base-600 dark:text-base-400 border-base-200 dark:border-base-700 hover:border-primary-300 dark:hover:border-primary-700 hover:text-primary-500"
                )}
              >
                <Icon
                  icon={cat.icon}
                  className={cn(
                    "w-4 h-4 transition-colors duration-200",
                    activeFilter === cat.value
                      ? "text-white"
                      : "text-base-400 group-hover:text-primary-500"
                  )}
                />
                {cat.label}
                {cat.value === "semua" && (
                  <span
                    className={cn(
                      "text-xs px-1.5 py-0.5 rounded-full leading-none font-semibold",
                      activeFilter === cat.value
                        ? "bg-white/20 text-white"
                        : "bg-base-100 dark:bg-base-800 text-muted"
                    )}
                  >
                    {activities.length}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          {filteredActivities.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredActivities.map((item, idx) => (
                <article
                  key={item.id}
                  className="group flex flex-col h-full bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 ease-in-out hover:-translate-y-1"
                >

                  <div className="relative overflow-hidden aspect-video bg-base-100 dark:bg-base-800">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />

                    <span
                      className={cn(
                        "absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full",
                        categoryStyle[item.category] ||
                          "bg-base-100 text-base-600"
                      )}
                    >
                      {item.categoryLabel}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow gap-3">

                    <div className="flex items-center gap-3 text-xs text-muted">
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="tabler:calendar" className="w-3.5 h-3.5" />
                        {item.date}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-base-300 dark:bg-base-600" />
                      <span className="inline-flex items-center gap-1">
                        <Icon icon="tabler:clock" className="w-3.5 h-3.5" />
                        {item.readTime}
                      </span>
                    </div>

                    <h3 className="text-base font-display font-semibold text-title leading-snug line-clamp-2 group-hover:text-primary-500 transition-colors duration-200">
                      {item.title}
                    </h3>

                    <p className="text-sm text-muted leading-relaxed flex-grow">
                      {item.excerpt}
                    </p>

                    <Link
                      href={`/kegiatan/${item.slug}`}
                      className="mt-auto inline-flex items-center gap-1.5 text-sm font-medium text-primary-500 hover:text-primary-600 dark:hover:text-primary-400 group/link"
                    >
                      Baca Selengkapnya
                      <Icon
                        icon="tabler:arrow-right"
                        className="w-4 h-4 group-hover/link:translate-x-1 transition-transform duration-200"
                      />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="w-16 h-16 rounded-2xl bg-base-100 dark:bg-base-800 flex items-center justify-center">
                <Icon
                  icon="tabler:search-off"
                  className="w-8 h-8 text-base-400"
                />
              </div>
              <h3 className="text-lg font-display font-semibold text-title">
                Belum Ada Kegiatan
              </h3>
              <p className="text-sm text-muted text-center max-w-sm">
                Belum ada kegiatan untuk kategori ini. Silakan pilih kategori
                lain atau cek kembali nanti.
              </p>
              <button
                onClick={() => setActiveFilter("semua")}
                className="inline-flex items-center gap-2 text-sm font-medium text-primary-500 hover:text-primary-600 mt-2"
              >
                <Icon icon="tabler:arrow-left" className="w-4 h-4" />
                Tampilkan Semua Kegiatan
              </button>
            </div>
          )}
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
