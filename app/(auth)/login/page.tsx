'use client'

import { OAuthButtons } from '@/app/(auth)/_components/oauth-buttons'
import { useAppConfigContext } from '@providers/config-provider'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { useToast } from '@hooks/useToast'
import { authClient } from '@lib/betterAuthClient'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()
  const router = useRouter()
  const appConfig = useAppConfigContext()
  const t = useTranslations('Auth')

  // Magic Link 登录仅需要邮箱地址
  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t('emailInvalid')),
      }),
    [t]
  )

  type LoginForm = z.infer<typeof loginSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true)
    try {
      // 触发发送魔法链接至用户邮箱
      const { error } = await authClient.signIn.magicLink({
        email: data.email,
        callbackURL: '/usage',
        errorCallbackURL: '/login?error=magic',
        newUserCallbackURL: '/usage',
      })

      if (error) {
        throw new Error(error.message || t('magicLinkFailed'))
      }

      // 成功后提示用户查收邮箱
      toast.success(t('magicLinkSent'))
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('loginFailed')
      toast.error(t('loginFailed'), errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  const handleOAuthSuccess = () => {
    router.push('/usage')
  }

  const handleOAuthError = (error: string) => {
    toast.error(t('oauthFailed'), error)
  }

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t('login')}</CardTitle>
        <CardDescription className="text-center">{t('loginDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth登录 */}
        <OAuthButtons onSuccess={handleOAuthSuccess} onError={handleOAuthError} />

        {/* 邮箱 Magic Link 登录表单 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t('email')}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t('emailPlaceholder')}
              {...register('email')}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('sending') : t('sendMagicLink')}
          </Button>
        </form>

        {/* <div className="text-center text-sm">
          <span className="text-muted-foreground">还没有账户？</span>{' '}
          <Link href="/register" className="text-primary hover:underline">
            立即注册
          </Link>
        </div> */}
      </CardContent>
    </Card>
  )
}
