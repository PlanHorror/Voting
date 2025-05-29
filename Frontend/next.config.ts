import type { NextConfig } from "next";

const nextConfig: NextConfig = {
allowedDevOrigins: ['*','54.252.173.108'],
   eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },  /* config options here */
};

export default nextConfig;
