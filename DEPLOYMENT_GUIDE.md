# 部署配置指南 (http://wengjunbin.com)

此清单适用于 Staging 和 Production 环境（假设域名相同）。

> ⚠️ **重要提示**：生产环境强烈建议启用 HTTPS。大多数 OAuth 提供商（如 Google）在非 Localhost 环境下可能拒绝 HTTP 回调，或者会有安全警告。如果您的生产环境启用了 HTTPS，请将下方的 `http://` 替换为 `https://`。

## 1. OAuth 回调地址 (Callback URLs)
请登录 Google Cloud Console 和 GitHub Developer Settings，将以下地址添加到允许列表。

### Google OAuth 配置
- **Authorized JavaScript Origins (已获授权的 JavaScript 来源):**
  ```
  http://wengjunbin.com
  ```
- **Authorized Redirect URIs (已获授权的重定向 URI):**
  ```
  http://wengjunbin.com/api/auth/callback/google
  ```

### GitHub OAuth 配置
- **Homepage URL:**
  ```
  http://wengjunbin.com
  ```
- **Authorization callback URL:**
  ```
  http://wengjunbin.com/api/auth/callback/github
  ```

---

## 2. 环境变量清单 (Environment Variables)
请将以下变量配置到您的部署平台（如 Vercel Project Settings, Docker Compose, k8s Secrets, 或 `.env.production`）。

```bash
# ==========================================
# 公开变量 (前端可见)
# ==========================================

# 您的后端 API 地址 (请替换为真实的生产环境后端地址)
NEXT_PUBLIC_API_URL=https://api.your-backend-domain.com/api

# 认证基础路径 (指向本应用的 /api/auth)
NEXT_PUBLIC_AUTH_BASE_URL=http://wengjunbin.com/api/auth

# ==========================================
# 私有变量 (仅服务端可见)
# ==========================================

# Better Auth 根地址 (通常与网站域名一致)
BETTER_AUTH_URL=http://wengjunbin.com

# 认证加密密钥 (必须修改！生产环境请生成一个新的高熵字符串)
# 生成命令: openssl rand -base64 32
BETTER_AUTH_SECRET=YOUR_PRODUCTION_SECRET_KEY_HERE

# GitHub OAuth 凭据 (如果是同一个 App，可复用；建议生产环境创建新的 App)
GITHUB_CLIENT_ID=Ov23liUkqqgQdDqkSvCg
GITHUB_CLIENT_SECRET=YOUR_GITHUB_CLIENT_SECRET

# Google OAuth 凭据
GOOGLE_CLIENT_ID=1080869602342-hqpgpi625th0nj3hv3lajsqir4iiosig.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=YOUR_GOOGLE_CLIENT_SECRET
```

---

## 3. 部署平台配置指南

### Vercel
1. 进入项目 Settings -> Environment Variables。
2. 逐条添加上述变量。
3. 重新部署 (Redeploy) 以生效。

### Docker / Docker Compose
在 `docker-compose.yml` 或运行时注入：
```yaml
services:
  web:
    environment:
      - NEXT_PUBLIC_AUTH_BASE_URL=http://wengjunbin.com/api/auth
      - BETTER_AUTH_URL=http://wengjunbin.com
      - BETTER_AUTH_SECRET=...
      # ... 其他变量
```

### Windows IIS / 传统服务器
1. 在系统环境变量中添加上述键值对。
2. 或者在项目根目录创建 `.env.production` 文件（注意不要提交到 Git）。
3. 运行 build 命令时确保能读取到这些变量。
