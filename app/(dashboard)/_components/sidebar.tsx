'use client'

import { LanguageSwitcher } from '@components/language-switcher'
import { Button } from '@components/ui/button'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@components/ui/hover-card'
import { ScrollArea } from '@components/ui/scroll-area'
import { Separator } from '@components/ui/separator'
import { Sheet, SheetContent, SheetTrigger } from '@components/ui/sheet'
import { useAuth } from '@hooks/useAuth'
import { useToast } from '@hooks/useToast'
import { cn } from '@lib/utils'
import { Link, usePathname } from '@/navigation'
import {
  BookOpen,
  Clock,
  CreditCard,
  FileText,
  Key,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  Table,
  X,
} from 'lucide-react'
import { useTranslations } from 'next-intl'
import { useState } from 'react'

type SidebarProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function Sidebar({ open, onOpenChange }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const { success, error, warning, info, loading } = useToast()
  const t = useTranslations('Common')

  const navigation = [
    { name: t('usage'), href: '/usage', icon: LayoutDashboard },
    { name: t('apiKeys'), href: '/api-keys', icon: Key },
    { name: t('settings'), href: '/settings', icon: Settings },
  ]

  const handleLogout = () => {
    logout()
    success(t('logout'))
  }

  const SidebarContent = () => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-between px-6">
        <Link href="/usage" className="flex items-center space-x-2">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">K</span>
          </div>
          <span className="text-xl font-bold">Knowhere</span>
        </Link>
        {/* <LanguageSwitcher /> */}
      </div>

      {/* 导航菜单 */}
      <ScrollArea className="flex-1 px-3 py-4">
        <nav className="space-y-1">
          {navigation.map((item) => {
            const isActive = pathname === item.href
            const IconComponent = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                )}
                onClick={() => onOpenChange(false)}
              >
                <IconComponent className="mr-3 h-5 w-5" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </ScrollArea>

      {/* 用户菜单 */}
      <div className="p-4 border-t">
        <HoverCard openDelay={0} closeDelay={100}>
          <HoverCardTrigger asChild>
            <Button
              variant="ghost"
              className="w-full justify-start px-2 h-auto py-2 hover:bg-muted"
            >
              <div className="flex items-center gap-x-3 text-left w-full">
                <div
                  className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden shrink-0 bg-cover bg-center"
                  style={{
                    backgroundImage: user?.avatar_url ? `url(${user.avatar_url})` : undefined,
                  }}
                >
                  {!user?.avatar_url && (
                    <span className="text-xs font-medium">
                      {user?.username?.charAt(0).toUpperCase() || 'U'}
                    </span>
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-sm font-medium truncate">{user?.username || 'User'}</span>
                  <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
                </div>
              </div>
            </Button>
          </HoverCardTrigger>
          <HoverCardContent align="center" side="top" sideOffset={10} className="w-56 p-1">
            <div className="flex items-center justify-start gap-2 p-2">
              <div className="flex flex-col space-y-1 leading-none">
                <p className="font-medium">{user?.username}</p>
                <p className="w-[200px] truncate text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
            <Separator className="my-1" />
            <Link href="/settings" onClick={() => onOpenChange(false)}>
              <div className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground">
                <Settings className="mr-2 h-4 w-4" />
                <span>{t('settings')}</span>
              </div>
            </Link>
            <Separator className="my-1" />
            <div
              className="relative flex cursor-pointer select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
              onClick={handleLogout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{t('logout')}</span>
            </div>
          </HoverCardContent>
        </HoverCard>
      </div>
    </div>
  )

  return (
    <>
      {/* 移动端侧边栏 */}
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="left" className="p-0 w-64">
          <SidebarContent />
        </SheetContent>
      </Sheet>

      {/* 桌面端侧边栏 */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto border-r bg-background px-6 pb-4">
          <SidebarContent />
        </div>
      </div>
    </>
  )
}
