const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  async rewrites() {
    return [
      // 保留 Better Auth 路由在本应用内处理
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      // 保留 oRPC 路由在本应用内处理
      {
        source: '/api/orpc/:path*',
        destination: '/api/orpc/:path*',
      },
      // 其余 /api/* 代理到外部后端 API
      {
        source: '/api/:path*',
        destination: process.env.NEXT_PUBLIC_API_URL
          ? `${process.env.NEXT_PUBLIC_API_URL}/:path*`
          : 'http://218.17.187.47:5005/api/:path*',
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig);
