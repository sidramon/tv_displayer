// CONFIGURATION SECTION
/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://backend:5000/api/:path*',
      },
      {
        source: '/uploads/:path*',
        destination: 'http://nginx:80/uploads/:path*',
      }
    ];
  },
};

module.exports = nextConfig;