# 构建阶段
FROM node:22-alpine AS builder

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm 和依赖
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 生产阶段
FROM node:22-alpine

WORKDIR /app

# 安装 pnpm
RUN npm install -g pnpm

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# 从构建阶段复制 standalone 输出到当前目录
# 注意：使用 . 而不是 ./，确保正确复制
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/. .

# 复制 static 目录
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 package.json 和 lock 文件
COPY --from=builder --chown=nextjs:nodejs /app/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml .

# 复制迁移相关文件到特定目录，避免冲突
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle

# 检查并复制 drizzle.config.ts（如果存在）
RUN if [ -f /app/drizzle.config.ts ]; then \
    echo "Copying drizzle.config.ts"; \
    else echo "drizzle.config.ts not found, skipping"; \
    fi
# 这里我们使用一个更安全的方式
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts /tmp/drizzle.config.ts 2>/dev/null || true
RUN if [ -f /tmp/drizzle.config.ts ]; then mv /tmp/drizzle.config.ts .; fi

# 切换到非 root 用户
USER nextjs

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 启动命令：使用 JSON 格式避免警告
CMD ["sh", "-c", "pnpm install --prod --frozen-lockfile && pnpm db:migrate && node server.js"]
