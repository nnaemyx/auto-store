import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['admin.autostoreng.com', 'res.cloudinary.com'],
    
  },
  output: 'standalone',
};

export default nextConfig;
