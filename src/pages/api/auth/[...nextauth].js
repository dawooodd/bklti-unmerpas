import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Daftar domain email yang diizinkan untuk login
const ALLOWED_DOMAINS = ["@unmerpas.ac.id"];

export const authOptions = {
  // Integrasi NextAuth dengan Prisma (Auto Sign Up via Google SSO)
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email dan password wajib diisi");
        }

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });

        if (!user || !user.password) {
          throw new Error("Email belum terdaftar atau menggunakan metode login SSO");
        }

        const isPasswordValid = await bcrypt.compare(credentials.password, user.password);

        if (!isPasswordValid) {
          throw new Error("Password salah");
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          nim: user.nim,
          prodi: user.prodi,
        };
      }
    }),
  ],

  callbacks: {
    // 1. Filter Login: Tolak email selain domain kampus
    async signIn({ user, account }) {
      if (account?.provider === "google") {
        const userEmail = user.email || "";
        const isAllowed = ALLOWED_DOMAINS.some((domain) =>
          userEmail.endsWith(domain)
        );

        if (!isAllowed) {
          console.warn(`[SSO] Blokir login dari email non-kampus: ${userEmail}`);
          return false; // Tolak login
        }
      }
      return true;
    },

    // 2. JWT Callback: Menyuntikkan data dari DB ke dalam Token
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.nim = user.nim;
        token.prodi = user.prodi;
        
        // Untuk pengguna Google SSO, data role/nim/prodi mungkin belum terisi di objek `user` awal
        // Kita fetch ulang dari DB untuk memastikan keakuratan data.
        if (!user.role) {
          try {
            const dbUser = await prisma.user.findUnique({
              where: { id: user.id },
              select: { role: true, nim: true, prodi: true },
            });
            if (dbUser) {
              token.role = dbUser.role;
              token.nim = dbUser.nim;
              token.prodi = dbUser.prodi;
            }
          } catch (error) {
            console.error("[NextAuth] Error querying user data for JWT:", error.message);
          }
        }
      }

      // Saat profil diupdate (misal setelah onboarding via useSession().update())
      if (trigger === "update" && session) {
        if (session.nim !== undefined) token.nim = session.nim;
        if (session.prodi !== undefined) token.prodi = session.prodi;
        if (session.role !== undefined) token.role = session.role;
      }

      return token;
    },

    // 3. Session Callback: Expose data dari JWT Token ke Frontend (useSession, getServerSession)
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id;
        session.user.role = token.role || "USER";
        session.user.nim = token.nim || null;
        session.user.prodi = token.prodi || null;
      }
      return session;
    },
  },

  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 hari
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  secret: process.env.NEXTAUTH_SECRET || "bklti-unmerpas-secret-key-development",
};

export default NextAuth(authOptions);
