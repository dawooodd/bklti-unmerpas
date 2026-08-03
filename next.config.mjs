/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  // Nonaktifkan ESLint saat build di Vercel
  // agar warning minor tidak menggagalkan deployment.
  eslint: {
    ignoreDuringBuilds: true,
  },

  // Whitelist domain untuk Next.js Image Optimization
  // (foto profil Google dari NextAuth SSO)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com",
      },
      {
        protocol: "https",
        hostname: "i.pravatar.cc",
      },
    ],
  },
};

export default nextConfig;
