/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      { source: "/icons/jyotishgpt-icon-192-v2.png", destination: "/android-chrome-192x192.png" },
      { source: "/icons/jyotishgpt-icon-512-v2.png", destination: "/android-chrome-512x512.png" },
      { source: "/icons/jyotishgpt-apple-touch-v2.png", destination: "/apple-touch-icon.png" },
      { source: "/icons/favicon-32-v2.png", destination: "/favicon-32x32.png" },
      { source: "/icons/favicon-16-v2.png", destination: "/favicon-16x16.png" }
    ];
  }
};

module.exports = nextConfig;
