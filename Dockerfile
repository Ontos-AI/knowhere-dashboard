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
RUN SKIP_ENV_VALIDATION=1 pnpm build

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

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/scripts/start-with-migrations.js ./scripts/start-with-migrations.js

COPY --from=deps --chown=nextjs:nodejs /app/node_modules /migration/node_modules
COPY --from=builder --chown=nextjs:nodejs /app/package.json /migration/package.json
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml /migration/pnpm-lock.yaml
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts /migration/drizzle.config.ts
COPY --from=builder --chown=nextjs:nodejs /app/tsconfig.json /migration/tsconfig.json
COPY --from=builder --chown=nextjs:nodejs /app/drizzle /migration/drizzle
COPY --from=builder --chown=nextjs:nodejs /app/lib/db /migration/lib/db

USER nextjs

EXPOSE 3000

CMD ["node", "scripts/start-with-migrations.js"]
