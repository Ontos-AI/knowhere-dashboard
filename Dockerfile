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
    if [ -f .env.production ]; then \
      echo "✅ .env.production file exists"; \
      echo "File size: $(wc -l < .env.production) lines"; \
    else \
      echo "❌ ERROR: .env.production file not found!"; \
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

# 从 deps 阶段复制 node_modules（包含所有依赖）
COPY --from=deps --chown=nextjs:nodejs /app/node_modules ./node_modules

# 复制 package.json 用于参考
COPY --chown=nextjs:nodejs package.json ./

# 复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制迁移相关文件
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

USER nextjs

EXPOSE 3000

# 运行迁移然后启动应用
CMD ["sh", "-c", "node scripts/migrate.js && node server.js"]
