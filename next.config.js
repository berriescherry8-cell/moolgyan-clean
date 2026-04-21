/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'dist',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
<<<<<<< HEAD
});

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
=======
  buildExcludes: [/middleware-manifest\.json$/],
});

const nextConfig = {
  poweredByHeader: false,
  generateEtags: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  productionBrowserSourceMaps: false,
  output: 'export',

  // YouTube iframe CSP - use middleware for static export
  // async headers() { ... },

  images: {
    remotePatterns: [
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        pathname: '/berriescherry8-cell/mool-gyan-assets/**',
      },
<<<<<<< HEAD
      // Other domains for external content
=======
>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
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
<<<<<<< HEAD
    unoptimized: true, // Required for static export
  },

  // Static export configuration for Cloudflare Pages
  output: 'export',
=======
    unoptimized: true,
  },

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
  distDir: 'dist',
  trailingSlash: true,
};

module.exports = withPWA(nextConfig);
<<<<<<< HEAD
=======

>>>>>>> 3597762b9e5db8060f8269f3940bef17efa0d470
