/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  experimental: {
    esmExternals: false,
  },
  // إضافة إعدادات للنشر
  output: "standalone",
  trailingSlash: false,
  // إصلاح مشاكل الـ hydration
  reactStrictMode: false,
}

module.exports = nextConfig
