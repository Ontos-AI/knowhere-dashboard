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
ARG NEXT_PUBLIC_API_URL
ARG AUTH_COOKIE_PREFIX=better-auth
ARG NEXT_PUBLIC_AUTH_BASE_URL
ARG NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS
ARG NEXT_PUBLIC_APP_URL
ARG NEXT_PUBLIC_POSTHOG_KEY
ARG NEXT_PUBLIC_POSTHOG_HOST
RUN test -n "${NEXT_PUBLIC_API_URL}" \
  && test -n "${NEXT_PUBLIC_AUTH_BASE_URL}" \
  && test -n "${NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS}" \
  && test -n "${NEXT_PUBLIC_APP_URL}" \
  && BETTER_AUTH_SECRET=build-validation-only-auth-secret-32-chars \
  AUTH_COOKIE_PREFIX="${AUTH_COOKIE_PREFIX:-better-auth}" \
  BETTER_AUTH_URL=http://localhost:3000 \
  NEXT_PUBLIC_API_URL="${NEXT_PUBLIC_API_URL}" \
  NEXT_PUBLIC_AUTH_BASE_URL="${NEXT_PUBLIC_AUTH_BASE_URL}" \
  NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS="${NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS}" \
  NEXT_PUBLIC_APP_URL="${NEXT_PUBLIC_APP_URL}" \
  NEXT_PUBLIC_POSTHOG_KEY="${NEXT_PUBLIC_POSTHOG_KEY}" \
  NEXT_PUBLIC_POSTHOG_HOST="${NEXT_PUBLIC_POSTHOG_HOST}" \
  BILLING_ENABLED=false \
  RESEND_API_KEY=re_build_validation_placeholder \
  SKIP_ENV_VALIDATION=1 \
  pnpm build

FROM base AS runner

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

COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/next.config.js ./next.config.js
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json ./tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/i18n ./i18n
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.newsletter.config.ts ./drizzle.newsletter.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/drizzle-newsletter ./drizzle-newsletter
COPY --from=builder --chown=nextjs:nodejs /app/lib/db ./lib/db

USER nextjs

EXPOSE 3000

CMD ["sh", "-c", "pnpm db:migrate && pnpm newsletter-db:migrate && exec pnpm start"]
