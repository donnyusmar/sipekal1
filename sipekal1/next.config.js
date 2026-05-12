/** @type {import('next').NextConfig} */
const nextConfig = {
  // We use @netlify/plugin-nextjs so output: 'standalone' is not used
  reactStrictMode: true,
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;
