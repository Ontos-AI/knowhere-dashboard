const createNextIntlPlugin = require('next-intl/plugin');

const withNextIntl = createNextIntlPlugin('./i18n/request.ts');
const externalApiBaseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5005/api';

/** @type {import('next').NextConfig} */
const nextConfig = {
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
