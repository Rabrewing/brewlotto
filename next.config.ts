const pwaPlugin = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.(?:gstatic|googleapis)\.com\/.*/i,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts',
        expiration: {
          maxEntries: 8,
          maxAgeSeconds: 60 * 60 * 24 * 365,
        },
      },
    },
    {
      urlPattern: /\/_next\/static\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'next-static-assets',
        expiration: {
          maxEntries: 64,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
    {
      urlPattern: /\/(?:icons|frontend)\/.*/i,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'app-static-images',
        expiration: {
          maxEntries: 32,
          maxAgeSeconds: 60 * 60 * 24 * 30,
        },
      },
    },
  ],
});
const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = withSentryConfig({
  ...nextConfig,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: pwaPlugin.webpack,
}, {
  silent: true,
  webpack: {
    treeshake: {
      removeDebugStatements: true,
    },
  },
});
