import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jrdwwbnjjqiadzdromfs.supabase.co',
        pathname: '/storage/v1/object/public/product_images/**',
      }
    ],
  },
};

export default nextConfig;




