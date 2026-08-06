import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return { redirect: { destination: "/auth/login?callbackUrl=/admin/content-manager", permanent: false } };
  }

  if (session.user.role !== "SUPER_ADMIN") {
    return { redirect: { destination: "/", permanent: false } };
  }

  const [rawEvents, rawModules, rawTickets] = await Promise.all([
    prisma.event.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.module.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.helpdeskTicket.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  const serialize = (arr) =>
    arr.map((item) => ({
      ...item,
      ...(item.date && { date: item.date.toISOString() }),
      createdAt: item.createdAt.toISOString(),
      ...(item.updatedAt && { updatedAt: item.updatedAt.toISOString() }),
    }));

  return {
    props: {
      user: session.user,
      events: serialize(rawEvents),
      modules: serialize(rawModules),
      tickets: serialize(rawTickets),
    },
  };
}

function AddEventForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: "", description: "", date: "", category: "KEGIATAN", isPublished: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { onSuccess(); onClose(); }
      else setError(data.message || "Gagal menyimpan.");
    } catch { setError("Terjadi kesalahan jaringan."); }
    finally { setLoading(false); }
  };

  const fields = [
    { name: "title", label: "Judul Event", placeholder: "Workshop Next.js", type: "text" },
    { name: "description", label: "Deskripsi", placeholder: "Penjelasan singkat event", type: "text" },
    { name: "date", label: "Tanggal", placeholder: "", type: "date" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-900 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-title">Tambah Event / Kegiatan</h3>
          <button onClick={onClose} className="text-muted hover:text-title transition-colors">
            <Icon icon="tabler:x" className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-title">{f.label}</label>
              <input
                type={f.type} required placeholder={f.placeholder}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
              />
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan Data"}
          </button>
        </form>
      </div>
    </div>
  );
}

function AddModuleForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: "", category: "Umum", fileUrl: "", isPublished: true });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/modules", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) { onSuccess(); onClose(); }
      else setError(data.message || "Gagal menyimpan.");
    } catch { setError("Terjadi kesalahan jaringan."); }
    finally { setLoading(false); }
  };

  const fields = [
    { name: "title", label: "Judul Modul", placeholder: "Modul Pelatihan Web Part 1", type: "text" },
    { name: "category", label: "Kategori", placeholder: "Web Dev / Jaringan / Umum", type: "text" },
    { name: "fileUrl", label: "URL File / Google Drive", placeholder: "https://drive.google.com/...", type: "text" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-900 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-title">Tambah Modul / Dokumen</h3>
          <button onClick={onClose} className="text-muted hover:text-title transition-colors">
            <Icon icon="tabler:x" className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-title">{f.label}</label>
              <input
                type={f.type} required placeholder={f.placeholder}
                value={form[f.name]}
                onChange={(e) => setForm({ ...form, [f.name]: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-base-300 dark:border-base-700 bg-base-50 dark:bg-base-800 text-title focus:outline-none focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all"
              />
            </div>
          ))}
          {error && <p className="text-sm text-red-500">{error}</p>}
          <button type="submit" disabled={loading}
            className="w-full py-3 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold text-sm transition-colors disabled:opacity-60">
            {loading ? "Menyimpan..." : "Simpan Modul"}
          </button>
        </form>
      </div>
    </div>
  );
}

function DataTable({ columns, rows, onDelete, deletingId }) {
  if (rows.length === 0) {
    return (
      <div className="text-center py-12 text-muted">
        <Icon icon="tabler:database-off" className="w-10 h-10 mx-auto mb-2 opacity-40" />
        <p className="text-sm">Belum ada data.</p>
      </div>
    );
  }
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm whitespace-nowrap">
        <thead className="bg-base-50 dark:bg-base-800/50 text-muted uppercase text-xs font-semibold">
          <tr>
            {columns.map((col) => (
              <th key={col.key} className="px-5 py-3">{col.label}</th>
            ))}
            <th className="px-5 py-3">Aksi</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-base-200 dark:divide-base-800">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-base-50/50 dark:hover:bg-base-800/50 transition-colors">
              {columns.map((col) => (
                <td key={col.key} className="px-5 py-3 text-title max-w-[200px] truncate">
                  {col.render ? col.render(row[col.key], row) : (row[col.key] ?? "—")}
                </td>
              ))}
              <td className="px-5 py-3">
                <button
                  onClick={() => onDelete(row.id)}
                  disabled={deletingId === row.id}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/40 dark:text-red-400 transition-colors disabled:opacity-50"
                >
                  <Icon icon={deletingId === row.id ? "tabler:loader" : "tabler:trash"} className="w-3.5 h-3.5" />
                  {deletingId === row.id ? "..." : "Hapus"}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function ContentManagerPage({ user, events: initialEvents, modules: initialModules, tickets: initialTickets }) {
  const [activeTab, setActiveTab] = useState("events");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const [events, setEvents] = useState(initialEvents);
  const [modules, setModules] = useState(initialModules);
  const [tickets, setTickets] = useState(initialTickets);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  const handleDelete = async (type, id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    setDeletingId(id);

    try {
      let res;
      if (type === "events") {
        res = await fetch("/api/admin/events", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      } else if (type === "modules") {
        res = await fetch("/api/admin/modules", {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id }),
        });
      } else if (type === "tickets") {
        res = await fetch(`/api/helpdesk/delete?id=${id}`, { method: "DELETE" });
      }

      if (res && res.ok) {
        if (type === "events") setEvents((prev) => prev.filter((r) => r.id !== id));
        if (type === "modules") setModules((prev) => prev.filter((r) => r.id !== id));
        if (type === "tickets") setTickets((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("Gagal menghapus data.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleSuccess = () => window.location.reload();

  const eventColumns = [
    { key: "title", label: "Judul Event" },
    { key: "slug", label: "Slug", render: (v) => <span className="font-mono text-xs bg-base-100 dark:bg-base-800 px-2 py-0.5 rounded">{v}</span> },
    { key: "category", label: "Kategori" },
    { key: "date", label: "Tanggal Pelaksanaan", render: (v) => formatDate(v) },
  ];

  const moduleColumns = [
    { key: "title", label: "Judul Modul" },
    { key: "category", label: "Kategori", render: (v) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{v}</span>
    )},
    { key: "fileUrl", label: "URL File", render: (v) => (
        <a href={v} target="_blank" rel="noreferrer" className="text-primary-500 hover:underline flex items-center gap-1">
          <Icon icon="tabler:external-link" className="w-3.5 h-3.5" /> Buka
        </a>
    )},
    { key: "createdAt", label: "Upload", render: (v) => formatDate(v) },
  ];

  const ticketColumns = [
    { key: "ticketNumber", label: "Nomor Tiket", render: (v) => <span className="font-mono text-xs">{v}</span> },
    { key: "nama",         label: "Pelapor" },
    { key: "kategori",     label: "Kategori", render: (v) => <span className="capitalize">{v}</span> },
    { key: "status",       label: "Status", render: (v) => {
        const colors = { PENDING: "text-amber-600 bg-amber-50 dark:bg-amber-900/20", PROSES: "text-blue-600 bg-blue-50 dark:bg-blue-900/20", SELESAI: "text-emerald-600 bg-emerald-50 dark:bg-emerald-900/20" };
        return <span className={`px-2 py-0.5 rounded-full text-xs font-semibold ${colors[v] || ""}`}>{v}</span>;
    }},
    { key: "createdAt", label: "Tanggal", render: (v) => formatDate(v) },
  ];

  const tabs = [
    { key: "events",    label: "Data Event",        icon: "tabler:calendar-event", count: events.length },
    { key: "modules",   label: "Data Modul TI",     icon: "tabler:file-text",      count: modules.length },
    { key: "tickets",   label: "Tiket Helpdesk",    icon: "tabler:ticket",         count: tickets.length },
  ];

  return (
    <>
      <Head>
        <title>Content Manager — Admin BKLTI</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col">

        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Icon icon="tabler:shield-lock" className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-title text-lg">Admin Panel</span>
              <span className="hidden sm:inline text-muted text-sm">/ Content Manager</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-muted hidden sm:inline">Halo, <strong className="text-title">{user.name}</strong></span>
              <Link href="/admin/dashboard"
                className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5">
                <Icon icon="tabler:layout-dashboard" className="w-4 h-4" />Dashboard
              </Link>
              <Link href="/"
                className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5">
                <Icon icon="tabler:external-link" className="w-4 h-4" />Website
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">

          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-display font-bold text-title">Manajemen Konten</h1>
              <p className="text-sm text-muted mt-1">Kelola data Event, Modul TI, dan Tiket Helpdesk.</p>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold transition-colors shadow-sm"
            >
              <Icon icon="tabler:plus" className="w-4 h-4" />
              Tambah Baru
            </button>
          </div>

          <div className="flex gap-1 p-1 bg-base-100 dark:bg-base-800/50 rounded-2xl mb-6 w-fit">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => { setActiveTab(tab.key); setShowForm(false); }}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.key
                    ? "bg-white dark:bg-base-900 text-primary-600 dark:text-primary-400 shadow-sm"
                    : "text-muted hover:text-title"
                }`}
              >
                <Icon icon={tab.icon} className="w-4 h-4" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full font-bold ${
                  activeTab === tab.key
                    ? "bg-primary-100 text-primary-600 dark:bg-primary-900/40 dark:text-primary-400"
                    : "bg-base-200 dark:bg-base-700 text-muted"
                }`}>{tab.count}</span>
              </button>
            ))}
          </div>

          <div className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-base-200 dark:border-base-800 flex items-center gap-3">
              <Icon icon={tabs.find((t) => t.key === activeTab)?.icon} className="w-5 h-5 text-primary-500" />
              <h2 className="font-semibold text-title">{tabs.find((t) => t.key === activeTab)?.label}</h2>
              <span className="ml-auto text-xs text-muted">{tabs.find((t) => t.key === activeTab)?.count} entri</span>
            </div>

            {activeTab === "events" && (
              <DataTable columns={eventColumns} rows={events}
                onDelete={(id) => handleDelete("events", id)} deletingId={deletingId} />
            )}
            {activeTab === "modules" && (
              <DataTable columns={moduleColumns} rows={modules}
                onDelete={(id) => handleDelete("modules", id)} deletingId={deletingId} />
            )}
            {activeTab === "tickets" && (
              <DataTable columns={ticketColumns} rows={tickets}
                onDelete={(id) => handleDelete("tickets", id)} deletingId={deletingId} />
            )}
          </div>
        </main>
      </div>

      {showForm && activeTab === "events" && (
        <AddEventForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
      {showForm && activeTab === "modules" && (
        <AddModuleForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
      {showForm && activeTab === "tickets" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
          <div className="w-full max-w-sm bg-white dark:bg-base-900 rounded-2xl shadow-2xl p-6 text-center">
            <Icon icon="tabler:info-circle" className="w-10 h-10 text-primary-500 mx-auto mb-3" />
            <h3 className="font-semibold text-title mb-2">Tiket Dibuat oleh User</h3>
            <p className="text-sm text-muted mb-4">Tiket Helpdesk hanya bisa dibuat melalui halaman publik <strong>/helpdesk</strong>.</p>
            <button onClick={() => setShowForm(false)}
              className="px-5 py-2 rounded-xl bg-base-100 dark:bg-base-800 text-sm font-medium text-title hover:bg-base-200 dark:hover:bg-base-700 transition-colors">
              Mengerti
            </button>
          </div>
        </div>
      )}
    </>
  );
}
