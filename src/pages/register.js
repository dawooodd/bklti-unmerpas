import { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    nim: "",
    prodi: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Terjadi kesalahan");
      }

      // Jika sukses, arahkan ke halaman login
      router.push("/login?registered=true");
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Daftar Akun - BKLTI Unmerpas</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-base-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-base-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-title">Daftar Akun</h2>
            <p className="text-muted text-sm mt-2">Buat akun untuk mengakses layanan BKLTI</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-title mb-1">
                Nama Lengkap <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-base-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all outline-none"
                placeholder="Masukkan nama lengkap"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-title mb-1">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-base-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all outline-none"
                placeholder="email@unmerpas.ac.id"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-title mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-base-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all outline-none"
                placeholder="Buat kata sandi"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-title mb-1">
                  NIM <span className="text-xs text-muted font-normal">(opsional)</span>
                </label>
                <input
                  type="text"
                  value={formData.nim}
                  onChange={(e) => setFormData({ ...formData, nim: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-base-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all outline-none"
                  placeholder="Nomor Induk Mahasiswa"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-title mb-1">
                  Program Studi <span className="text-xs text-muted font-normal">(opsional)</span>
                </label>
                <select
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-base-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all outline-none"
                >
                  <option value="">Pilih Prodi...</option>
                  <option value="Teknik Informatika">Teknik Informatika</option>
                  <option value="Sistem Informasi">Sistem Informasi</option>
                  <option value="Agroteknologi">Agroteknologi</option>
                  <option value="Manajemen">Manajemen</option>
                  <option value="Akuntansi">Akuntansi</option>
                </select>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50 mt-2"
            >
              {loading ? "Memproses..." : "Daftar Akun"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-muted">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-primary-600 font-medium hover:underline">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
