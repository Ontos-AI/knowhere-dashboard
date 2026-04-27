FROM node:22-alpine AS base

ENV NEXT_TELEMETRY_DISABLED=1

WORKDIR /app

RUN apk add --no-cache ca-certificates \
  && update-ca-certificates \
  && corepack enable

FROM base AS deps

COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN BETTER_AUTH_SECRET=public-build-placeholder-secret-32-chars \
  BETTER_AUTH_URL=http://localhost:3000 \
  DATABASE_URL=postgres://postgres:postgres@localhost:5432/knowhere_dashboard \
  NEXT_PUBLIC_API_URL=http://localhost:5005/api \
  NEXT_PUBLIC_APP_URL=http://localhost:3000 \
  NEXT_PUBLIC_AUTH_BASE_URL=/api/auth \
  RESEND_API_KEY=public-build-placeholder \
  RESEND_FROM=onboarding@example.com \
  SKIP_ENV_VALIDATION=1 \
  pnpm build

FROM node:22-alpine AS runner

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

WORKDIR /app

RUN apk add --no-cache ca-certificates postgresql-client \
  && update-ca-certificates \
  && addgroup --system --gid 1001 nodejs \
  && adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts/migrate.js ./scripts/migrate.js

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
