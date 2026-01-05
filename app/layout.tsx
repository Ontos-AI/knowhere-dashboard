import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import PostHogProvider from '@/components/providers/PostHogProvider'
import { Providers } from '@/components/providers/Providers'
import { ConfigProvider } from '@/components/providers/ConfigProvider'
import { getDefaultConfig } from '@/lib/config'
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Knowhere - AI 知识库管理系统',
  description: '基于 AI 的知识库管理和智能问答系统',
}

import { cookies } from 'next/headers';

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies();
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en';

  // 在服务端读取环境变量（运行时配置，不带NEXT_PUBLIC_前缀）
  const appConfig = getDefaultConfig()
  
  // 获取翻译消息
  const messages = await getMessages();

  return (
    <html lang={locale} suppressHydrationWarning>
      <body className={inter.className}>
        <NextIntlClientProvider messages={messages} locale={locale}>
          <ConfigProvider config={appConfig}>
            <ThemeProvider
              attribute="class"
              defaultTheme="system"
              enableSystem
              disableTransitionOnChange
            >
              <PostHogProvider>
                <Providers>
                  <div className="min-h-screen bg-background">
                    {children}
                  </div>
                </Providers>
              </PostHogProvider>
            </ThemeProvider>
          </ConfigProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
