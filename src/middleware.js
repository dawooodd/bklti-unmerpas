import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  // Ambil token JWT dari request
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "bklti-unmerpas-secret-key-development",
  });
  const { pathname } = req.nextUrl;

  // ═══════════════════════════════════════════════
  // 1. TIDAK ADA TOKEN → Redirect ke Login
  // ═══════════════════════════════════════════════
  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  // ═══════════════════════════════════════════════
  // 2. DYNAMIC SESSION MANAGEMENT (Batas Waktu 30 Hari)
  // ═══════════════════════════════════════════════
  const role = token.role || "USER";

  // Jika role adalah USER atau ADMIN, evaluasi batas waktu 30 hari
  if (role === "USER" || role === "ADMIN") {
    const iat = token.iat; // Issued At dalam detik (epoch)
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    if (iat && now - iat > thirtyDaysInSeconds) {
      console.log(`[Middleware] Sesi expired (30 hari) untuk user: ${token.email}`);
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("error", "SessionExpired");
      return NextResponse.redirect(url);
    }
  }
  // Catatan: Jika SUPER_ADMIN, pengecekan 30 hari di-bypass (sesi permanen).

  // ═══════════════════════════════════════════════
  // 3. PROTEKSI RUTE BERBASIS ROLE
  // ═══════════════════════════════════════════════

  // /admin/* → Hanya ADMIN dan SUPER_ADMIN
  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // /super-admin/* → Hanya SUPER_ADMIN
  if (pathname.startsWith("/super-admin")) {
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  // ═══════════════════════════════════════════════
  // 4. PROTEKSI ONBOARDING (Mencegah Infinite Loop)
  // ═══════════════════════════════════════════════
  if (role === "USER") {
    const isMissingProfile = !token.nim || !token.prodi;

    // Profil belum lengkap + bukan di /onboarding → Paksa ke onboarding
    if (isMissingProfile && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    // Profil sudah lengkap + masih di /onboarding → Arahkan ke dashboard
    if (!isMissingProfile && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

// ═══════════════════════════════════════════════
// Matcher: Rute mana saja yang dijalankan middleware ini
// ═══════════════════════════════════════════════
export const config = {
  matcher: [
    "/admin/:path*",
    "/super-admin/:path*",
    "/student/:path*",
    "/onboarding",
  ],
};
