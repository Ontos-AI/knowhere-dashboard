# 前端应用正式环境部署指南 (Production Deployment Guide)

本指南详细说明了如何构建、部署和运行 Knowhere 前端应用（Next.js）。

## 1. 环境要求 (Prerequisites)

在开始部署之前，请确保服务器满足以下要求：

- **Node.js**: v20.0.0 或更高版本 (建议使用 LTS 版本)
- **包管理器**: pnpm (本项目锁定使用 pnpm)
- **操作系统**: Linux (推荐 Ubuntu/Debian/CentOS), macOS, 或 Windows Server

## 2. 环境变量配置 (Environment Variables)

在生产环境中，你需要创建一个 `.env.production` 文件（或直接在部署平台的后台配置环境变量）。

以下是必须配置的环境变量：

### 核心配置
```bash
# 生产环境标识
NODE_ENV=production

# 后端 API 地址 (如果不配置，默认为 http://218.17.187.47:5005/api)
NEXT_PUBLIC_API_URL=https://api.your-domain.com/api
```

### 认证配置 (Better Auth)
本项目使用 Better Auth 进行用户认证。

```bash
# 应用的基础 URL (生产环境必须配置为实际域名)
BETTER_AUTH_URL=https://www.your-domain.com

# Auth API 的路径 (通常不需要修改)
NEXT_PUBLIC_AUTH_BASE_URL=/api/auth

# Auth 密钥 (必须修改！生成一个随机长字符串)
# 可以使用 `openssl rand -base64 32` 生成
BETTER_AUTH_SECRET=your-secure-random-secret-key

# OAuth 提供商配置 (如果启用了对应登录方式)
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### 邮件服务 (Resend)
用于发送 Magic Link 登录邮件。

```bash
RESEND_API_KEY=$KNOWHERE_API_KEY
# 发件人邮箱 (必须是在 Resend 验证过的域名)
RESEND_FROM=onboarding@your-domain.com
```

### 数据统计 (PostHog)
用于用户行为分析。

```bash
NEXT_PUBLIC_POSTHOG_KEY=phc_your_public_key
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

## 3. 构建与部署 (Build & Deployment)

本项目配置了 `output: 'standalone'` (在 `next.config.js` 中)，这意味着构建后会生成一个独立的 Node.js 应用，非常适合 Docker 或 VPS 部署。

### 方式一：标准 VPS 部署 (使用 PM2)

1.  **安装依赖**:
    ```bash
    pnpm install --frozen-lockfile
    ```

2.  **构建项目**:
    ```bash
    pnpm build
    ```
    构建完成后，你会看到 `.next` 目录。

3.  **准备运行文件**:
    Next.js 的 Standalone 模式会自动将必要的依赖打包到 `.next/standalone` 目录中。
    但是，你需要**手动复制** `public` 目录和 `.next/static` 目录到 standalone 目录中，以确保静态资源正常加载。

    ```bash
    # 假设你在项目根目录
    cp -r public .next/standalone/public
    cp -r .next/static .next/standalone/.next/static
    ```

4.  **启动服务**:
    进入 standalone 目录并启动 `server.js`。

    ```bash
    cd .next/standalone
    node server.js
    ```
    默认端口为 3000。你可以通过 `PORT` 环境变量指定端口：
    ```bash
    PORT=8080 node server.js
    ```

5.  **使用 PM2 守护进程 (推荐)**:
    在项目根目录下创建一个 `ecosystem.config.js` 或直接运行：
    ```bash
    cd .next/standalone
    pm2 start server.js --name "knowhere-frontend" --env PORT=3000
    ```

### 方式二：Docker 部署 (推荐)

使用 Docker 可以确保环境一致性。

1.  **创建 Dockerfile**:
    (如果项目根目录没有 Dockerfile，请参考以下内容创建)

    ```dockerfile
    FROM node:18-alpine AS base

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
    RUN npm install -g pnpm && pnpm build

    # Production image, copy all the files and run next
    FROM base AS runner
    WORKDIR /app
    ENV NODE_ENV production
    ENV PORT 3000

    RUN addgroup --system --gid 1001 nodejs
    RUN adduser --system --uid 1001 nextjs

    COPY --from=builder /app/public ./public
    
    # Automatically leverage output traces to reduce image size
    # https://nextjs.org/docs/advanced-features/output-file-tracing
    COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
    COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

    USER nextjs

    EXPOSE 3000
    CMD ["node", "server.js"]
    ```

2.  **构建镜像**:
    ```bash
    docker build -t knowhere-frontend .
    ```

3.  **运行容器**:
    ```bash
    docker run -d -p 3000:3000 \
      --env-file .env.production \
      --name knowhere-frontend \
      knowhere-frontend
    ```

## 4. 常见问题与注意事项 (Troubleshooting)

### 1. 静态资源 404
如果在 Standalone 模式下发现图片或样式丢失 (404)，请检查是否正确复制了 `.next/static` 文件夹到 `.next/standalone/.next/static`。
**目录结构应该是这样的：**
```
.next/standalone/
├── .next/
│   └── static/  <-- 必须存在
├── public/      <-- 必须存在
├── server.js
└── package.json
```

### 2. Authentication Error (Better Auth)
如果登录失败或重定向错误，请检查：
- `BETTER_AUTH_URL` 是否与当前浏览器访问的域名完全一致（包括 http/https 协议）。
- `trustedOrigins` 配置：在 `lib/auth.ts` 中，我们配置了 `trustedOrigins`。确保生产环境的域名被包含在内，或者通过环境变量正确传递。

### 3. API 连接失败
检查 `NEXT_PUBLIC_API_URL` 是否正确指向后端服务。注意如果是在浏览器端请求（Client Component），该 URL 必须是公网可访问的地址。

### 4. 跨域问题 (CORS)
如果前端和后端部署在不同域名，确保后端配置了允许前端域名的 CORS 策略。
本项目的 `next.config.js` 配置了 `/api` 的代理，如果使用 Next.js 的 API 路由作为中转，可以避免部分 CORS 问题。

## 5. 常用命令速查

| 命令 | 说明 |
|------|------|
| `pnpm dev` | 启动开发服务器 |
| `pnpm build` | 构建生产版本 |
| `pnpm start` | 启动生产服务器 (非 Standalone 模式) |
| `pnpm lint` | 代码检查 |
