import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { prisma } from "@/lib/prisma";
import { Icon } from "@iconify/react";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session || session.user.role !== "SUPER_ADMIN") {
    return { redirect: { destination: "/", permanent: false } };
  }

  // Ambil user yang berstatus PENDING (ingin jadi admin)
  const pendingUsers = await prisma.user.findMany({
    where: { adminRequestStatus: "PENDING" },
    orderBy: { createdAt: "desc" },
  });

  // Serialisasi data
  const serializedUsers = pendingUsers.map((u) => ({
    ...u,
    createdAt: u.createdAt.toISOString(),
    emailVerified: u.emailVerified ? u.emailVerified.toISOString() : null,
  }));

  return {
    props: {
      users: serializedUsers,
    },
  };
}

export default function ApprovalsPage({ users }) {
  const [userList, setUserList] = useState(users);
  const [loadingId, setLoadingId] = useState(null);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleRequest = async (userId, action) => {
    // Confirm action
    const actionText = action === "APPROVE" ? "menyetujui" : action === "REJECT" ? "menolak" : "menghapus";
    if (!confirm(`Apakah Anda yakin ingin ${actionText} pengguna ini?`)) return;

    setLoadingId(userId);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/super-admin/handle-request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, action }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message);
      }

      setMessage({ type: "success", text: data.message });
      // Hapus user dari list jika di-approve, di-reject, atau di-delete
      setUserList(userList.filter((u) => u.id !== userId));

    } catch (err) {
      setMessage({ type: "error", text: err.message });
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <>
      <Head>
        <title>Persetujuan Admin — Super Admin</title>
      </Head>

      <div className="min-h-screen bg-base-50 dark:bg-base-950 pb-12">
        <header className="bg-white dark:bg-base-900 border-b border-base-200 dark:border-base-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <h1 className="text-xl font-display font-bold text-title flex items-center gap-2">
              <Icon icon="tabler:user-check" className="w-6 h-6 text-primary-600 dark:text-primary-400" />
              Persetujuan Admin
            </h1>
            <Link href="/super-admin/dashboard" className="text-sm font-medium text-muted hover:text-title transition-colors">
              Kembali ke Dashboard
            </Link>
          </div>
        </header>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          {message.text && (
            <div className={`p-4 mb-6 rounded-xl border text-sm font-medium flex items-center gap-2 ${message.type === 'success' ? 'bg-emerald-50 border-emerald-100 text-emerald-700 dark:bg-emerald-900/20 dark:border-emerald-800 dark:text-emerald-400' : 'bg-red-50 border-red-100 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400'}`}>
              <Icon icon={message.type === 'success' ? "tabler:check" : "tabler:alert-circle"} className="w-5 h-5" />
              {message.text}
            </div>
          )}

          <div className="bg-white dark:bg-base-900 rounded-2xl border border-base-200 dark:border-base-800 overflow-hidden shadow-sm">
            <div className="p-6 border-b border-base-200 dark:border-base-800">
              <h2 className="text-lg font-display font-semibold text-title">Daftar Pengajuan Akses</h2>
              <p className="text-sm text-muted mt-1">Pengguna berikut meminta hak akses sebagai ADMIN (Maksimal kuota 3 Admin).</p>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-base-50 dark:bg-base-800/50 text-muted">
                  <tr>
                    <th className="px-6 py-4 font-semibold">Pengguna</th>
                    <th className="px-6 py-4 font-semibold">NIM & Prodi</th>
                    <th className="px-6 py-4 font-semibold text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-base-200 dark:divide-base-800">
                  {userList.length === 0 ? (
                    <tr>
                      <td colSpan="3" className="px-6 py-12 text-center text-muted">
                        <Icon icon="tabler:inbox" className="w-12 h-12 mx-auto mb-3 text-base-300 dark:text-base-700" />
                        <p>Tidak ada pengajuan Admin saat ini.</p>
                      </td>
                    </tr>
                  ) : (
                    userList.map((user) => (
                      <tr key={user.id} className="hover:bg-base-50 dark:hover:bg-base-800/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary-100 dark:bg-primary-900/30 flex flex-shrink-0 items-center justify-center">
                              <Icon icon="tabler:user" className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                            </div>
                            <div>
                              <p className="font-semibold text-title">{user.name}</p>
                              <p className="text-xs text-muted mt-0.5">{user.email}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <p className="text-title">{user.nim}</p>
                          <p className="text-xs text-muted mt-0.5">{user.prodi}</p>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleRequest(user.id, "APPROVE")}
                              disabled={loadingId === user.id}
                              className="p-2 text-emerald-600 bg-emerald-50 hover:bg-emerald-100 dark:text-emerald-400 dark:bg-emerald-900/20 dark:hover:bg-emerald-900/40 rounded-lg transition-colors disabled:opacity-50"
                              title="Setujui sebagai Admin"
                            >
                              <Icon icon="tabler:check" className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => handleRequest(user.id, "REJECT")}
                              disabled={loadingId === user.id}
                              className="p-2 text-amber-600 bg-amber-50 hover:bg-amber-100 dark:text-amber-400 dark:bg-amber-900/20 dark:hover:bg-amber-900/40 rounded-lg transition-colors disabled:opacity-50"
                              title="Tolak Pengajuan"
                            >
                              <Icon icon="tabler:x" className="w-5 h-5" />
                            </button>
                            <div className="w-px h-6 bg-base-200 dark:bg-base-700 mx-1"></div>
                            <button
                              onClick={() => handleRequest(user.id, "DELETE")}
                              disabled={loadingId === user.id}
                              className="p-2 text-red-600 bg-red-50 hover:bg-red-100 dark:text-red-400 dark:bg-red-900/20 dark:hover:bg-red-900/40 rounded-lg transition-colors disabled:opacity-50"
                              title="Hapus Akun Pengguna"
                            >
                              <Icon icon="tabler:trash" className="w-5 h-5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
