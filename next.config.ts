import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // @ts-ignore - allowedDevOrigins is a new experimental property
  },
};

export default nextConfig;
