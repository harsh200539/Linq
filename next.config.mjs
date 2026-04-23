/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: true,
  devIndicators: {
    buildActivity: false,
    appIsrStatus: false,
  },
  reactStrictMode: true,
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'harsh17042005.pythonanywhere.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'harsh17042005.pythonanywhere.com',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        pathname: '/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
