FROM node:22-alpine AS base

# 第一阶段：安装所有依赖
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# 第二阶段：构建应用
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

# 构建应用
RUN npm install -g pnpm && pnpm build

# 第三阶段：生成最终镜像
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 重要：先清理 /app 目录
RUN rm -rf /app/* /app/.* 2>/dev/null || true

# 从 builder 阶段复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/. ./

# 从 builder 阶段复制 static 目录
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 从 builder 阶段复制迁移相关文件
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# 复制 drizzle.config.ts（如果存在）
RUN if [ -f /app/drizzle.config.ts ]; then \
      echo "✅ Copying drizzle.config.ts"; \
    else \
      echo "⚠️ drizzle.config.ts not found, skipping"; \
    fi
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./drizzle.config.ts 2>/dev/null || true

# 现在复制 package.json 和 lock 文件
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./ 2>/dev/null || true

# 安装生产依赖（只安装 dependencies，不安装 devDependencies）
RUN npm install -g pnpm && \
    echo "Installing production dependencies..." && \
    pnpm install --prod --frozen-lockfile && \
    echo "✅ Production dependencies installed"

USER nextjs

EXPOSE 3000

# 运行迁移然后启动应用
CMD ["sh", "-c", "node scripts/migrate.js && node server.js"]
