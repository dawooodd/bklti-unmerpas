import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
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
      allowDangerousEmailAccountLinking: true,
    }),
    CredentialsProvider({
      name: "Manual Login",
      credentials: {
        identifier: { label: "NIM atau Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifier || !credentials?.password) {
          throw new Error("NIM/Email dan Password wajib diisi.");
        }

        const identifier = credentials.identifier.trim();
        const password = credentials.password;

        // Cari berdasarkan NIM atau Email
        const user = await prisma.user.findFirst({
          where: {
            OR: [
              { email: { equals: identifier, mode: 'insensitive' } },
              { nim: { equals: identifier, mode: 'insensitive' } },
            ],
          },
        });

        if (!user) {
          throw new Error("Akun tidak ditemukan. Silakan daftar terlebih dahulu.");
        }

        // Cek apakah akun sedang terkunci
        if (user.lockoutUntil && new Date() < user.lockoutUntil) {
          const secondsLeft = Math.ceil((user.lockoutUntil - new Date()) / 1000);
          throw new Error(`Akun terkunci sementara. Coba lagi dalam ${secondsLeft} detik.`);
        }

        // Komparasi Password
        const bcrypt = require("bcryptjs");
        const isPasswordValid = await bcrypt.compare(password, user.password || "");

        if (!isPasswordValid) {
          // Logika Brute Force
          const newFailedLogins = user.failedLogins + 1;
          let newLockoutUntil = null;

          if (newFailedLogins >= 5) {
            const lockoutSeconds = 60 * (newFailedLogins - 4);
            newLockoutUntil = new Date(Date.now() + lockoutSeconds * 1000);
          }

          await prisma.user.update({
            where: { id: user.id },
            data: {
              failedLogins: newFailedLogins,
              lockoutUntil: newLockoutUntil,
            },
          });

          if (newLockoutUntil) {
            throw new Error(`Password salah berulang kali. Akun ditangguhkan ${60 * (newFailedLogins - 4)} detik.`);
          }
          throw new Error("Password salah.");
        }

        // Jika berhasil masuk, reset failedLogins
        if (user.failedLogins > 0 || user.lockoutUntil) {
          await prisma.user.update({
            where: { id: user.id },
            data: { failedLogins: 0, lockoutUntil: null },
          });
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // 1. Sign In: Logika Ekosistem Tertutup (Gatekeeper)
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        // Cek apakah email sudah terdaftar di database kita
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        // JIKA TIDAK ADA: Tendang ke register
        if (!existingUser) {
          console.warn(`[SSO] Blokir login dari email belum terdaftar: ${user.email}`);
          return '/register?error=not_registered';
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
    signIn: '/login',
    error: '/login', // Redirect ke login jika error
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

// Helper: Cek apakah email termasuk domain kampus
export function isCampusEmail(email) {
  if (!email) return false;
  return CAMPUS_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}
