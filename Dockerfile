FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 验证 .env.production 文件存在
RUN echo "=== Checking for .env.production file ===" && \
    ls -la .env.production || echo "WARNING: .env.production not found in listing" && \
    if [ -f .env.production ]; then \
      echo "✅ .env.production file exists"; \
      echo "File size: $(wc -l < .env.production) lines"; \
      echo "RESEND_API_KEY in file: $(grep -q RESEND_API_KEY .env.production && echo '✅ Found' || echo '❌ Not found')"; \
      echo "First few lines:"; \
      head -5 .env.production; \
    else \
      echo "❌ ERROR: .env.production file not found!"; \
      echo "Current directory contents:"; \
      ls -la; \
      exit 1; \
    fi

RUN npm install -g pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
