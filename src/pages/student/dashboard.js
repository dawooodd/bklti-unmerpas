import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?callbackUrl=/student/dashboard",
        permanent: false,
      },
    };
  }

  if (session.user.role !== "USER") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  try {
    
    const rawNotifications = await prisma.notification.findMany({
      where: {
        OR: [{ targetRole: "MAHASISWA" }, { targetRole: "ALL" }],
      },
      orderBy: {
        createdAt: "desc", 
      },
    });

    const notifications = rawNotifications.map((notif) => ({
      ...notif,
      date: notif.date.toISOString(),
      createdAt: notif.createdAt.toISOString(),
    }));

    return {
      props: {
        user: session.user,
        notifications,
      },
    };
  } catch (error) {
    console.error("Prisma Error di student/dashboard.js:", error.message);
    return {
      props: {
        user: session.user,
        notifications: [],
      },
    };
  }
}

export default function StudentDashboard({ user, notifications }) {
  
  const formatDate = (isoString) => {
    return new Date(isoString).toLocaleDateString("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getNotificationConfig = (type) => {
    switch (type) {
      case "SPP":
        return {
          icon: "tabler:wallet",
          color: "bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 border-amber-200 dark:border-amber-800",
          iconBg: "bg-amber-500",
          title: "Batas Pembayaran SPP",
        };
      case "UJIAN":
        return {
          icon: "tabler:pencil",
          color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
          iconBg: "bg-blue-500",
          title: "Jadwal Ujian",
        };
      case "SKRIPSI":
        return {
          icon: "tabler:book",
          color: "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 border-blue-200 dark:border-blue-800",
          iconBg: "bg-blue-500",
          title: "Jadwal Skripsi",
        };
      case "YUDISIUM":
        return {
          icon: "tabler:certificate",
          color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
          iconBg: "bg-emerald-500",
          title: "Pengumuman Yudisium",
        };
      case "WISUDA":
        return {
          icon: "tabler:school",
          color: "bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800",
          iconBg: "bg-emerald-500",
          title: "Perayaan Wisuda",
        };
      case "PENGUMUMAN":
      default:
        return {
          icon: "tabler:speakerphone",
          color: "bg-base-100 text-base-600 dark:bg-base-800 dark:text-base-300 border-base-200 dark:border-base-700",
          iconBg: "bg-base-500",
          title: "Pengumuman Akademik",
        };
    }
  };

  return (
    <>
      <Head>
        <title>Dashboard Mahasiswa — BKLTI Unmerpas</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col">

        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Icon icon="tabler:school" className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-title text-lg">Student Portal</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:inline">
                Mahasiswa: <strong className="text-title">{user.name}</strong>
              </span>
              <div className="h-4 w-px bg-base-200 dark:bg-base-800 hidden sm:block"></div>
              <Link
                href="/"
                className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5"
              >
                <Icon icon="tabler:home" className="w-4 h-4" /> Homepage
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-4xl mx-auto w-full px-6 py-12">
          
          <div className="mb-10">
            <h1 className="text-3xl font-display font-bold text-title">Dashboard Mahasiswa</h1>
            <p className="text-muted mt-2">
              Pantau jadwal, pengumuman akademik, dan tenggat waktu penting yang perlu Anda perhatikan.
            </p>
          </div>

          <div className="bg-white dark:bg-base-900 rounded-3xl border border-base-200 dark:border-base-800 shadow-xl overflow-hidden p-8 sm:p-10">
            <h2 className="text-xl font-display font-bold text-title mb-8 flex items-center gap-2">
              <Icon icon="tabler:bell" className="text-primary-500 w-6 h-6" />
              Timeline Informasi Akademik
            </h2>

            {notifications.length === 0 ? (
              <div className="text-center py-12 border-2 border-dashed border-base-200 dark:border-base-800 rounded-2xl">
                <Icon icon="tabler:check" className="w-12 h-12 text-emerald-400 mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-title mb-1">Semua Tenang</h3>
                <p className="text-sm text-muted">Belum ada pengumuman atau deadline dalam waktu dekat.</p>
              </div>
            ) : (
              <div className="relative pl-3">

                <div className="absolute top-4 bottom-4 left-6 w-0.5 bg-base-200 dark:bg-base-800"></div>

                <div className="flex flex-col gap-8">
                  {notifications.map((notif) => {
                    const config = getNotificationConfig(notif.type);
                    return (
                      <div key={notif.id} className="relative flex gap-6 items-start group">

                        <div className={`relative z-10 w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-white ring-4 ring-white dark:ring-base-900 ${config.iconBg} shadow-sm mt-0.5`}>
                          <Icon icon={config.icon} className="w-3.5 h-3.5" />
                        </div>

                        <div className="flex-1 flex flex-col gap-3 pt-0.5">
                          <div>
                            <div className="flex flex-wrap items-center gap-2 mb-1">
                              <span className={`px-2.5 py-0.5 rounded-md text-[11px] font-bold tracking-wider uppercase border ${config.color}`}>
                                {config.title}
                              </span>
                              <span className="text-xs text-muted flex items-center gap-1 font-medium">
                                <Icon icon="tabler:clock" className="w-3.5 h-3.5" />
                                Dikirim: {formatDate(notif.createdAt)} {formatTime(notif.createdAt)}
                              </span>
                            </div>
                            <p className="text-base text-title leading-relaxed font-medium mt-2">
                              {notif.message}
                            </p>
                          </div>

                          <div className="inline-flex items-center gap-2 px-3 py-2 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-lg w-fit">
                            <Icon icon="tabler:calendar-event" className="w-4 h-4 text-primary-500" />
                            <span className="text-sm font-medium text-title">
                              Tenggat/Pelaksanaan: <span className="text-primary-600 dark:text-primary-400">{formatDate(notif.date)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
