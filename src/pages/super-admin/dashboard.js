import Head from "next/head";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return {
      redirect: {
        destination: session ? "/" : "/auth/login?callbackUrl=/super-admin/dashboard",
        permanent: false,
      },
    };
  }

  try {
    const [totalUsers, totalAdmins, totalTickets, totalEvents, totalModules, totalNotifications, pendingTickets] =
      await Promise.all([
        prisma.user.count(),
        prisma.user.count({ where: { role: "ADMIN" } }),
        prisma.helpdeskTicket.count(),
        prisma.event.count(),
        prisma.module.count(),
        prisma.notification.count(),
        prisma.helpdeskTicket.count({ where: { status: "PENDING" } }),
      ]);

    return {
      props: {
        sessionUser: session.user,
        stats: {
          totalUsers,
          totalAdmins,
          maxAdmins: 3,
          totalTickets,
          pendingTickets,
          totalEvents,
          totalModules,
          totalNotifications,
        },
      },
    };
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    return {
      props: {
        sessionUser: session.user,
        stats: {
          totalUsers: 0, totalAdmins: 0, maxAdmins: 3,
          totalTickets: 0, pendingTickets: 0,
          totalEvents: 0, totalModules: 0, totalNotifications: 0,
        },
      },
    };
  }
}

export default function SuperAdminDashboard({ sessionUser, stats }) {
  const statCards = [
    { label: "Total Pengguna", value: stats.totalUsers, icon: "tabler:users", color: "bg-blue-500", href: "/super-admin/users" },
    { label: "Admin Aktif", value: `${stats.totalAdmins} / ${stats.maxAdmins}`, icon: "tabler:shield-check", color: "bg-emerald-500", href: "/super-admin/users" },
    { label: "Tiket Helpdesk", value: stats.totalTickets, icon: "tabler:ticket", color: "bg-amber-500", sub: `${stats.pendingTickets} pending` },
    { label: "Event Terpublish", value: stats.totalEvents, icon: "tabler:calendar-event", color: "bg-violet-500" },
    { label: "Modul Terunggah", value: stats.totalModules, icon: "tabler:book-2", color: "bg-pink-500" },
    { label: "Notifikasi Dibuat", value: stats.totalNotifications, icon: "tabler:bell-ringing", color: "bg-cyan-500" },
  ];

  const quickLinks = [
    { label: "Manajemen Pengguna", desc: "Kelola akun & assign role Admin", icon: "tabler:users-group", href: "/super-admin/users", color: "text-blue-600 dark:text-blue-400" },
    { label: "Kelola Konten", desc: "Event, pelatihan, modul & materi", icon: "tabler:layout-dashboard", href: "/admin/content-manager", color: "text-emerald-600 dark:text-emerald-400" },
    { label: "Broadcast Notifikasi", desc: "Kirim pengumuman ke mahasiswa", icon: "tabler:speakerphone", href: "/admin/broadcast", color: "text-amber-600 dark:text-amber-400" },
    { label: "Tiket Helpdesk", desc: "Lihat & kelola tiket bantuan", icon: "tabler:headset", href: "/admin/dashboard", color: "text-violet-600 dark:text-violet-400" },
  ];

  return (
    <>
      <Head>
        <title>Super Admin Dashboard — BKLTI</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950">

        <header className="border-b border-base-200 dark:border-base-800 bg-white dark:bg-base-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <Icon icon="tabler:crown" className="w-6 h-6 text-red-600 dark:text-red-400" />
              </div>
              <div>
                <h1 className="text-xl font-display font-bold text-title">Super Admin Dashboard</h1>
                <p className="text-sm text-muted">Selamat datang, {sessionUser.name}</p>
              </div>
            </div>
            <Link href="/" className="flex items-center gap-2 text-sm text-muted hover:text-title transition-colors">
              <Icon icon="tabler:arrow-left" className="w-4 h-4" />
              Kembali ke Beranda
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

          <section>
            <h2 className="text-lg font-display font-semibold text-title mb-4">Ringkasan Sistem</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {statCards.map((card, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 p-4 hover:shadow-lg transition-shadow cursor-default"
                >
                  <div className={`w-10 h-10 ${card.color} rounded-xl flex items-center justify-center mb-3`}>
                    <Icon icon={card.icon} className="w-5 h-5 text-white" />
                  </div>
                  <p className="text-2xl font-display font-bold text-title">{card.value}</p>
                  <p className="text-xs text-muted mt-1">{card.label}</p>
                  {card.sub && (
                    <p className="text-xs text-amber-600 dark:text-amber-400 mt-1 font-medium">{card.sub}</p>
                  )}
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-lg font-display font-semibold text-title mb-4">Akses Cepat</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {quickLinks.map((link, i) => (
                <Link
                  key={i}
                  href={link.href}
                  className="group bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 p-5 hover:shadow-lg hover:border-primary-300 dark:hover:border-primary-700 transition-all"
                >
                  <div className="flex items-start gap-3">
                    <Icon icon={link.icon} className={`w-8 h-8 ${link.color} mt-0.5`} />
                    <div>
                      <h3 className="font-semibold text-title group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                        {link.label}
                      </h3>
                      <p className="text-sm text-muted mt-1">{link.desc}</p>
                    </div>
                  </div>
                  <div className="flex justify-end mt-3">
                    <Icon icon="tabler:arrow-right" className="w-5 h-5 text-muted group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </section>

          <section className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 p-6">
            <h2 className="text-lg font-display font-semibold text-title mb-3">Kebijakan Kuota Role</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30">
                <Icon icon="tabler:crown" className="w-6 h-6 text-red-600 dark:text-red-400" />
                <div>
                  <p className="font-semibold text-title">SUPER_ADMIN</p>
                  <p className="text-sm text-muted">Maksimal 1 akun — Tidak bisa ditambah dari dashboard</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 bg-emerald-50 dark:bg-emerald-900/10 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
                <Icon icon="tabler:shield-check" className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                <div>
                  <p className="font-semibold text-title">ADMIN</p>
                  <p className="text-sm text-muted">Maksimal 3 akun — Hanya email @unmerpas.ac.id</p>
                </div>
                <span className="ml-auto text-lg font-bold text-emerald-600 dark:text-emerald-400">
                  {stats.totalAdmins}/{stats.maxAdmins}
                </span>
              </div>
            </div>
          </section>
        </main>
      </div>
    </>
  );
}
