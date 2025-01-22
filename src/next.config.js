/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  webpack: (config, { isServer }) => {
    // Prevent canvas from being bundled on the client
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false
      }
    }

    // Add canvas to externals on server
    if (isServer) {
      config.externals = [
        ...(config.externals || []),
        'canvas'
      ]
    }

    // Configure konva alias
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      konva: 'konva/lib/konva.js'
    }

    return config
  },

  // Retain existing image domains config
  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '']
  }
}

module.exports = nextConfig
