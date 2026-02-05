FROM node:22-alpine

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY --chown=nextjs:nodejs package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm

# 切换到非 root 用户
USER nextjs

# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY --chown=nextjs:nodejs . .

# 构建应用
RUN pnpm build

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 启动命令
CMD ["sh", "-c", "pnpm db:migrate && pnpm start"]
