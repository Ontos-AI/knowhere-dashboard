"use client"

import { createAuthClient } from "better-auth/react"
import { magicLinkClient } from "better-auth/client/plugins"

// 统一初始化 Better Auth 客户端，启用 Magic Link 插件
export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_AUTH_BASE_URL || '/api/auth',
  plugins: [
    magicLinkClient(),
  ],
})
