import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    // Disable Turbopack to avoid compatibility issues
  }
};

export default nextConfig;
