import Head from "next/head";
import { signIn } from "next-auth/react";
import { Icon } from "@iconify/react";
import { useRouter } from "next/router";
import Link from "next/link";

export default function Login() {
  const router = useRouter();

  return (
    <>
      <Head>
        <title>Login — BKLTI</title>
      </Head>
      <div className="min-h-screen flex items-center justify-center bg-base-50 dark:bg-base-950 p-4 relative overflow-hidden">
        {/* Background decorations */}
        <div className="absolute top-0 -left-40 w-96 h-96 bg-primary-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 -right-40 w-96 h-96 bg-secondary-500/10 rounded-full blur-3xl" />

        <div className="w-full max-w-md bg-white/80 dark:bg-base-900/80 backdrop-blur-xl rounded-3xl shadow-2xl border border-white/20 dark:border-base-800 p-10 z-10">
          <div className="text-center mb-10">
            <div className="w-16 h-16 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center mx-auto mb-6 text-primary-600 dark:text-primary-400 rotate-3">
              <Icon icon="tabler:brand-google" className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-display font-bold text-title mb-2">Selamat Datang Kembali</h1>
            <p className="text-muted font-medium">Masuk untuk melanjutkan ke portal layanan terpadu BKLTI.</p>
          </div>

          {router.query.error && (
            <div className="mb-8 p-4 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 text-sm font-semibold rounded-2xl border border-red-100 dark:border-red-800/50 flex items-start gap-3 shadow-sm">
              <Icon icon="tabler:alert-circle" className="w-5 h-5 shrink-0 mt-0.5" />
              <p>Terjadi kesalahan saat login. Harap coba lagi atau pastikan akun Anda sudah terdaftar.</p>
            </div>
          )}

          <button
            onClick={() => signIn('google')}
            className="w-full py-4 px-6 bg-white dark:bg-base-800 text-title border border-base-200 dark:border-base-700 hover:border-primary-300 dark:hover:border-primary-700 hover:bg-base-50 dark:hover:bg-base-800/80 rounded-2xl font-bold shadow-sm hover:shadow-md transition-all flex items-center justify-center gap-3 group"
          >
            <Icon icon="logos:google-icon" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            Masuk dengan Google
          </button>

          <div className="mt-10 text-center text-sm font-medium text-muted">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors">
              Daftar sekarang
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
