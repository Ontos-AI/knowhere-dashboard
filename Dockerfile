FROM node:22-alpine

# 安装必要的工具
RUN apk update && apk add --no-cache ca-certificates wget && rm -rf /var/cache/apk/*

# 下载 AWS RDS 根证书（全球证书）
RUN wget -O /usr/local/share/ca-certificates/rds-ca-2019-root.crt \
    https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem

# RUN wget -O /usr/local/share/ca-certificates/rds-ca-2019-root.crt \
#     https://truststore.pki.rds.amazonaws.com/us-east-1/us-east-1-bundle.pem

# 更新 CA 证书
RUN update-ca-certificates

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

EXPOSE 3000

# 启动命令
CMD ["sh", "-c", "pnpm db:generate && pnpm db:migrate && pnpm start"]
