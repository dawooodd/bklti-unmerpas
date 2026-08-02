import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Icon } from "@iconify/react";

// ─── getServerSideProps: Hanya Admin yang bisa akses ──────────────────────────
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?callbackUrl=/admin/broadcast",
        permanent: false,
      },
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: session.user,
    },
  };
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────────
export default function BroadcastPage({ user }) {
  const [formData, setFormData] = useState({
    type: "",
    date: "",
    message: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });

  const notificationTypes = [
    { value: "SPP", label: "Deadline SPP" },
    { value: "UJIAN", label: "Jadwal Ujian" },
    { value: "SKRIPSI", label: "Jadwal Skripsi" },
    { value: "YUDISIUM", label: "Yudisium" },
    { value: "WISUDA", label: "Perayaan Wisuda" },
    { value: "PENGUMUMAN", label: "Pengumuman Event" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await fetch("/api/notifications/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus({ type: "success", message: data.message });
        setFormData({ type: "", date: "", message: "" }); // Reset form
      } else {
        setStatus({ type: "error", message: data.message || "Gagal mengirim broadcast." });
      }
    } catch (error) {
      setStatus({ type: "error", message: "Terjadi kesalahan jaringan." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Broadcast Notifikasi — Admin BKLTI</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col">
        {/* Navbar Admin */}
        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
                <Icon icon="tabler:broadcast" className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-title text-lg">Admin Panel</span>
              <span className="hidden sm:inline text-muted text-sm">/ Broadcast Notifikasi</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:inline">Halo, <strong className="text-title">{user.name}</strong></span>
              <div className="h-4 w-px bg-base-200 dark:bg-base-800 hidden sm:block"></div>
              <Link href="/admin/dashboard" className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5">
                <Icon icon="tabler:layout-dashboard" className="w-4 h-4" /> Dashboard
              </Link>
              <Link href="/admin/content-manager" className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5">
                <Icon icon="tabler:files" className="w-4 h-4" /> Konten
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-12">
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-display font-bold text-title">Kirim Broadcast</h1>
            <p className="text-muted mt-2">Buat pengumuman atau pengingat akademik yang akan disebar ke semua mahasiswa.</p>
          </div>

          <div className="bg-white dark:bg-base-900 rounded-3xl border border-base-200 dark:border-base-800 shadow-xl overflow-hidden p-8 sm:p-10">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              
              {/* Pesan Status */}
              {status.message && (
                <div className={`p-4 rounded-xl flex items-start gap-3 border ${
                  status.type === "success" 
                    ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                    : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
                }`}>
                  <Icon 
                    icon={status.type === "success" ? "tabler:check" : "tabler:alert-triangle"} 
                    className="w-5 h-5 shrink-0 mt-0.5" 
                  />
                  <p className="text-sm font-medium leading-relaxed">{status.message}</p>
                </div>
              )}

              {/* Jenis Notifikasi */}
              <div className="flex flex-col gap-2">
                <label htmlFor="type" className="text-sm font-semibold text-title">Jenis Notifikasi <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:bell" className="h-5 w-5 text-muted" />
                  </div>
                  <select
                    id="type"
                    name="type"
                    required
                    value={formData.type}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl text-sm text-title focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>-- Pilih Jenis Notifikasi --</option>
                    {notificationTypes.map((t) => (
                      <option key={t.value} value={t.value}>{t.label}</option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:chevron-down" className="h-4 w-4 text-muted" />
                  </div>
                </div>
              </div>

              {/* Tanggal Pelaksanaan / Deadline */}
              <div className="flex flex-col gap-2">
                <label htmlFor="date" className="text-sm font-semibold text-title">Tanggal Pelaksanaan / Deadline <span className="text-red-500">*</span></label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:calendar" className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    required
                    value={formData.date}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl text-sm text-title focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Pesan Pengumuman */}
              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm font-semibold text-title">Pesan Pengumuman <span className="text-red-500">*</span></label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={4}
                  placeholder="Tuliskan pesan lengkap yang ingin disampaikan..."
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl text-sm text-title focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none transition-all resize-y"
                ></textarea>
                <p className="text-xs text-muted text-right">Maksimal 500 karakter.</p>
              </div>

              {/* Tombol Submit */}
              <div className="pt-4">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full inline-flex justify-center items-center gap-2 px-6 py-4 rounded-xl bg-primary-600 hover:bg-primary-700 text-white font-semibold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Icon icon="tabler:loader" className="w-5 h-5 animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Icon icon="tabler:send" className="w-5 h-5" />
                      Kirim ke Semua Mahasiswa
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

        </main>
      </div>
    </>
  );
}
