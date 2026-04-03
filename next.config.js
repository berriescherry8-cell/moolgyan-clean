/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },

  images: {
    remotePatterns: [
      // GitHub RAW content (main data source)
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/berriescherry8-cell/mool-gyan-assets/**',
      },
      // Other domains for external content
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        pathname: '/**',
      },
    ],
    unoptimized: true, // Required for static export
  },

  // Static export configuration for Cloudflare Pages
  output: 'export',
  distDir: 'dist',
  trailingSlash: true,
};

module.exports = nextConfig;