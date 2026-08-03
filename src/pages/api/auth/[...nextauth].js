import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";


// Daftar domain email yang diizinkan untuk login
const ALLOWED_DOMAINS = ["@unmerpas.ac.id"];

export const authOptions = {
  // Integrasi NextAuth dengan Prisma
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],

  callbacks: {
    // 1. Filter Login: Tolak email selain domain kampus
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        const userEmail = user.email || "";
        const isAllowed = ALLOWED_DOMAINS.some(domain => userEmail.endsWith(domain));

        if (!isAllowed) {
          console.warn(`[SSO] Blokir login dari email non-kampus: ${userEmail}`);
          return false; // Tolak login
        }
      }
      return true;
    },

    // 2. JWT Callback: Menyuntikkan data dari DB ke dalam Token
    // Callback ini dipanggil saat token JWT dibuat atau diupdate
    async jwt({ token, user, trigger, session }) {
      // Jika `user` ada, berarti ini saat login pertama kali
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nim = user.nim;
        token.prodi = user.prodi;
      }

      // Jika profil diupdate (misal setelah onboarding)
      if (trigger === "update" && session) {
        token.nim = session.nim;
        token.prodi = session.prodi;
      }

      return token;
    },

    // 3. Session Callback: Menyuntikkan data dari Token ke Frontend
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
    maxAge: 36500 * 24 * 60 * 60, // 100 tahun (Batas default, dievaluasi juga di middleware)
  },

  pages: {
    signIn: "/auth/login",
    error: "/auth/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "bklti-unmerpas-secret-key-development",
};

export default NextAuth(authOptions);
