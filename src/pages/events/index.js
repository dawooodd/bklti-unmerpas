import Head from "next/head";
import Link from "next/link";
import { SectionHeading } from "@/components/SectionHeading";
import { Button } from "@/components/base";
import { Header, Footer } from "@/components/sections";
import { header, footer } from "@/data";

// Data acara BKLTI
const events = [
  {
    slug: "pelatihan-web-part-6",
    title: "Pelatihan Web Development Part 6",
    date: "15 Agustus 2025",
    time: "09:00 - 15:00 WIB",
    location: "Lab Komputer BKLTI",
    image: "/BKLTI.png",
    category: "Pelatihan",
    description:
      "Pelajari dasar-dasar pengembangan web modern menggunakan HTML, CSS, JavaScript, dan framework populer seperti React & Next.js. Cocok untuk pemula maupun yang ingin memperdalam skill.",
    speaker: "Tim Instruktur BKLTI",
    quota: 40,
  },
  {
    slug: "workshop-fotografi",
    title: "Workshop Fotografi & Videografi",
    date: "22 Agustus 2025",
    time: "10:00 - 16:00 WIB",
    location: "Studio Kreatif BKLTI",
    image: "/BKLTI.png",
    category: "Workshop",
    description:
      "Workshop intensif fotografi dan videografi untuk konten digital. Materi mencakup teknik komposisi, lighting, editing foto & video, serta strategi konten media sosial.",
    speaker: "Komunitas Kreatif Unmerpas",
    quota: 30,
  },
  {
    slug: "turnamen-mlbb",
    title: "Turnamen Mobile Legends: Bang Bang",
    date: "5 September 2026",
    time: "08:00 - Selesai",
    location: "Aula Universitas Mercubuana Yogyakarta",
    image: "/BKLTI.png",
    category: "Turnamen",
    description:
      "Kompetisi e-sports Mobile Legends antar mahasiswa se-Jawa Tengah. Hadiah total jutaan rupiah! Daftarkan tim kamu sekarang dan buktikan skill-mu di arena pertandingan.",
    speaker: "Divisi E-Sports BKLTI",
    quota: 64,
  },
];

// Warna badge kategori
const categoryColors = {
  Pelatihan:
    "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
  Workshop:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
  Turnamen:
    "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
};

export default function EventsPage() {
  return (
    <>
      <Head>
        <title>Daftar Acara & Pelatihan — BKLTI Unmerpas</title>
        <meta
          name="description"
          content="Temukan berbagai acara, pelatihan, workshop, dan turnamen yang diselenggarakan oleh BKLTI Universitas Mercubuana Yogyakarta."
        />
      </Head>

      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-32 pb-16 px-6 lg:px-8">
        {/* Background decorative gradient */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-gradient-to-b from-primary-100/60 via-primary-50/30 to-transparent dark:from-primary-900/20 dark:via-primary-950/10 rounded-full blur-3xl" />
        </div>

        <div className="max-w-5xl mx-auto">
          <SectionHeading
            badge={{
              leading: true,
              icon: "tabler:calendar-event",
              label: "EVENT & PELATIHAN",
            }}
            title="Acara & Pelatihan BKLTI"
            description="Ikuti berbagai acara menarik, pelatihan, workshop, dan kompetisi yang diselenggarakan oleh Biro Konsultasi Layanan Teknologi Informasi Universitas Mercubuana Yogyakarta."
          />
        </div>
      </section>

      {/* Event Grid */}
      <section className="px-6 lg:px-8 pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <article
                key={event.slug}
                className="group flex flex-col bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-primary-300 dark:hover:border-primary-700 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Card Image */}
                <div className="relative overflow-hidden aspect-video bg-base-100 dark:bg-base-800">
                  <img
                    src={event.image}
                    alt={event.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  />
                  {/* Category Badge */}
                  <span
                    className={`absolute top-3 left-3 text-xs font-semibold px-3 py-1 rounded-full ${categoryColors[event.category] || "bg-base-100 text-base-600"}`}
                  >
                    {event.category}
                  </span>
                </div>

                {/* Card Body */}
                <div className="flex flex-col flex-1 p-6 gap-3">
                  {/* Date */}
                  <div className="flex items-center gap-2 text-sm text-primary-500 font-medium">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>{event.date}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-display font-semibold text-title leading-snug line-clamp-2">
                    {event.title}
                  </h3>

                  {/* Description */}
                  <p className="text-sm text-muted line-clamp-3 flex-1">
                    {event.description}
                  </p>

                  {/* Footer: Quota + Button */}
                  <div className="flex items-center justify-between pt-4 mt-auto border-t border-base-100 dark:border-base-800">
                    <span className="text-xs text-muted">
                      Kuota:{" "}
                      <span className="font-semibold text-title">
                        {event.quota}
                      </span>{" "}
                      peserta
                    </span>
                    <Link href={`/events/${event.slug}`}>
                      <Button
                        label="Daftar"
                        color="primary"
                        size="small"
                        icon="tabler:arrow-right"
                      />
                    </Link>
                  </div>
                </div>
              </article>
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
