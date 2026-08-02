import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";

// ─── getServerSideProps: Hanya Super Admin yang bisa akses ────────────────────
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  // Proteksi Halaman
  if (!session) {
    return { redirect: { destination: "/auth/login?callbackUrl=/super-admin/users", permanent: false } };
  }
  
  if (session.user.role !== "SUPER_ADMIN") {
    return { redirect: { destination: "/", permanent: false } };
  }

  // Fetch seluruh data pengguna dari database
  const rawUsers = await prisma.user.findMany({
    orderBy: { createdAt: "desc" }
  });

  // Serialisasi data Date
  const users = rawUsers.map((u) => ({
    ...u,
    emailVerified: u.emailVerified ? u.emailVerified.toISOString() : null,
    createdAt: u.createdAt.toISOString(),
  }));

  return {
    props: {
      sessionUser: session.user,
      users,
    },
  };
}

// ─── Halaman Utama ─────────────────────────────────────────────────────────────
export default function SuperAdminUsersPage({ sessionUser, users }) {
  const router = useRouter();
  
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const formatDate = (iso) =>
    new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" });

  // Handle perubahan Role
  const handleChangeRole = async (userId, newRole) => {
    // Konfirmasi sebelum melakukan aksi
    if (!confirm(`Anda yakin ingin mengubah role pengguna ini menjadi ${newRole}?`)) {
      return;
    }

    setLoadingId(userId);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/super-admin/change-role", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newRole }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: data.message });
        // Reload data halaman secara halus
        router.replace(router.asPath, undefined, { scroll: false });
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({ type: "error", text: "Terjadi kesalahan koneksi jaringan." });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Manajemen Pengguna — Super Admin</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 flex flex-col">
        {/* Navbar Super Admin */}
        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800 sticky top-0 z-40">
          <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center">
                <Icon icon="tabler:crown" className="text-white w-5 h-5" />
              </div>
              <span className="font-display font-bold text-title text-lg">Super Admin</span>
              <span className="hidden sm:inline text-muted text-sm">/ Manajemen Pengguna</span>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm text-muted hidden sm:inline">
                S-Admin: <strong className="text-title">{sessionUser.name}</strong>
              </span>
              <Link href="/" className="text-sm font-medium text-muted hover:text-primary-500 transition-colors flex items-center gap-1.5">
                <Icon icon="tabler:external-link" className="w-4 h-4" /> Website
              </Link>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          
          <div className="mb-8">
            <h1 className="text-2xl font-display font-bold text-title">Daftar Pengguna Sistem</h1>
            <p className="text-sm text-muted mt-1">Kelola perizinan dan peran (role) dari seluruh pengguna yang terdaftar.</p>
          </div>

          {/* Notifikasi Pesan */}
          {message.text && (
            <div className={`p-4 rounded-xl mb-6 flex items-start gap-3 border ${
              message.type === "success" 
                ? "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:border-emerald-800 dark:text-emerald-400"
                : "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
            }`}>
              <Icon 
                icon={message.type === "success" ? "tabler:check" : "tabler:alert-triangle"} 
                className="w-5 h-5 shrink-0 mt-0.5" 
              />
              <p className="text-sm font-medium leading-relaxed">{message.text}</p>
              <button onClick={() => setMessage({ type: "", text: "" })} className="ml-auto text-inherit opacity-70 hover:opacity-100">
                <Icon icon="tabler:x" className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Tabel Pengguna */}
          <div className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-base-50 dark:bg-base-800/50 text-muted uppercase text-xs font-semibold">
                  <tr>
                    <th className="px-5 py-4">Pengguna</th>
                    <th className="px-5 py-4">Status / Prodi</th>
                    <th className="px-5 py-4">Role Saat Ini</th>
                    <th className="px-5 py-4">Tanggal Gabung</th>
                    <th className="px-5 py-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 dark:divide-base-800">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-base-50/50 dark:hover:bg-base-800/50 transition-colors">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {u.image ? (
                            <img src={u.image} alt={u.name} className="w-9 h-9 rounded-full object-cover border border-base-200" />
                          ) : (
                            <div className="w-9 h-9 rounded-full bg-base-200 dark:bg-base-800 flex items-center justify-center text-muted font-bold">
                              {u.name?.charAt(0).toUpperCase() || "?"}
                            </div>
                          )}
                          <div>
                            <p className="font-semibold text-title">{u.name}</p>
                            <p className="text-xs text-muted">{u.email}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        {u.nim ? (
                          <div>
                            <p className="text-title font-mono text-xs">{u.nim}</p>
                            <p className="text-xs text-muted truncate max-w-[150px]">{u.prodi}</p>
                          </div>
                        ) : (
                          <span className="text-xs text-muted italic">Belum Onboarding</span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wider uppercase border ${
                          u.role === "SUPER_ADMIN" ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:border-red-800 dark:text-red-400"
                          : u.role === "ADMIN" ? "bg-primary-50 text-primary-700 border-primary-200 dark:bg-primary-900/30 dark:border-primary-800 dark:text-primary-400"
                          : "bg-base-100 text-base-600 border-base-200 dark:bg-base-800 dark:text-base-300 dark:border-base-700"
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-muted">
                        {formatDate(u.createdAt)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        
                        {/* Aksi hanya muncul untuk selain SUPER_ADMIN */}
                        {u.role !== "SUPER_ADMIN" ? (
                          <div className="flex justify-end gap-2">
                            {u.role === "USER" && (
                              <button
                                onClick={() => handleChangeRole(u.id, "ADMIN")}
                                disabled={loadingId === u.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-primary-600 bg-primary-50 hover:bg-primary-100 dark:bg-primary-900/20 dark:hover:bg-primary-900/40 dark:text-primary-400 transition-colors disabled:opacity-50"
                              >
                                <Icon icon={loadingId === u.id ? "tabler:loader" : "tabler:arrow-up"} className={`w-3.5 h-3.5 ${loadingId === u.id ? "animate-spin" : ""}`} />
                                Jadikan Admin
                              </button>
                            )}
                            
                            {u.role === "ADMIN" && (
                              <button
                                onClick={() => handleChangeRole(u.id, "USER")}
                                disabled={loadingId === u.id}
                                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-600 bg-amber-50 hover:bg-amber-100 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 dark:text-amber-400 transition-colors disabled:opacity-50"
                              >
                                <Icon icon={loadingId === u.id ? "tabler:loader" : "tabler:arrow-down"} className={`w-3.5 h-3.5 ${loadingId === u.id ? "animate-spin" : ""}`} />
                                Turunkan ke User
                              </button>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted opacity-50 px-3">Protected</span>
                        )}

                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
            {users.length === 0 && (
               <div className="text-center py-12 text-muted">
                 <Icon icon="tabler:users-off" className="w-10 h-10 mx-auto mb-2 opacity-40" />
                 <p className="text-sm">Belum ada pengguna terdaftar.</p>
               </div>
            )}
          </div>

        </main>
      </div>
    </>
  );
}
