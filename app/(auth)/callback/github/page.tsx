"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useToast } from '@/hooks/useToast'
import { authClient } from '@/lib/betterAuthClient'
import { useTranslations } from 'next-intl'

export default function GitHubCallbackPage() {
  const router = useRouter()
  const toast = useToast()
  const session = authClient.useSession()
  const t = useTranslations('Auth')

  useEffect(() => {
    if (session.isPending) return
    if (session.data?.user) {
      toast.success(t('githubLoginSuccess'))
      router.push('/usage')
    } else {
      toast.error(t('githubLoginFailed'))
      router.push('/login?error=oauth')
    }
  }, [session.isPending, session.data, toast, router, t])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
        <p>{t('processingGithubLogin')}</p>
      </div>
    </div>
  )
}
