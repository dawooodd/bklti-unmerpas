import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

// Domain email kampus yang memiliki hak istimewa (bisa dijadikan ADMIN)
const CAMPUS_DOMAINS = ["@unmerpas.ac.id"];

export const authOptions = {
  // Integrasi NextAuth dengan Prisma (auto-create user di DB saat login)
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    // 1. Sign In: Izinkan SEMUA akun Google untuk login
    async signIn({ user, account }) {
      if (account.provider === "google") {
        // Semua email Google diizinkan masuk sebagai USER
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
      }

      // Jika profil diupdate (misal setelah onboarding)
      if (trigger === "update" && session) {
        token.nim = session.nim;
        token.prodi = session.prodi;
      }

      return token;
    },

    // 3. Session Callback: Kirim data role, nim, prodi ke Frontend
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.nim = token.nim;
        session.user.prodi = token.prodi;
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
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Helper: Cek apakah email termasuk domain kampus
// Digunakan oleh API change-role untuk validasi upgrade ke ADMIN
export function isCampusEmail(email) {
  if (!email) return false;
  return CAMPUS_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}
