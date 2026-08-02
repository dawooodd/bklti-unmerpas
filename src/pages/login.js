import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (res?.error) {
      setError(res.error);
      setLoading(false);
    } else {
      router.push("/student/dashboard"); // atau rute default lainnya yang di-handle middleware
    }
  };

  const handleGoogleLogin = () => {
    signIn("google", { callbackUrl: "/student/dashboard" });
  };

  return (
    <>
      <Head>
        <title>Masuk - BKLTI Unmerpas</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-base-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full bg-white p-8 rounded-2xl shadow-xl border border-base-200">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-extrabold text-title">Selamat Datang</h2>
            <p className="text-muted text-sm mt-2">Silakan masuk ke akun Anda</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-title mb-1">
                Email
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
                Password
              </label>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-4 py-3 rounded-xl border border-base-300 focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 transition-all outline-none"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-3 rounded-xl transition-colors disabled:opacity-50"
            >
              {loading ? "Memproses..." : "Masuk"}
            </button>
          </form>

          <div className="mt-6 flex items-center justify-center">
            <div className="w-full border-t border-base-200"></div>
            <div className="px-4 text-sm text-muted">ATAU</div>
            <div className="w-full border-t border-base-200"></div>
          </div>

          <button
            onClick={handleGoogleLogin}
            className="mt-6 w-full flex items-center justify-center gap-2 border border-base-300 hover:bg-base-50 py-3 rounded-xl transition-colors text-title font-medium"
          >
            <Icon icon="logos:google-icon" className="w-5 h-5" />
            Lanjutkan dengan Google
          </button>

          <p className="mt-8 text-center text-sm text-muted">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary-600 font-medium hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
