'use client'

import { useEffect } from 'react'
import { useRouter } from '@/navigation'
import { useAuth } from '@/hooks/useAuth'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { LandingPage } from '@/components/common/LandingPage'

export default function Home() {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()
  const t = useTranslations('Common')

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push('/usage')
    }
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>{t('loading')}</p>
        </div>
      </div>
    )
  }

  // 如果已登录，useEffect 会处理跳转
  if (isAuthenticated) return null

  return <LandingPage />
}
