FROM node:22-alpine

# 创建非 root 用户
RUN addgroup -g 1001 -S nodejs && adduser -S nextjs -u 1001 -G nodejs

WORKDIR /app

FROM node:22-alpine

# 安装 CA 证书（包含 AWS RDS 证书）
RUN apk update && apk add --no-cache ca-certificates && rm -rf /var/cache/apk/*

# 更新 CA 证书
RUN update-ca-certificates

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000

EXPOSE 3000

# 启动命令
CMD ["sh", "-c", "pnpm db:generate && pnpm db:migrate && pnpm start"]
