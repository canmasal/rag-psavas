import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [{ protocol: "https", hostname: "**" }],
  },
  experimental: {
    serverActions: { bodySizeLimit: "8mb" },
  },
  // Vercel önizleme modunda örnek veritabanını sunucu fonksiyonlarına dahil et
  outputFileTracingIncludes: {
    "/**/*": ["./prisma/demo.db"],
  },
};

export default nextConfig;
