'use client'

// 暂时禁用PostHog以解决构建问题
// import { useEffect } from 'react'
// import { usePathname } from 'next/navigation'
// import { initPostHogClient, trackPageView } from '@/lib/posthog'

interface PostHogProviderProps {
  children: React.ReactNode
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  // 暂时直接返回children，不进行PostHog追踪
  return <>{children}</>
  
  // const pathname = usePathname()

  // useEffect(() => {
  //   // 初始化 PostHog
  //   initPostHogClient()
  // }, [])

  // useEffect(() => {
  //   // 追踪页面浏览
  //   trackPageView(pathname)
  // }, [pathname])

  // return <>{children}</>
}
