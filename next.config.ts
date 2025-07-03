import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['admin.autostoreng.com', 'res.cloudinary.com', 'admin.autostores.ng'],
    unoptimized: true,
  },
  output: 'standalone',
};

export default nextConfig;
