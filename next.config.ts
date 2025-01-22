import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Remove experimental.appDir; not needed in Next 13.4+ or Next 15
  // e.g. experimental: {
  //   appDir: true, // <- Delete or comment this out
  // },

  // Other config options remain:
  reactStrictMode: true,
};

export default nextConfig;

