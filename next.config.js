const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const externalApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

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
      // Keep Better Auth routes handled by this app.
      {
        source: '/api/auth/:path*',
        destination: '/api/auth/:path*',
      },
      // Keep oRPC routes handled by this app.
      {
        source: '/api/orpc/:path*',
        destination: '/api/orpc/:path*',
      },
      // Proxy remaining API routes to the configured backend API.
      {
        source: '/api/:path*',
        destination: `${externalApiBaseUrl}/:path*`,
      },
    ]
  },
}

module.exports = withNextIntl(nextConfig);
