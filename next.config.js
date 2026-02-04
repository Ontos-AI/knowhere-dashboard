const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',

  // Include migration files and dependencies in standalone output
  outputFileTracingIncludes: {
    '/*': [
      // Include migration SQL files
      './drizzle/**/*.sql',
      './drizzle/meta/**/*',
      // Include migration script
      './scripts/migrate.js',
      // Include drizzle dependencies (pg should already be included via lib/db/index.ts)
      './node_modules/drizzle-orm/**',
      './node_modules/pg/**',
      './node_modules/pg-pool/**',
      './node_modules/pg-types/**',
      './node_modules/postgres-array/**',
      './node_modules/postgres-bytea/**',
      './node_modules/postgres-date/**',
      './node_modules/postgres-interval/**',
    ],
  },

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
