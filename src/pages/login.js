import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { Icon } from "@iconify/react";
import { signIn } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
}

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({
    identifier: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        identifier: form.identifier,
        password: form.password,
        redirect: false,
      });

      if (res?.error) {
        throw new Error(res.error);
      }

      router.push("/?login=success");
    } catch (err) {
      setError(err.message || "Gagal masuk. Periksa kembali data Anda.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Masuk — BKLTI</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-base-50 dark:bg-base-950 p-4">
        <div className="w-full max-w-md bg-white dark:bg-base-900 rounded-3xl shadow-xl border border-base-200 dark:border-base-800 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-display font-bold text-title">Masuk Akun</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div className="p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-medium rounded-xl border border-red-100 dark:border-red-800 flex items-center gap-2">
                <Icon icon="tabler:alert-circle" className="w-5 h-5 shrink-0" />
                {error}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-title mb-1.5">NIM atau Email</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon icon="tabler:user" className="w-5 h-5 text-muted" />
                </div>
                <input
                  type="text"
                  required
                  value={form.identifier}
                  onChange={(e) => setForm({ ...form, identifier: e.target.value })}
                  className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-title"
                  placeholder="Contoh: 1234567 atau email"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-title mb-1.5">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Icon icon="tabler:lock" className="w-5 h-5 text-muted" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-11 pr-12 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none transition-all text-title"
                  placeholder="Masukkan Password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-4 flex items-center text-muted hover:text-title"
                >
                  <Icon icon={showPassword ? "tabler:eye-off" : "tabler:eye"} className="w-5 h-5" />
                </button>
              </div>
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
                  <Icon icon="tabler:login" className="w-5 h-5" />
                  Masuk Sekarang
                </>
              )}
            </button>
          </form>

          <div className="mt-8 relative flex items-center justify-center">
            <div className="border-t border-base-200 dark:border-base-800 w-full absolute"></div>
            <span className="bg-white dark:bg-base-900 px-4 text-sm text-muted relative z-10 font-medium">
              atau
            </span>
          </div>

          <div className="mt-6">
            <button
              onClick={() => signIn("google", { callbackUrl: "/" })}
              className="w-full py-3.5 bg-white dark:bg-base-800 hover:bg-base-50 dark:hover:bg-base-700 text-title border border-base-200 dark:border-base-700 rounded-xl font-semibold shadow-sm transition-all flex items-center justify-center gap-3"
            >
              <Icon icon="logos:google-icon" className="w-5 h-5" />
              Masuk dengan Google
            </button>
          </div>

          <div className="mt-8 text-center text-sm text-muted">
            Belum mendaftar?{" "}
            <Link href="/register" className="font-semibold text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300">
              Daftar di sini
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
