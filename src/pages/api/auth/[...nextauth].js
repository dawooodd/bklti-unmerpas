import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

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

        if (user.lockoutUntil && new Date() < user.lockoutUntil) {
          const secondsLeft = Math.ceil((user.lockoutUntil - new Date()) / 1000);
          throw new Error(`Akun terkunci sementara. Coba lagi dalam ${secondsLeft} detik.`);
        }

        const bcrypt = require("bcryptjs");
        const isPasswordValid = await bcrypt.compare(password, user.password || "");

        if (!isPasswordValid) {
          
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
    
    async signIn({ user, account, profile }) {
      if (account.provider === "google") {
        
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email },
        });

        if (!existingUser) {
          console.warn(`[SSO] Blokir login dari email belum terdaftar: ${user.email}`);
          return '/register?error=not_registered';
        }

        console.log(`[SSO] Login diterima: ${user.email}`);
        return true;
      }
      return true;
    },

    async jwt({ token, user, trigger, session }) {
      
      if (user) {
        token.id = user.id;
        token.role = user.role || "USER";
        token.nim = user.nim || null;
        token.prodi = user.prodi || null;
        
        const dbUser = await prisma.user.findUnique({ where: { email: token.email } });
        token.adminRequestStatus = dbUser?.adminRequestStatus || "NONE";
      }

      if (trigger === "update" && session) {
        token.nim = session.nim ?? token.nim;
        token.prodi = session.prodi ?? token.prodi;
        token.name = session.name ?? token.name;
        token.adminRequestStatus = session.adminRequestStatus ?? token.adminRequestStatus;
      }

      return token;
    },

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
    maxAge: 30 * 24 * 60 * 60, 
  },

  pages: {
    signIn: '/login',
    error: '/login', 
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);

export function isCampusEmail(email) {
  if (!email) return false;
  return CAMPUS_DOMAINS.some((domain) => email.toLowerCase().endsWith(domain));
}
