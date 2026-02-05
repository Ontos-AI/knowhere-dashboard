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

# 安装 pnpm（用于运行迁移命令）
RUN npm install -g pnpm

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

# 重要：先清理工作目录，避免文件冲突
RUN rm -rf /app/* 2>/dev/null || true

# 从构建阶段复制 standalone 输出
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/. ./

# 复制 static 目录
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 package.json 和 lock 文件
COPY --from=builder --chown=nextjs:nodejs /app/package.json .
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml .

# 复制迁移相关文件
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

# 切换到非 root 用户
USER nextjs

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 启动命令：使用 JSON 格式
CMD ["sh", "-c", "pnpm install --prod --frozen-lockfile && pnpm db:migrate && node server.js"]
