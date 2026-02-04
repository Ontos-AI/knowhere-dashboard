import { getDefaultConfig } from '@/lib/config'
import { AuthLayoutClient } from '@/components/auth/AuthLayoutClient'
import { ConfigProvider } from '@/components/providers/ConfigProvider'

// 强制动态渲染，确保每次请求时读取最新的环境变量
export const dynamic = 'force-dynamic'

/**
 * 服务端 Layout 组件
 * 在服务端读取环境变量，然后通过 Context 传递给客户端组件
 */
export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 在服务端读取环境变量（服务端可以访问 process.env）
  const appConfig = getDefaultConfig()

  return (
    <ConfigProvider config={appConfig}>
      <AuthLayoutClient>{children}</AuthLayoutClient>
    </ConfigProvider>
  )
}
