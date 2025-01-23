/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  
  transpilePackages: ['react-konva', 'konva'],
  
  webpack: (config, { isServer }) => {
    // Your existing webpack config remains the same
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        canvas: false
      }
    }

    if (isServer) {
      config.externals = [
        ...config.externals,
        {
          canvas: 'commonjs canvas',
          konva: 'commonjs konva'
        }
      ]
    }

    config.module = {
      ...config.module,
      rules: [
        ...config.module.rules,
        {
          test: /\.node$/,
          use: 'node-loader',
          exclude: /node_modules/,
        }
      ]
    }

    return config
  },

  images: {
    domains: [process.env.NEXT_PUBLIC_SUPABASE_URL?.replace('https://', '') || '']
  }
}

module.exports = nextConfig