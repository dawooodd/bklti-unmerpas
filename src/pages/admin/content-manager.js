import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";

// ─── getServerSideProps: Hanya Admin yang bisa akses ──────────────────────────
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Redirect ke login jika tidak ada sesi
  if (!session) {
    return { redirect: { destination: "/auth/login?callbackUrl=/admin/content-manager", permanent: false } };
  }

  // Redirect ke beranda jika bukan ADMIN atau SUPER_ADMIN
  if (session.user.role !== "ADMIN" && session.user.role !== "SUPER_ADMIN") {
    return { redirect: { destination: "/", permanent: false } };
  }

  // Fetch semua data yang dibutuhkan
  const [rawEvents, rawDocuments, rawActivities] = await Promise.all([
    prisma.eventRegistration.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.document.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.helpdeskTicket.findMany({ orderBy: { createdAt: "desc" }, take: 20 }),
  ]);

  // Serialisasi Date ke string
  const serialize = (arr) =>
    arr.map((item) => ({
      ...item,
      createdAt: item.createdAt.toISOString(),
    }));

  return {
    props: {
      user: session.user,
      events: serialize(rawEvents),
      documents: serialize(rawDocuments),
      tickets: serialize(rawActivities),
    },
  };
}

// ─── Komponen Tambah Event Form ────────────────────────────────────────────────
function AddEventForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ eventSlug: "", nama: "", nim: "", instansi: "", noWa: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/events/register", {
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
    { name: "eventSlug", label: "Event Slug", placeholder: "pelatihan-web-part-6" },
    { name: "nama", label: "Nama Peserta", placeholder: "Nama lengkap" },
    { name: "nim", label: "NIM", placeholder: "2023010001" },
    { name: "instansi", label: "Instansi / Prodi", placeholder: "Teknik Informatika" },
    { name: "noWa", label: "No. WhatsApp", placeholder: "08123456789" },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm px-4">
      <div className="w-full max-w-md bg-white dark:bg-base-900 rounded-2xl shadow-2xl p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-display font-semibold text-title">Tambah Pendaftar Event</h3>
          <button onClick={onClose} className="text-muted hover:text-title transition-colors">
            <Icon icon="tabler:x" className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {fields.map((f) => (
            <div key={f.name} className="flex flex-col gap-1">
              <label className="text-sm font-medium text-title">{f.label}</label>
              <input
                type="text" required placeholder={f.placeholder}
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

// ─── Komponen Tambah Dokumen Form ──────────────────────────────────────────────
function AddDocumentForm({ onClose, onSuccess }) {
  const [form, setForm] = useState({ title: "", category: "", fileUrl: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/modules/create", {
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
    { name: "title", label: "Judul Modul", placeholder: "Modul Pelatihan Web Part 1" },
    { name: "category", label: "Kategori", placeholder: "Web Dev / Jaringan / Umum" },
    { name: "fileUrl", label: "URL File / Google Drive", placeholder: "https://drive.google.com/..." },
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
                type="text" required placeholder={f.placeholder}
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

// ─── Komponen Tabel Generic ────────────────────────────────────────────────────
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

// ─── Halaman Utama ─────────────────────────────────────────────────────────────
export default function ContentManagerPage({ user, events: initialEvents, documents: initialDocuments, tickets: initialTickets }) {
  const [activeTab, setActiveTab] = useState("events");
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  // State data lokal (akan diperbarui setelah add/delete tanpa full reload)
  const [events, setEvents] = useState(initialEvents);
  const [documents, setDocuments] = useState(initialDocuments);
  const [tickets, setTickets] = useState(initialTickets);

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  // ── Handler Delete ──────────────────────────────────────────────────────────
  const handleDelete = async (type, id) => {
    if (!confirm("Yakin ingin menghapus data ini?")) return;
    setDeletingId(id);

    const endpointMap = {
      events:    `/api/events/delete?id=${id}`,
      documents: `/api/modules/delete?id=${id}`,
      tickets:   `/api/helpdesk/delete?id=${id}`,
    };

    try {
      const res = await fetch(endpointMap[type], { method: "DELETE" });
      if (res.ok) {
        if (type === "events")    setEvents((prev) => prev.filter((r) => r.id !== id));
        if (type === "documents") setDocuments((prev) => prev.filter((r) => r.id !== id));
        if (type === "tickets")   setTickets((prev) => prev.filter((r) => r.id !== id));
      } else {
        alert("Gagal menghapus data.");
      }
    } catch {
      alert("Terjadi kesalahan jaringan.");
    } finally {
      setDeletingId(null);
    }
  };

  // ── Refresh data setelah tambah baru ────────────────────────────────────────
  const handleSuccess = () => window.location.reload();

  // ── Konfigurasi Kolom Tabel ─────────────────────────────────────────────────
  const eventColumns = [
    { key: "nama",      label: "Nama Peserta" },
    { key: "nim",       label: "NIM" },
    { key: "eventSlug", label: "Event", render: (v) => <span className="font-mono text-xs bg-base-100 dark:bg-base-800 px-2 py-0.5 rounded">{v}</span> },
    { key: "instansi",  label: "Instansi" },
    { key: "createdAt", label: "Tanggal", render: (v) => formatDate(v) },
  ];

  const documentColumns = [
    { key: "title",     label: "Judul Modul" },
    { key: "category",  label: "Kategori", render: (v) => (
        <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300">{v}</span>
    )},
    { key: "fileUrl",   label: "URL File", render: (v) => (
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
    { key: "events",    label: "Pendaftar Event",   icon: "tabler:calendar-event", count: events.length },
    { key: "documents", label: "Modul TI",           icon: "tabler:file-text",      count: documents.length },
    { key: "tickets",   label: "Tiket Helpdesk",     icon: "tabler:ticket",         count: tickets.length },
  ];

  return (
    <>
      <Head>
        <title>Content Manager — Admin BKLTI</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col">
        {/* Navbar */}
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

        {/* Main */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          {/* Page Header */}
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

          {/* Tabs */}
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

          {/* Tab Content Panel */}
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
            {activeTab === "documents" && (
              <DataTable columns={documentColumns} rows={documents}
                onDelete={(id) => handleDelete("documents", id)} deletingId={deletingId} />
            )}
            {activeTab === "tickets" && (
              <DataTable columns={ticketColumns} rows={tickets}
                onDelete={(id) => handleDelete("tickets", id)} deletingId={deletingId} />
            )}
          </div>
        </main>
      </div>

      {/* Modal Form Tambah Baru */}
      {showForm && activeTab === "events" && (
        <AddEventForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
      )}
      {showForm && activeTab === "documents" && (
        <AddDocumentForm onClose={() => setShowForm(false)} onSuccess={handleSuccess} />
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
