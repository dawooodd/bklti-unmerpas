import { useState, useEffect } from "react";
import Head from "next/head";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";

export default function Profile() {
  const { data: session, status, update } = useSession();
  const router = useRouter();

  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/login");
    } else if (session?.user) {
      setForm({ name: session.user.name || "", email: session.user.email || "" });
    }
  }, [status, session, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-base-50 dark:bg-base-950">
        <Icon icon="tabler:loader-2" className="w-8 h-8 animate-spin text-primary-600" />
      </div>
    );
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "UPDATE_INFO", name: form.name, email: form.email }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage({ type: "success", text: "Profil berhasil diperbarui." });
      // Update session frontend
      await update({ name: form.name, email: form.email });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAdmin = async () => {
    if (!confirm("Apakah Anda yakin ingin mengajukan diri sebagai Admin?")) return;

    setLoading(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/user/update-profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REQUEST_ADMIN" }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      setMessage({ type: "success", text: "Pengajuan Admin berhasil dikirim. Menunggu persetujuan." });
      // Update session frontend
      await update({ adminRequestStatus: "PENDING" });
    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoading(false);
    }
  };

  const requestStatus = session.user.adminRequestStatus || "NONE";

  return (
    <>
      <Head>
        <title>Profil Saya — BKLTI</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 pb-12">
        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800">
          <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-title flex items-center gap-2">
              <Icon icon="tabler:user-circle" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              Profil Saya
            </h1>
            <Link href="/" className="text-sm font-medium text-muted hover:text-title transition-colors">
              Kembali
            </Link>
          </div>
        </header>

        <main className="max-w-4xl mx-auto px-4 mt-8 space-y-6">
          {/* Status Bar */}
          <div className="bg-white dark:bg-base-900 rounded-2xl p-6 border border-base-200 dark:border-base-800 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center overflow-hidden">
                {session.user.image ? (
                  <img src={session.user.image} alt={session.user.name} className="w-full h-full object-cover" />
                ) : (
                  <Icon icon="tabler:user" className="w-8 h-8 text-primary-600 dark:text-primary-400" />
                )}
              </div>
              <div>
                <h2 className="text-xl font-bold text-title">{session.user.name}</h2>
                <p className="text-sm text-muted">{session.user.prodi} • {session.user.nim}</p>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-base-100 dark:bg-base-800 border border-base-200 dark:border-base-700">
                  <Icon icon="tabler:shield" className="w-3.5 h-3.5" />
                  Role: {session.user.role}
                </div>
              </div>
            </div>
            
            <button
              onClick={() => signOut({ callbackUrl: "/auth/login" })}
              className="px-4 py-2 text-sm font-semibold text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-xl transition-colors"
            >
              Keluar
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Form Ubah Profil */}
            <div className="lg:col-span-2 bg-white dark:bg-base-900 rounded-2xl p-6 border border-base-200 dark:border-base-800 shadow-sm">
              <h3 className="text-lg font-display font-bold text-title mb-5">Pengaturan Akun</h3>
              
              {message.text && (
                <div className={`p-4 mb-5 rounded-xl border text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
                  <Icon icon={message.type === 'success' ? "tabler:check" : "tabler:alert-circle"} className="w-5 h-5" />
                  {message.text}
                </div>
              )}

              <form onSubmit={handleUpdateProfile} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-title mb-1.5">Nama Lengkap</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full px-4 py-2.5 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-title"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-title mb-1.5">Email (SSO)</label>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full px-4 py-2.5 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 outline-none text-title"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">NIM</label>
                    <input type="text" disabled value={session.user.nim} className="w-full px-4 py-2.5 bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl text-muted cursor-not-allowed opacity-70" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-muted mb-1.5">Program Studi</label>
                    <input type="text" disabled value={session.user.prodi} className="w-full px-4 py-2.5 bg-base-100 dark:bg-base-900 border border-base-200 dark:border-base-800 rounded-xl text-muted cursor-not-allowed opacity-70" />
                  </div>
                </div>
                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-medium transition-colors disabled:opacity-50"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>

            {/* Request Admin Panel */}
            <div className="bg-white dark:bg-base-900 rounded-2xl p-6 border border-base-200 dark:border-base-800 shadow-sm h-fit">
              <h3 className="text-lg font-display font-bold text-title mb-2">Akses Admin</h3>
              <p className="text-sm text-muted mb-5 leading-relaxed">
                Butuh akses untuk mengelola konten dan jadwal akademik? Ajukan diri sebagai Admin.
              </p>

              {session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN" ? (
                <div className="p-4 bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800 rounded-xl">
                  <p className="text-sm font-semibold text-primary-700 dark:text-primary-400 flex items-center gap-2">
                    <Icon icon="tabler:shield-check" className="w-5 h-5" />
                    Anda sudah memiliki hak akses khusus.
                  </p>
                </div>
              ) : requestStatus === "PENDING" ? (
                <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-xl">
                  <p className="text-sm font-semibold text-amber-700 dark:text-amber-400 flex items-center gap-2">
                    <Icon icon="tabler:clock-hour-4" className="w-5 h-5" />
                    Pengajuan sedang diproses.
                  </p>
                  <p className="text-xs text-amber-600 dark:text-amber-500 mt-1">Silakan tunggu persetujuan Super Admin.</p>
                </div>
              ) : requestStatus === "REJECTED" ? (
                <div className="space-y-3">
                  <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl">
                    <p className="text-sm font-semibold text-red-700 dark:text-red-400 flex items-center gap-2">
                      <Icon icon="tabler:x" className="w-5 h-5" />
                      Pengajuan Anda ditolak.
                    </p>
                    <p className="text-xs text-red-600 dark:text-red-500 mt-1">Mungkin karena kuota Admin (Maks. 3) sudah penuh atau email bukan domain kampus.</p>
                  </div>
                  <button
                    onClick={handleRequestAdmin}
                    disabled={loading}
                    className="w-full py-2.5 border border-base-300 dark:border-base-700 hover:bg-base-50 dark:hover:bg-base-800 rounded-xl font-medium text-title transition-colors text-sm disabled:opacity-50"
                  >
                    Ajukan Ulang
                  </button>
                </div>
              ) : (
                <button
                  onClick={handleRequestAdmin}
                  disabled={loading}
                  className="w-full py-2.5 bg-base-900 hover:bg-black dark:bg-white dark:hover:bg-base-200 text-white dark:text-black rounded-xl font-medium transition-colors text-sm disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  <Icon icon="tabler:hand-raised" className="w-4 h-4" />
                  Ajukan Akses Admin
                </button>
              )}
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
