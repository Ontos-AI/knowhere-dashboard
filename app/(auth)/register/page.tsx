'use client'

import { OAuthButtons } from '@/app/(auth)/_components/oauth-buttons'
import { Button } from '@components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@components/ui/card'
import { Input } from '@components/ui/input'
import { Label } from '@components/ui/label'
import { authClient } from '@lib/betterAuthClient'
import { useToast } from '@hooks/useToast'
import { getPasswordStrength } from '@utils/format'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [password, setPassword] = useState('')
  const toast = useToast()
  const router = useRouter()
  const t = useTranslations('Auth')

  const registerSchema = useMemo(
    () =>
      z
        .object({
          username: z.string().min(2, t('usernameMinLength')),
          email: z.string().email(t('emailInvalid')),
          password: z.string().min(8, t('passwordMinLength')),
          confirmPassword: z.string(),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t('passwordMismatch'),
          path: ['confirmPassword'],
        }),
    [t]
  )

  type RegisterForm = z.infer<typeof registerSchema>

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  })

  const watchedPassword = watch('password', '')
  const passwordStrength = getPasswordStrength(watchedPassword)

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true)
    try {
      // Use Better Auth directly for registration
      const { error } = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.username,
        callbackURL: '/usage',
      })

      if (error) {
        throw new Error(error.message || t('registerFailed'))
      }

      toast.success(t('registerSuccess'))
      router.push('/usage')
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t('registerFailed')
      toast.error(t('registerFailed'), errorMessage)
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
        <CardTitle className="text-2xl text-center">{t('register')}</CardTitle>
        <CardDescription className="text-center">{t('registerDesc')}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth登录 */}
        <OAuthButtons onSuccess={handleOAuthSuccess} onError={handleOAuthError} />

        {/* 注册表单 */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t('username')}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t('usernamePlaceholder')}
              {...register('username')}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

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

          <div className="space-y-2">
            <Label htmlFor="password">{t('password')}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t('passwordPlaceholder')}
              {...register('password')}
              disabled={isLoading}
              onChange={(e) => {
                setPassword(e.target.value)
                register('password').onChange(e)
              }}
            />
            {password && (
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <div className="flex-1 bg-muted rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        passwordStrength.score <= 2
                          ? 'bg-red-500'
                          : passwordStrength.score <= 4
                            ? 'bg-yellow-500'
                            : 'bg-green-500'
                      }`}
                      style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                    />
                  </div>
                  <span className={`text-xs ${passwordStrength.color}`}>
                    {passwordStrength.label}
                  </span>
                </div>
              </div>
            )}
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t('confirmPasswordPlaceholder')}
              {...register('confirmPassword')}
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t('registering') : t('register')}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t('haveAccount')}</span>{' '}
          <Link href="/login" className="text-primary hover:underline">
            {t('loginNow')}
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}
