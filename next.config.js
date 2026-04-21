/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async redirects() {
    return [
      { source: '/pt',        destination: '/',          permanent: false },
      { source: '/en',        destination: '/',          permanent: false },
      { source: '/pt/:path*', destination: '/:path*',    permanent: false },
      { source: '/en/:path*', destination: '/:path*',    permanent: false },
    ];
  },
};

module.exports = nextConfig;