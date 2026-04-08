// Simple Next.js config without PWA for development
// PWA can be re-enabled once core functionality is working

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingRoot: __dirname,
};

module.exports = nextConfig;