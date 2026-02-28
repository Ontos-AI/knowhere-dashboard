FROM node:22-alpine

# 安装必要的工具和 CA 证书
RUN apk update && apk add --no-cache \
    ca-certificates \
    postgresql-client \
    wget \
    openssl \
    && rm -rf /var/cache/apk/* \
    && update-ca-certificates

WORKDIR /app

# 复制 package.json 和 lock 文件
COPY package.json pnpm-lock.yaml ./

# 安装 pnpm
RUN npm install -g pnpm && pnpm i --frozen-lockfile


# 安装依赖
RUN pnpm install --frozen-lockfile

# 复制源代码
COPY . .

# 构建应用
RUN pnpm build

# 环境变量
ENV NODE_ENV=production
ENV PORT=3000
# 告诉 Node.js 使用系统 CA 证书
ENV NODE_EXTRA_CA_CERTS=/etc/ssl/certs/ca-certificates.crt

EXPOSE 3000

# 启动命令
CMD ["sh", "-c", "pnpm db:generate && pnpm db:migrate && pnpm start"]
