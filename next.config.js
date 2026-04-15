/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'dist',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
  buildExcludes: [/middleware-manifest\\.json$/],
});

const nextConfig = {
  poweredByHeader: false,
  generateEtags: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,

  // YouTube iframe CSP - use middleware for static export
  // async headers() { ... },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/berriescherry8-cell/mool-gyan-assets/**',
      },
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
    unoptimized: true,
  },

  distDir: 'dist',
  trailingSlash: true,
  output: 'export',
  turbopack: {},
};

module.exports = withPWA(nextConfig);

