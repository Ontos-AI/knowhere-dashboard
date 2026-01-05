"use client"

import { useEffect, useState, useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { api, type User } from '@/lib/api'
import { authClient } from '@/lib/betterAuthClient'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { 
  User as UserIcon, 
  Shield, 
  Settings as SettingsIcon,
  Bell,
  Globe,
  Palette,
  Save
} from 'lucide-react'
import { formatDate } from '@/lib/format'
import { useTranslations, useLocale } from 'next-intl'
import { useTheme } from 'next-themes'
import { useRouter, usePathname } from '@/navigation'

import { useTimezone } from '@/contexts/TimezoneContext'

const TIMEZONES = [
  "UTC",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Seoul",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Europe/Rome",
  "Europe/Madrid",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
]

export default function SettingsPage() {
  const { user, refreshUser } = useAuth()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const t = useTranslations('Settings')
  const tTimezones = useTranslations('Timezones')
  const locale = useLocale()
  const { setTheme, theme } = useTheme()
  const router = useRouter()
  const pathname = usePathname()
  const { timezone, setTimezone } = useTimezone()

  const profileSchema = useMemo(() => z.object({
    username: z.string().min(2, t('usernameMinLength')),
    email: z.string().email(t('emailInvalid')),
    phone: z.string().optional(),
  }), [t])
  
  const passwordSchema = useMemo(() => z.object({
    currentPassword: z.string().min(6, t('passwordMinLength')),
    newPassword: z.string().min(8, t('newPasswordMinLength')),
    confirmPassword: z.string(),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: t('passwordMismatch'),
    path: ['confirmPassword'],
  }), [t])
  
  type ProfileForm = z.infer<typeof profileSchema>
  type PasswordForm = z.infer<typeof passwordSchema>

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      username: '',
      email: '',
    }
  })

  const passwordForm = useForm<PasswordForm>({
    resolver: zodResolver(passwordSchema),
  })

  // Initialize timezone from localStorage
  useEffect(() => {
    const storedTimezone = localStorage.getItem('timezone')
    if (storedTimezone) {
      setTimezone(storedTimezone)
    }
  }, [])

  // Sync user data to form when user loads
  useEffect(() => {
    if (user) {
      profileForm.reset({
        username: user.username || '',
        email: user.email || '',
      })
      setIsLoading(false)
    } else {
       // If we don't have user yet, we might be loading or not authenticated
       // But useAuth usually handles the initial loading state.
       // We can keep isLoading true if user is null and we expect one?
       // For now, let's rely on AuthContext's isLoading if needed, but here we just wait for user.
       if (!user) setIsLoading(false) // Stop loading if no user (maybe error state or just not loaded)
    }
  }, [user, profileForm])

  const handleUpdateProfile = async (data: ProfileForm) => {
    try {
      setIsSaving(true)
      
      // 1. 同步更新 Better Auth 的用户信息 (前端 Session)
      // 这是关键步骤：如果不更新 Session，AuthContext 会使用旧的 Session 信息(如旧邮箱)
      // 去尝试同步后端，导致后端找不到用户或重新注册旧用户，从而使修改失效。
      /* 
       * 暂时注释掉 Better Auth 更新，因为 /api/auth/user/update 报 404
       * 我们改为在后端更新成功后，通过 refreshUser 手动拉取后端最新数据
       */
      /*
      try {
        const updateData: any = {}
        if (data.username !== user?.username) {
           updateData.name = data.username
        }
        if (data.email !== user?.email) {
           updateData.email = data.email
        }
        
        if (Object.keys(updateData).length > 0) {
           // @ts-ignore
           await authClient.user.update(updateData)
        }
      } catch (authError) {
        console.warn('Failed to update Better Auth session:', authError)
        // 不中断流程，继续更新后端
      }
      */

      // 2. 更新后端数据库 (业务数据)
      // Use API client instead of authClient directly to avoid 404
      await api.updateUserProfile({
        username: data.username,
        // Only update email if changed
        ...(data.email !== user?.email ? { email: data.email } : {})
      })

      // 3. 刷新用户状态
      await refreshUser()
      toast.success(t('profileUpdated'))
      
      // If email changed, warn user about verification if necessary
      if (data.email !== user?.email) {
        toast.info(t('emailVerificationSent') || "Please verify your new email address")
      }

    } catch (error: any) {
      console.error('Failed to update profile:', error)
      toast.error(error.message || t('profileUpdateFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleUpdatePassword = async (data: PasswordForm) => {
    try {
      setIsSaving(true)
      
      // Use API client for password change as well
      await api.changePassword({
        current_password: data.currentPassword,
        new_password: data.newPassword
      })
      
      toast.success(t('passwordUpdated'))
      passwordForm.reset()
    } catch (error: any) {
      console.error('Failed to update password:', error)
      toast.error(error.message || t('passwordUpdateFailed'))
    } finally {
      setIsSaving(false)
    }
  }

  const handleTimezoneChange = (value: string) => {
    setTimezone(value)
    toast.success(t('timezoneUpdated') || "Timezone updated")
  }

  if (isLoading && !user) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题 */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t('profile')}</TabsTrigger>
          {/* <TabsTrigger value="security">{t('security')}</TabsTrigger> */}
          <TabsTrigger value="preferences">{t('preferences')}</TabsTrigger>
        </TabsList>

        {/* 个人资料标签页 */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                {t('profile')}
              </CardTitle>
              <CardDescription>
                {t('profileDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t('username')}</Label>
                    <Input
                      id="username"
                      {...profileForm.register('username')}
                      disabled={isSaving}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t('email')}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register('email')}
                      disabled={isSaving}
                    />
                    {profileForm.formState.errors.email && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.email.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? t('saving') : t('saveChanges')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 账户信息 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('accountInfo')}</CardTitle>
              <CardDescription>
                {t('accountInfoDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">{t('userId')}</Label>
                  <p className="font-mono text-sm">{user?.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('accountType')}</Label>
                  <p className="text-sm">{user?.user_type || t('standard')}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('registerTime')}</Label>
                  <p className="text-sm">{formatDate(user?.create_time || '', 'long', locale, timezone)}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t('accountStatus')}</Label>
                  <p className="text-sm">
                    {user?.is_active ? t('active') : t('disabled')}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* 安全设置标签页 */}
        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Shield className="mr-2 h-5 w-5" />
                {t('passwordSettings')}
              </CardTitle>
              <CardDescription>
                {t('passwordDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={passwordForm.handleSubmit(handleUpdatePassword)} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">{t('currentPassword')}</Label>
                  <Input
                    id="currentPassword"
                    type="password"
                    {...passwordForm.register('currentPassword')}
                    disabled={isSaving}
                  />
                  {passwordForm.formState.errors.currentPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.currentPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newPassword">{t('newPassword')}</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    {...passwordForm.register('newPassword')}
                    disabled={isSaving}
                  />
                  {passwordForm.formState.errors.newPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.newPassword.message}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">{t('confirmPassword')}</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...passwordForm.register('confirmPassword')}
                    disabled={isSaving}
                  />
                  {passwordForm.formState.errors.confirmPassword && (
                    <p className="text-sm text-destructive">
                      {passwordForm.formState.errors.confirmPassword.message}
                    </p>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? t('updating') : t('updatePassword')}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* 双因素认证 */}
          <Card>
            <CardHeader>
              <CardTitle>{t('twoFactor')}</CardTitle>
              <CardDescription>
                {t('twoFactorDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">{t('twoFactor')}</p>
                  <p className="text-sm text-muted-foreground">
                    {t('twoFactorApp')}
                  </p>
                </div>
                <Switch disabled />
              </div>
              <p className="text-xs text-muted-foreground mt-2">
                {t('comingSoon')}
              </p>
            </CardContent>
          </Card>
        </TabsContent>


        {/* 偏好设置标签页 */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                {t('interface')}
              </CardTitle>
              <CardDescription>
                {t('interfaceDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t('darkMode')}</Label>
                  <p className="text-sm text-muted-foreground">
                    {t('darkModeDesc')}
                  </p>
                </div>
                <Switch 
                  checked={theme === 'dark'}
                  onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{t('language')}</Label>
                <Select 
                  defaultValue={locale}
                  onValueChange={(val) => {
                    document.cookie = `NEXT_LOCALE=${val}; path=/; max-age=31536000; SameSite=Lax`
                    router.refresh()
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">{t('zhCN')}</SelectItem>
                    <SelectItem value="en">{t('enUS')}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{t('timezone')}</Label>
                <Select 
                  value={timezone}
                  onValueChange={handleTimezoneChange}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tTimezones(tz as any)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
