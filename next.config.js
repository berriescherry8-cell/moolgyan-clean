/** @type {import('next').NextConfig} */
const withPWA = require('next-pwa')({
  dest: 'dist',
  register: false, // Disable registration
  skipWaiting: false, // Disable skip waiting
  disable: true, // Completely disable PWA temporarily
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
  trailingSlash: true,

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
  
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Content-Security-Policy',
            value: "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' 'unsafe-hashes' chrome-extension:; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self' https://lqymwrhfirszrakuevqm.supabase.co wss://lqymwrhfirszrakuevqm.supabase.co https://www.googleapis.com https://i.ytimg.com; frame-src 'self' https://www.youtube.com https://youtube.com https://youtu.be; object-src 'none'; base-uri 'self'; form-action 'self';"
          }
        ]
      }
    ];
  },
};

module.exports = withPWA(nextConfig);
