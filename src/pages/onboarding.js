import { useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { Icon } from "@iconify/react";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Jika tidak ada session, arahkan ke login
  if (!session) {
    return {
      redirect: {
        destination: "/auth/login?callbackUrl=/onboarding",
        permanent: false,
      },
    };
  }

  // Jika role adalah ADMIN atau SUPER_ADMIN, tidak perlu onboarding mahasiswa
  if (session.user.role === "ADMIN" || session.user.role === "SUPER_ADMIN") {
    return {
      redirect: {
        destination: "/admin/dashboard",
        permanent: false,
      },
    };
  }

  // Jika sudah punya NIM dan Prodi, lewati onboarding
  if (session.user.nim && session.user.prodi) {
    return {
      redirect: {
        destination: "/student/dashboard",
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

export default function OnboardingPage({ user }) {
  const router = useRouter();
  const { update } = useSession();
  
  const [formData, setFormData] = useState({
    nim: "",
    prodi: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const programs = [
    "S1 Teknik Informatika",
    "S1 Sistem Informasi",
    "S1 Agroteknologi",
    "S1 Ilmu Hukum",
    "S1 Manajemen",
    "S1 Akuntansi",
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await fetch("/api/user/complete-profile", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        // Trigger NextAuth untuk mengupdate session JWT di browser
        await update({
          nim: formData.nim.trim(),
          prodi: formData.prodi.trim(),
        });
        
        // Redirect ke dashboard mahasiswa
        router.push("/student/dashboard");
      } else {
        setError(data.message || "Gagal melengkapi profil. Silakan coba lagi.");
      }
    } catch (err) {
      setError("Terjadi kesalahan jaringan. Silakan periksa koneksi Anda.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Lengkapi Profil — BKLTI Unmerpas</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col justify-center py-12 px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="w-16 h-16 bg-primary-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-primary-600/30 mb-6">
            <Icon icon="tabler:user-plus" className="text-white w-8 h-8" />
          </div>
          <h2 className="text-center text-3xl font-display font-bold text-title">
            Lengkapi Profil Anda
          </h2>
          <p className="mt-2 text-center text-sm text-muted">
            Halo <strong className="text-title">{user.name}</strong>, Anda berhasil login melalui Google. Harap lengkapi data akademik Anda untuk melanjutkan.
          </p>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-[480px]">
          <div className="bg-white dark:bg-base-900 py-8 px-6 sm:px-10 shadow-xl border border-base-200 dark:border-base-800 rounded-3xl">
            <form className="space-y-6" onSubmit={handleSubmit}>
              
              {/* Alert Error */}
              {error && (
                <div className="p-4 rounded-xl bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400 flex items-start gap-3">
                  <Icon icon="tabler:alert-triangle" className="w-5 h-5 shrink-0 mt-0.5" />
                  <p className="text-sm font-medium leading-relaxed">{error}</p>
                </div>
              )}

              {/* Input NIM */}
              <div>
                <label htmlFor="nim" className="block text-sm font-semibold text-title mb-2">
                  Nomor Induk Mahasiswa (NIM) <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:id-badge-2" className="h-5 w-5 text-muted" />
                  </div>
                  <input
                    id="nim"
                    name="nim"
                    type="text"
                    required
                    placeholder="Contoh: 2023010001"
                    value={formData.nim}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl text-sm text-title focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none transition-all"
                  />
                </div>
              </div>

              {/* Dropdown Program Studi */}
              <div>
                <label htmlFor="prodi" className="block text-sm font-semibold text-title mb-2">
                  Program Studi <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:book" className="h-5 w-5 text-muted" />
                  </div>
                  <select
                    id="prodi"
                    name="prodi"
                    required
                    value={formData.prodi}
                    onChange={handleChange}
                    className="w-full pl-11 pr-4 py-3 bg-base-50 dark:bg-base-950 border border-base-200 dark:border-base-800 rounded-xl text-sm text-title focus:ring-2 focus:ring-primary-500/40 focus:border-primary-500 outline-none transition-all appearance-none"
                  >
                    <option value="" disabled>-- Pilih Program Studi --</option>
                    {programs.map((program) => (
                      <option key={program} value={program}>
                        {program}
                      </option>
                    ))}
                  </select>
                  <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                    <Icon icon="tabler:chevron-down" className="h-4 w-4 text-muted" />
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 transition-all active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none"
                >
                  {isLoading ? (
                    <>
                      <Icon icon="tabler:loader" className="w-5 h-5 animate-spin" />
                      Menyimpan Data...
                    </>
                  ) : (
                    <>
                      Simpan & Masuk Dashboard
                      <Icon icon="tabler:arrow-right" className="w-5 h-5" />
                    </>
                  )}
                </button>
              </div>

            </form>
          </div>
          
          <p className="mt-8 text-center text-xs text-muted">
            Dengan melengkapi profil, Anda menyetujui Ketentuan Layanan BKLTI Universitas Merdeka Pasuruan.
          </p>
        </div>
      </div>
    </>
  );
}
