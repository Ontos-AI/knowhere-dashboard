'use client'

import { useToast } from '@hooks/useToast'
import { authClient } from '@lib/betterAuthClient'
import { useTranslations } from 'next-intl'
import { useRouter, useSearchParams } from 'next/navigation'
import { Suspense, useEffect } from 'react'

function AppleCallbackContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const toast = useToast()
  const session = authClient.useSession()
  const t = useTranslations('Auth')

  useEffect(() => {
    if (session.isPending) return
    if (session.data?.user) {
      toast.success(t('appleLoginSuccess'))
      router.push('/usage')
    } else {
      // 如果没有 session，检查是否有 error 参数
      const error = searchParams.get('error')
      if (error) {
        toast.error(t('appleLoginFailed'))
        router.push('/login?error=oauth')
      }
    }
  }, [session.isPending, session.data, toast, router, t, searchParams])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p>{t('processingAppleLogin')}</p>
      </div>
    </div>
  )
}

export default function AppleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
        </div>
      }
    >
      <AppleCallbackContent />
    </Suspense>
  )
}
