import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req) {
  
  const token = await getToken({
    req,
    secret: process.env.NEXTAUTH_SECRET || "bklti-unmerpas-secret-key-development",
  });
  const { pathname } = req.nextUrl;

  if (!token) {
    const url = new URL("/auth/login", req.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  const role = token.role || "USER";

  if (role === "USER" || role === "ADMIN") {
    const iat = token.iat; 
    const now = Math.floor(Date.now() / 1000);
    const thirtyDaysInSeconds = 30 * 24 * 60 * 60;

    if (iat && now - iat > thirtyDaysInSeconds) {
      console.log(`[Middleware] Sesi expired (30 hari) untuk user: ${token.email}`);
      const url = new URL("/auth/login", req.url);
      url.searchParams.set("error", "SessionExpired");
      return NextResponse.redirect(url);
    }
  }

  if (pathname.startsWith("/admin")) {
    if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (pathname.startsWith("/super-admin")) {
    if (role !== "SUPER_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }

  if (role === "USER") {
    const isMissingProfile = !token.nim || !token.prodi;

    if (isMissingProfile && pathname !== "/onboarding") {
      return NextResponse.redirect(new URL("/onboarding", req.url));
    }

    if (!isMissingProfile && pathname === "/onboarding") {
      return NextResponse.redirect(new URL("/student/dashboard", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/super-admin/:path*",
    "/student/:path*",
    "/onboarding",
  ],
};
