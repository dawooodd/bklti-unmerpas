import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";

export default function Register() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    nim: "",
    prodi: "Informatika",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || data.message || "Terjadi kesalahan yang tidak diketahui");
      }

      setSuccess(true);
      router.push('/?registered=true');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Pendaftaran Akun — BKLTI</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-base-50 dark:bg-base-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-base-900 rounded-3xl shadow-xl border border-base-200 dark:border-base-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-title">Daftar Akun</h1>
          </div>

          {router.query.error === 'not_registered' && (
            <div className="mb-6 p-4 bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold rounded-2xl border border-amber-200 dark:border-amber-800/50 flex items-start gap-3 shadow-sm">
              <Icon icon="tabler:alert-triangle" className="w-6 h-6 shrink-0 mt-0.5" />
              <p>
                Email Anda belum terdaftar. Silakan lengkapi formulir pendaftaran ini terlebih dahulu sebelum bisa masuk menggunakan Google.
              </p>
            </div>
          )}

          {success ? (
            <div className="text-center p-6 bg-emerald-50 dark:bg-emerald-900/30 rounded-2xl border border-emerald-100 dark:border-emerald-800">
              <Icon icon="tabler:circle-check" className="w-12 h-12 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300">Pendaftaran Berhasil!</h3>
              <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-2">
                Mengarahkan Anda ke Beranda...
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2">
                  <Icon icon="tabler:alert-circle" className="w-5 h-5 shrink-0" />
                  {error}
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold text-title mb-1.5">Nama Lengkap</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:user" className="w-5 h-5 text-muted" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-title"
                    placeholder="Contoh: Budi Santoso"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-title mb-1.5">Email (Akun Google)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:mail" className="w-5 h-5 text-muted" />
                  </div>
                  <input
                    type="email"
                    required
                    value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-title"
                    placeholder="Gunakan akun Google aktif"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-title mb-1.5">NIM / NIP</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:id" className="w-5 h-5 text-muted" />
                  </div>
                  <input
                    type="text"
                    required
                    value={form.nim}
                    onChange={(e) => setForm({ ...form, nim: e.target.value })}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-title"
                    placeholder="Nomor Induk"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-title mb-1.5">Program Studi / Divisi</label>
                <select
                  required
                  value={form.prodi}
                  onChange={(e) => setForm({ ...form, prodi: e.target.value })}
                  className="w-full px-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-title appearance-none"
                >
                  <option value="Informatika">Informatika</option>
                  <option value="Rekayasa Perangkat Lunak">Rekayasa Perangkat Lunak</option>
                  <option value="Tendik (Tenaga Kependidikan)">Tendik (Tenaga Kependidikan)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 mt-2 bg-primary-600 hover:bg-primary-700 text-white rounded-xl font-bold shadow-lg shadow-primary-600/20 hover:shadow-primary-600/40 transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <Icon icon="tabler:loader-2" className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <Icon icon="tabler:user-plus" className="w-5 h-5" />
                    Daftar Sekarang
                  </>
                )}
              </button>
            </form>
          )}

          <div className="mt-8 text-center text-sm text-muted">
            Sudah mendaftar?{" "}
            <Link href="/login" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Masuk di sini
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
