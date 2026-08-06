import Head from "next/head";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN")) {
    return {
      redirect: {
        destination: "/login",
        permanent: false,
      },
    };
  }

  const rawEvents = await prisma.eventRegistration.findMany({
    orderBy: { createdAt: "desc" },
  });

  const rawTickets = await prisma.helpdeskTicket.findMany({
    orderBy: { createdAt: "desc" },
  });

  const eventRegistrations = rawEvents.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  const helpdeskTickets = rawTickets.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
  }));

  return {
    props: {
      eventRegistrations,
      helpdeskTickets,
    },
  };
}

export default function AdminDashboard({ eventRegistrations, helpdeskTickets }) {
  
  const formatDate = (dateString) => {
    const options = {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("id-ID", options);
  };

  const getStatusBadge = (status) => {
    switch (status.toUpperCase()) {
      case "PENDING":
        return "bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-400 dark:border-amber-800";
      case "PROSES":
        return "bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800";
      case "SELESAI":
        return "bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800";
      default:
        return "bg-base-100 text-base-700 border-base-200 dark:bg-base-800 dark:text-base-400";
    }
  };

  return (
    <>
      <Head>
        <title>Admin Dashboard — BKLTI Unmerpas</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col">

        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Icon icon="tabler:shield-lock" className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-title text-lg">
                Admin Panel BKLTI
              </span>
            </div>
            <Link
              href="/"
              className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-2"
            >
              <Icon icon="tabler:external-link" className="w-4 h-4" />
              Lihat Website
            </Link>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8 flex flex-col gap-10">

          <div>
            <h1 className="text-2xl font-display font-bold text-title">Dashboard Overview</h1>
            <p className="text-sm text-muted mt-1">Pantau data pendaftaran acara dan tiket helpdesk terbaru.</p>
          </div>

          <section className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-base-200 dark:border-base-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                  <Icon icon="tabler:calendar-event" className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-title">Pendaftar Event Terbaru</h2>
                  <p className="text-xs text-muted">Total: {eventRegistrations.length} pendaftar</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-base-50 dark:bg-base-800/50 text-muted uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nama Lengkap</th>
                    <th className="px-6 py-4">NIM</th>
                    <th className="px-6 py-4">Event Slug</th>
                    <th className="px-6 py-4">Tanggal Daftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 dark:divide-base-800">
                  {eventRegistrations.length > 0 ? (
                    eventRegistrations.map((reg) => (
                      <tr key={reg.id} className="hover:bg-base-50/50 dark:hover:bg-base-800/50 transition-colors">
                        <td className="px-6 py-4 font-medium text-title">{reg.nama}</td>
                        <td className="px-6 py-4 text-muted">{reg.nim}</td>
                        <td className="px-6 py-4 text-muted">
                          <span className="px-2.5 py-1 rounded-md bg-base-100 dark:bg-base-800 font-mono text-xs border border-base-200 dark:border-base-700">
                            {reg.eventSlug}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted">{formatDate(reg.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="px-6 py-8 text-center text-muted">
                        Belum ada data pendaftar.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-base-200 dark:border-base-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
                  <Icon icon="tabler:ticket" className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-title">Tiket Helpdesk Terbaru</h2>
                  <p className="text-xs text-muted">Total: {helpdeskTickets.length} tiket</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-base-50 dark:bg-base-800/50 text-muted uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-6 py-4">Nomor Tiket</th>
                    <th className="px-6 py-4">Nama Pelapor</th>
                    <th className="px-6 py-4">Kategori</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Tanggal Masuk</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 dark:divide-base-800">
                  {helpdeskTickets.length > 0 ? (
                    helpdeskTickets.map((ticket) => (
                      <tr key={ticket.id} className="hover:bg-base-50/50 dark:hover:bg-base-800/50 transition-colors">
                        <td className="px-6 py-4 font-mono font-medium text-title">{ticket.ticketNumber}</td>
                        <td className="px-6 py-4 font-medium text-title">{ticket.nama}</td>
                        <td className="px-6 py-4 text-muted capitalize">{ticket.kategori}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getStatusBadge(ticket.status)}`}>
                            {ticket.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-muted">{formatDate(ticket.createdAt)}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-muted">
                        Belum ada tiket masuk.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </main>
      </div>
    </>
  );
}
