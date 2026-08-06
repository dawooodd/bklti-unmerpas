import Head from "next/head";
import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { prisma } from "@/lib/prisma";
import { FeatureSection } from "@/components/sections/FeatureSection";
import {
  Header,
  HeroSection,
  PortalSection,
  TestimonialSection,
  FaqSection,
  Footer,
  PricingSection,
  LargeFeatureSection,
  CtaSection,
} from "../components/sections";

import {
  header,
  faqs,
  testimonials,
  features,
  clients,
  footer,
} from "@/data";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  try {
    const session = await getServerSession(context.req, context.res, authOptions);

    const notification = await prisma.notification.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return {
      props: {
        latestNotification: notification
          ? {
            ...notification,
            date: notification.date.toISOString(),
            createdAt: notification.createdAt.toISOString(),
          }
          : null,
      },
    };
  } catch (error) {
    console.error("Prisma Error di index.js:", error.message);
    return {
      props: {
        latestNotification: null,
      },
    };
  }
}

export default function Home({ latestNotification }) {
  const router = useRouter();
  const [showModal, setShowModal] = useState(false);
  const [showAnnouncement, setShowAnnouncement] = useState(false);

  useEffect(() => {
    if (router.query.registered === 'true' || router.query.login === 'success') {
      setShowAnnouncement(true);
    }
  }, [router.query.registered, router.query.login]);

  useEffect(() => {
    if (latestNotification) {
      const isClosed = sessionStorage.getItem(`announcement_closed_${latestNotification.id}`);
      if (!isClosed) {
        const timer = setTimeout(() => {
          setShowModal(true);
        }, 2000);
        return () => clearTimeout(timer);
      }
    }
  }, [latestNotification]);

  const handleCloseModal = () => {
    setShowModal(false);
    if (latestNotification) {
      sessionStorage.setItem(`announcement_closed_${latestNotification.id}`, "true");
    }
  };

  return (
    <>
      <Head>
        <meta name="google-site-verification" content="7tsvMUitpfwrWGRn8Uh4zm2VnMCXFKpShHeC9-hkADc" />
        <title>Bklti-unmerpas</title>
      </Head>
      <Header
        logo={header.logo}
        links={header.links}
        buttons={header.buttons}
      />
      <HeroSection
        id="home"
        badge={{
          href: "#",
          icon: "tabler:arrow-right",
          label: "😻 Learn What’s New",
        }}
        title="Konsultasi Teknologi Cerdas, Lebih Mudah."
        description="Terhubung dengan para ahli, diskusikan tantangan IT Anda, dan temukan solusi untuk jaringan, sistem informasi, hingga keamanan siber dalam satu platform terpadu."
        buttons={[
          {
            href: "/helpdesk",
            label: "Buat Tiket Bantuan",
            color: "primary",
          },
          {
            href: "/events",
            label: "Lihat Pelatihan Terbaru",
            color: "transparent",
            variant: "link",
            icon: "tabler:arrow-right",
          },
        ]}
        image={{
          src: "/tablet-mockup.png",
          alt: "Product Screenshot on Tablet",
          className: "w-full h-auto",
        }}
        clientsLabel="Trusted by 100+ Brands"
        clients={clients}
      />
      <PortalSection
        id="portal"
        title="Portal Layanan Terpadu BKLTI"
        description="Mulai dari konsultasi teknologi, pengajuan layanan, hingga pemantauan kebutuhan, semua dapat diakses melalui satu pengalaman yang lebih terarah."
        badge={{ leading: true, icon: "tabler:building-community" }}
        buttons={[
          { label: "Lihat Layanan", href: "#features", color: "primary" },
          { label: "Hubungi Kami", href: "#footer", color: "light", variant: "link", icon: "tabler:arrow-right" },
        ]}
      />
      <FeatureSection
        id="features"
        title="Layanan TI Unggulan Kami"
        description="Jelajahi berbagai layanan konsultasi dan diskusi IT yang andal untuk membantu Anda memecahkan tantangan dan terus maju di dunia digital."
        features={features}
      />
      <LargeFeatureSection
        title="Selangkah Lebih Maju dengan Solusi TI Kami"
        description="Dapatkan panduan yang tepat, wawasan dari ahli, dan praktik keamanan terbaik untuk menyelesaikan tantangan TI Anda secara efektif."
        list={features.slice(0, 3)}
        image={{
          src: "/phone-mockup(2).png",
          alt: "Image",
          className:
            "w-full aspect-square object-contain rotate-6 hover:rotate-0 duration-300 ease-in-out",
        }}
      />
      <LargeFeatureSection
        reverse={true}
        title="Penuhi Kebutuhan IT Anda dengan Optimal"
        description="Hubungi, konsultasikan, dan berkolaborasi bersama kami untuk menemukan solusi terbaik bagi tantangan teknologi Anda."
        list={features.slice(0, 3)}
        image={{
          src: "/phone-mockup(1).png",
          alt: "Image",
          className:
            "w-full aspect-square object-contain -rotate-6 hover:rotate-0 duration-300 ease-in-out",
        }}
      />
      <TestimonialSection
        id="testimonials"
        title="Apa Kata Alumni Fakultas IT"
        description="Dengar langsung dari mereka yang telah merasakan manfaat dari layanan konsultasi dan bimbingan BKLTI selama studi dan karir mereka."
        badge={{
          leading: true,
          icon: "tabler:heart",
          label: "TESTIMONIALS",
        }}
        testimonials={testimonials}
      />
      <FaqSection
        id="faqs"
        title="Pertanyaan yang Sering Diajukan (FAQ)"
        description="Berikut adalah beberapa pertanyaan yang paling sering kami terima. Jika pertanyaan Anda tidak ada di sini, jangan ragu untuk menghubungi kami."
        buttons={[
          {
            label: "Hubungi Dukungan",
            href: "#",
            color: "primary",
            variant: "link",
            icon: "tabler:arrow-right",
          },
        ]}
        faqs={faqs}
      />
      <CtaSection
        title="Tertarik Kuliah Jalur Cepat?"
        description="Ikuti Program Rekognisi Pembelajaran Lampau (RPL) dan konversi pengalaman kerja atau sertifikasi IT Anda menjadi SKS. Dapatkan gelar sarjana lebih cepat!"
        buttons={[{ label: "Pelajari Program RPL", href: "/program-rpl", color: "primary" }]}
      />
      <Footer
        id="footer"
        copyright={footer.copyright}
        logo={footer.logo}
        social={footer.social}
        links={footer.links}
      />

      {showModal && latestNotification && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-base-900 w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-primary-100 dark:bg-primary-900/40 rounded-2xl text-primary-600 dark:text-primary-400">
                    <Icon icon="tabler:speakerphone" className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-display font-bold text-title">Pengumuman Terbaru</h3>
                    <p className="text-xs font-medium text-muted mt-0.5">
                      {new Date(latestNotification.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric", month: "long", year: "numeric"
                      })}
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="p-1.5 text-muted hover:text-title hover:bg-base-100 dark:hover:bg-base-800 rounded-xl transition-colors"
                >
                  <Icon icon="tabler:x" className="w-5 h-5" />
                </button>
              </div>

              <div className="bg-base-50 dark:bg-base-800/50 p-5 rounded-2xl mb-6 border border-base-200 dark:border-base-800">
                <div className="mb-3">
                  <span className="inline-block px-3 py-1 rounded-lg text-xs font-bold tracking-wider uppercase border bg-white dark:bg-base-900 border-base-200 dark:border-base-700 text-title shadow-sm">
                    {latestNotification.type}
                  </span>
                </div>
                <p className="text-title leading-relaxed font-medium">
                  {latestNotification.message}
                </p>
                <div className="mt-5 flex items-center gap-2 text-sm text-primary-600 dark:text-primary-400 font-semibold bg-primary-50 dark:bg-primary-900/20 px-3 py-2 rounded-lg border border-primary-100 dark:border-primary-800/50 w-fit">
                  <Icon icon="tabler:calendar-event" className="w-4 h-4" />
                  Pelaksanaan/Tenggat: {new Date(latestNotification.date).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </div>
              </div>

              <button
                onClick={handleCloseModal}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all active:scale-[0.98]"
              >
                Saya Mengerti, Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {showAnnouncement && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 transition-opacity duration-300">
          <div className="bg-white dark:bg-base-900 w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-8 text-center">
              <div className="mx-auto w-16 h-16 bg-primary-100 dark:bg-primary-900/40 rounded-full flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400">
                <Icon icon="tabler:party" className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-display font-bold text-title mb-2">Selamat Datang! / Pengumuman PMB & Jadwal Akademik</h3>
              <p className="text-muted mb-6">
                Terima kasih telah mendaftar. Silakan ikuti info akademik terbaru.
              </p>
              <button
                onClick={() => {
                  setShowAnnouncement(false);
                  router.replace('/', undefined, { shallow: true });
                }}
                className="w-full py-3.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-semibold shadow-lg transition-all"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
