FROM node:22-alpine AS base

# 第一阶段：安装所有依赖并构建
FROM base AS builder
WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml* ./

# 安装 pnpm 和所有依赖
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 第二阶段：生成最终镜像
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# 安装 pnpm（用于启动时运行迁移）
RUN npm install -g pnpm

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# 从 builder 阶段复制构建产物
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone/. ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# 复制 package.json 和 lock 文件（用于安装依赖）
COPY --from=builder --chown=nextjs:nodejs /app/package.json ./
COPY --from=builder --chown=nextjs:nodejs /app/pnpm-lock.yaml ./ 2>/dev/null || true

# 复制迁移相关文件
COPY --from=builder --chown=nextjs:nodejs /app/drizzle ./drizzle
COPY --from=builder --chown=nextjs:nodejs /app/drizzle.config.ts ./drizzle.config.ts 2>/dev/null || true
COPY --from=builder --chown=nextjs:nodejs /app/scripts ./scripts

USER nextjs

EXPOSE 3000

# 直接在 CMD 中执行所有步骤
CMD ["sh", "-c", "pnpm install --prod --frozen-lockfile && pnpm db:migrate && node server.js"]
