# 前端应用正式环境部署指南 (Production Deployment Guide)

本指南旨在指导你将 Next.js 应用（基于 Monorepo 结构）从本地开发环境部署到生产服务器。

---

## 1. 准备工作 (Prerequisites)

在开始构建之前，请确保已经准备好以下环境和配置。

### 1.1 系统要求
- **本地环境**: Node.js v18+
- **权限要求 (Windows 用户必看)**: 
  > **警告**: Windows 下执行 `pnpm build` **必须使用管理员权限** (Right-click -> Run as Administrator) 打开终端。
  > 否则构建过程会因无法创建符号链接而失败（报错 `EPERM: operation not permitted`），导致最终生成的包缺失依赖（报错 `Cannot find module 'next'`）。

  > **💡 彻底解决痛点方案**:
  > 如果你不想每次都用管理员权限，也不想遇到 `node_modules` 被破坏的问题，请在**项目根目录**（即包含 `pnpm-workspace.yaml` 的地方）创建一个 `.npmrc` 文件，填入以下内容：
  > ```ini
  > node-linker=hoisted
  > ```
  > 保存后，删除所有 `node_modules` 并重新 `pnpm install`。这会让 pnpm 像 npm 一样工作，彻底避免 Windows 符号链接问题。

### 1.2 环境变量配置
请确保生产环境（如 `.env.production` 或服务器环境变量）已包含以下核心配置：

| 变量名 | 必填 | 说明 | 示例值 |
| :--- | :--- | :--- | :--- |
| `NEXT_PUBLIC_API_URL` | 是 | 后端 API 地址 | `https://api.example.com/api` |
| `NEXT_PUBLIC_AUTH_BASE_URL` | 是 | 认证基础路径 | `https://example.com/api/auth` |
| `BETTER_AUTH_URL` | 是 | 前端域名 | `https://example.com` |
| `BETTER_AUTH_SECRET` | 是 | 认证加密密钥 | (长随机字符串) |
| `RESEND_API_KEY` | 否 | 邮件服务密钥 | `re_123...` |

*(OAuth 登录的 Client ID/Secret 请参考各平台文档)*

---

## 2. 构建与打包 (Build & Package)

本步骤在**本地开发机**执行。

### 2.1 执行构建
在项目根目录或 `apps/web` 目录下运行：

```bash
# 确保已安装依赖
pnpm install

# 执行构建 (Windows 请务必使用管理员权限，除非你配置了 .npmrc)
pnpm build
```

> **检查点**: 请留意控制台输出。如果出现 `ELIFECYCLE Command failed` 或 `EPERM: operation not permitted`，说明构建失败，**不能**继续下一步。请切换到管理员终端重试。

### 2.2 制作部署包 (关键步骤)
由于本项目启用了 `output: 'standalone'` 且位于 Monorepo 中，构建产物结构较为特殊。请严格按照以下步骤操作。

Next.js 自动生成的文件位于 `.next/standalone`，但它**不包含**静态资源。你需要手动合并。

**操作命令 (在 `apps/web` 目录下执行):**

```bash
# 1. 复制 public 文件夹 (仅当存在 public 目录时执行)
# 注意：当前项目似乎没有 public 目录，如果没有请跳过此步
if [ -d "public" ]; then
  cp -r public .next/standalone/apps/web/public
fi
# (PowerShell 用户如果遇到 public 不存在可直接跳过)

# 2. 复制 .next/static 文件夹 (包含 JS/CSS，必须执行)
# 目标路径必须包含 apps/web/.next 层级
cp -r .next/static .next/standalone/apps/web/.next/static
```

完成上述步骤后，整个 `.next/standalone` 文件夹就是你的**完整部署包**。

---

## 3. 服务器部署 (Server Deployment)

本步骤在**生产服务器**执行。

### 3.1 上传文件
将本地处理好的 `.next/standalone` 文件夹压缩并上传到服务器。

### 3.2 验证目录结构
解压后，服务器上的文件结构应如下所示（请仔细核对 `apps/web` 层级）：

```text
/your-deployment-folder
├── node_modules/          # (应包含 next, react 等依赖)
├── package.json
├── apps/
│   └── web/
│       ├── package.json
│       ├── server.js      # ★ 启动入口
│       ├── public/        # (如果项目有则存在)
│       └── .next/
│           └── static/    # (必须存在)
```

### 3.3 启动服务
进入部署目录根目录，执行启动命令：

```bash
# 直接启动
node apps/web/server.js

# 或者使用 PM2 (推荐)
pm2 start apps/web/server.js --name "my-web-app"
```

*注意: 默认端口为 3000。如需更改，请在启动前设置环境变量 `PORT=8080`。*

---

## 4. 常见问题排查 (Troubleshooting)

### Q1: 启动时报错 `Error: Cannot find module 'next'`
**原因**: 本地构建时没有使用管理员权限，导致 `standalone` 目录下的 `node_modules` 符号链接创建失败。
**解决**:
1.  **推荐**: 删除 `.next` 目录，使用**管理员权限**打开终端，重新运行 `pnpm build`。
2.  **补救**: 如果无法重新构建，可以尝试进入部署包的根目录（即 `server.js` 的上两级，包含 `package.json` 的地方），运行 `npm install` 来手动下载依赖。

### Q2: 频繁遇到 `EPERM` 或 `node_modules` 被删除/损坏？
**原因**: Windows 文件系统对符号链接支持不佳，而 pnpm 和 Next.js Standalone 默认都大量使用符号链接。
**彻底解决方法**:
1. 在项目根目录（`knowhere-api-main/`）创建文件 `.npmrc`。
2. 写入内容：`node-linker=hoisted`。
3. 删除整个项目的 `node_modules` 文件夹。
4. 重新运行 `pnpm install`。
这将迫使 pnpm 使用扁平化安装（类似 npm），彻底消除符号链接兼容性问题。

### Q3: 页面样式丢失 (404 on .css/.js)
**原因**: 步骤 2.2 中没有正确复制 `.next/static` 文件夹。
**解决**: 重新检查文件夹结构，确保 `.next/standalone/apps/web/.next/static` 存在。
