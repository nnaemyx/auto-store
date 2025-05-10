import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['admin.autostoreng.com', 'res.cloudinary.com', 'admin.autostores.ng'],
    
  },
  output: 'standalone',
};

export default nextConfig;
