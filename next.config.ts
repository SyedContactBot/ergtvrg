import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'img1.bhcxy.com' },
      { protocol: 'https', hostname: 'img1.fodcyy.com' },
      { protocol: 'https', hostname: 'img1.fhxod.com' },
      { protocol: 'https', hostname: '**.bhcxy.com' },
      { protocol: 'https', hostname: '**.fodcyy.com' },
      { protocol: 'https', hostname: '**.fhxod.com' },
      { protocol: 'https', hostname: '**.hbzws.com' },
      { protocol: 'https', hostname: '**.hbayy.com' },
      { protocol: 'https', hostname: '**.kxzow.com' },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

export default nextConfig;
