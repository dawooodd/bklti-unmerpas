import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Domain email kampus yang memiliki hak istimewa (bisa dijadikan ADMIN)
const CAMPUS_DOMAINS = ["@unmerpas.ac.id"];

export const authOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  callbacks: {
    // 1. Sign In: Logika Ekosistem Tertutup (Gatekeeper)
    async signIn({ user, account }) {
      if (account.provider === "google") {
        // Cek apakah email sudah terdaftar di database kita
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // JIKA TIDAK ADA: Lempar error untuk menolak login
        if (!existingUser) {
          console.warn(`[SSO] Blokir login dari email belum terdaftar: ${user.email}`);
          throw new Error("Akses Ditolak: Anda harus mendaftar terlebih dahulu di halaman /register.");
        }

        // JIKA ADA: Izinkan login
        console.log(`[SSO] Login diterima: ${user.email}`);
        return true;
      }
      return true;
    },

    // 2. JWT Callback: Menyuntikkan data dari DB ke dalam Token
    async jwt({ token, user, trigger, session }) {
      // Saat login pertama kali, ambil data user dari DB
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.nim = user.nim || null;
        token.prodi = user.prodi || null;
        // Ambil adminRequestStatus dari DB
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        token.adminRequestStatus = dbUser?.adminRequestStatus || "NONE";
      }

      // Jika profil diupdate (misal setelah onboarding atau update nama)
      if (trigger === "update" && session) {
        token.nim = session.nim ?? token.nim;
        token.prodi = session.prodi ?? token.prodi;
        token.name = session.name ?? token.name;
        token.adminRequestStatus = session.adminRequestStatus ?? token.adminRequestStatus;
      }

      return token;
    },

    // 3. Session Callback: Kirim data ke Frontend
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nim = token.nim;
        session.user.prodi = token.prodi;
        session.user.adminRequestStatus = token.adminRequestStatus;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login", // Redirect ke login jika error (menangkap error custom di signIn)
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Helper: Cek apakah email termasuk domain kampus
export function isCampusEmail(email) {
  if (!email) return false;
  return CAMPUS_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}
