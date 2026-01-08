"use client"

import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/hooks/useToast'
import { api, type APIKey } from '@/lib/api'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Switch } from '@/components/ui/switch'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { EmptyState } from '@/components/common/EmptyState'
import { 
  Plus, 
  Search, 
  Copy, 
  Trash2, 
  Key
} from 'lucide-react'
import { formatDate, copyToClipboard } from '@/lib/format'
import { useTranslations, useLocale } from 'next-intl'
import { useTimezone } from '@/contexts/TimezoneContext'

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'

export default function ApiKeysPage() {
  const { user } = useAuth()
  const toast = useToast()
  const t = useTranslations('ApiKeys')
  const locale = useLocale()
  const { timezone } = useTimezone()
  const [apiKeys, setApiKeys] = useState<APIKey[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isCreating, setIsCreating] = useState(false)
  const [newApiKey, setNewApiKey] = useState({
    name: '',
    enabled_modules: [] as string[],
    expires_at: '',
  })
  const [createdKey, setCreatedKey] = useState<string | null>(null)
  const [showCreatedKey, setShowCreatedKey] = useState(false)
  const [expirationDuration, setExpirationDuration] = useState('never')
  // Delete confirmation state
  const [isDeleteAlertOpen, setIsDeleteAlertOpen] = useState(false)
  const [keyToDelete, setKeyToDelete] = useState<string | null>(null)
  const [isRevoking, setIsRevoking] = useState(false)
  // Toggle confirmation state
  const [isToggleAlertOpen, setIsToggleAlertOpen] = useState(false)
  const [keyToToggle, setKeyToToggle] = useState<string | null>(null)
  const [isToggling, setIsToggling] = useState(false)

  useEffect(() => {
    if (expirationDuration === 'never') {
      // 设置一个无限大的日期，例如 9999-12-31
      setNewApiKey(prev => ({ ...prev, expires_at: '9999-12-31T23:59:59' }))
      // setNewApiKey(prev => ({ ...prev, expires_at: '9999-12-31T23:59:59Z' }))
      return
    }

    const date = new Date()
    date.setMilliseconds(0)
    switch (expirationDuration) {
      case '1d':
        date.setDate(date.getDate() + 1)
        break
      case '7d':
        date.setDate(date.getDate() + 7)
        break
      case '30d':
        date.setMonth(date.getMonth() + 1)
        break
      case '365d':
        date.setFullYear(date.getFullYear() + 1)
        break
    }
    // toISOString() 已经是 UTC 时间，去除毫秒部分和 'Z'
    setNewApiKey(prev => ({ ...prev, expires_at: date.toISOString().split('.')[0] }))
    // setNewApiKey(prev => ({ ...prev, expires_at: date.toISOString().split('.')[0]+'Z' }))
  }, [expirationDuration])

  useEffect(() => {
    const controller = new AbortController()
    loadApiKeys(controller.signal)
    return () => {
        controller.abort()
    }
  }, [])

  const loadApiKeys = async (signal?: AbortSignal) => {
    try {
      setIsLoading(true)
      const response = await api.listApiKeys({ signal })
      setApiKeys(response.api_keys || [])
    } catch (error: any) {
      if (error.name === 'AbortError') return
      console.error('Failed to load API keys:', error)
      toast.error(t('loadFailed'))
    } finally {
        if (!signal?.aborted) {
            setIsLoading(false)
        }
    }
  }

  const handleCreateApiKey = async () => {
    try {
      setIsCreating(true)
      const createdKeyData = await api.createApiKey(newApiKey)
      
      if (createdKeyData?.api_key) {
        setCreatedKey(createdKeyData.api_key)
        setShowCreatedKey(true)
        toast.success(t('createSuccess'))
        await loadApiKeys()
        setIsCreateDialogOpen(false)
        setNewApiKey({ name: '', enabled_modules: [], expires_at: '' })
        setExpirationDuration('never')
      }
    } catch (error) {
      console.error('Failed to create API key:', error)
      toast.error(t('createFailed'))
    } finally {
      setIsCreating(false)
    }
  }

  const handleCopyKey = async (key: string) => {
    const success = await copyToClipboard(key)
    if (success) {
      toast.success(t('copySuccess'))
    } else {
      toast.error(t('copyFailed'))
    }
  }


  const confirmRevokeKey = (keyId: string) => {
    setKeyToDelete(keyId)
    setIsDeleteAlertOpen(true)
  }

  const handleRevokeKey = async () => {
    if (!keyToDelete || isRevoking) return

    try {
      setIsRevoking(true)
      await api.revokeApiKey(keyToDelete)
      toast.success(t('revokeSuccess'))
      await loadApiKeys()
    } catch (error) {
      console.error('Failed to revoke API key:', error)
      toast.error(t('revokeFailed'))
    } finally {
      setIsRevoking(false)
      setIsDeleteAlertOpen(false)
      setKeyToDelete(null)
    }
  }

  const handleToggleKey = async (keyId: string) => {
    // Check if key is currently active
    const key = apiKeys.find(k => k.id === keyId)
    if (key?.is_active) {
      // If active, show confirmation dialog
      setKeyToToggle(keyId)
      setIsToggleAlertOpen(true)
      return
    }

    // If not active (enabling), proceed directly
    await performToggle(keyId)
  }

  const performToggle = async (keyId: string) => {
    try {
      setIsToggling(true)
      await api.toggleApiKey(keyId)
      toast.success(t('toggleSuccess'))
      await loadApiKeys()
    } catch (error) {
      console.error('Failed to toggle API key:', error)
      toast.error(t('toggleFailed'))
    } finally {
      setIsToggling(false)
      setIsToggleAlertOpen(false)
      setKeyToToggle(null)
    }
  }

  const filteredApiKeys = apiKeys.filter(key =>
    key.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    (key.api_key && key.api_key.toLowerCase().includes(searchTerm.toLowerCase()))
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* 页面标题和操作 */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground">
            {t('subtitle')}
          </p>
        </div>
        <div className="mt-4 sm:mt-0">
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {t('createKey')}
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>{t('createDialogTitle')}</DialogTitle>
                <DialogDescription>
                  {t('createDialogDesc')}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('name')}</Label>
                  <Input
                    id="name"
                    placeholder={t('namePlaceholder')}
                    value={newApiKey.name}
                    onChange={(e) => setNewApiKey({ ...newApiKey, name: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="expires_at">{t('expiration')}</Label>
                  <Select
                    value={expirationDuration}
                    onValueChange={setExpirationDuration}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={t('selectExpiration')} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">{t('exp1d')}</SelectItem>
                      <SelectItem value="7d">{t('exp7d')}</SelectItem>
                      <SelectItem value="30d">{t('exp30d')}</SelectItem>
                      <SelectItem value="365d">{t('exp365d')}</SelectItem>
                      <SelectItem value="never">{t('expNever')}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                  >
                    {t('cancel')}
                  </Button>
                  <Button
                    onClick={handleCreateApiKey}
                    disabled={isCreating || !newApiKey.name}
                  >
                    {isCreating ? t('creating') : t('create')}
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* 搜索 */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder={t('searchPlaceholder')}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* API Keys列表 */}
      {filteredApiKeys.length === 0 ? (
        <EmptyState
          icon={<Key className="h-12 w-12 text-muted-foreground" />}
          title={searchTerm ? t('noKeysFound') : t('noKeys')}
          description={searchTerm ? t('noKeysFoundDesc') : t('noKeysDesc')}
          action={!searchTerm ? {
            label: t('createKey'),
            onClick: () => setIsCreateDialogOpen(true)
          } : undefined}
        />
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{t('title')} ({filteredApiKeys.length})</CardTitle>
            <CardDescription>
              {t('subtitle')}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('name')}</TableHead>
                  <TableHead>{t('apiKey')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('created')}</TableHead>
                  <TableHead>{t('lastUsed')}</TableHead>
                  <TableHead>{t('expiration')}</TableHead>
                  <TableHead className="text-right">{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApiKeys.map((key) => (
                  <TableRow key={key.id}>
                    <TableCell className="font-medium">{key.name}</TableCell>
                    <TableCell>
                      <code className="text-sm bg-muted px-2 py-1 rounded">
                        {key.api_key}
                      </code>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={key.is_active}
                          onCheckedChange={() => handleToggleKey(key.id)}
                        />
                        <Badge variant={key.is_active ? 'default' : 'secondary'}>
                          {key.is_active ? t('active') : t('disabled')}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell>{formatDate(key.created_at, 'short', locale, timezone)}</TableCell>
                    <TableCell>
                      {key.last_used_at ? formatDate(key.last_used_at, 'relative', locale, timezone) : t('neverUsed')}
                    </TableCell>
                    <TableCell>
                      {key.expires_at && new Date(key.expires_at).getFullYear() < 9999 ? formatDate(key.expires_at, 'long', locale, timezone) : t('neverExpires')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => confirmRevokeKey(key.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* 删除确认对话框 */}
      <AlertDialog open={isDeleteAlertOpen} onOpenChange={setIsDeleteAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('deleteConfirmTitle')}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('deleteConfirmDesc')}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isRevoking}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                handleRevokeKey()
              }}
              disabled={isRevoking}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isRevoking ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {t('delete')}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 禁用确认对话框 */}
      <AlertDialog open={isToggleAlertOpen} onOpenChange={setIsToggleAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t('toggleConfirmTitle') || '确认禁用 API Key？'}</AlertDialogTitle>
            <AlertDialogDescription>
              {t('toggleConfirmDesc') || '禁用后，使用此 Key 的应用将无法访问 API。您随时可以再次启用它。'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isToggling}>{t('cancel')}</AlertDialogCancel>
            <AlertDialogAction 
              onClick={(e) => {
                e.preventDefault()
                if (keyToToggle) performToggle(keyToToggle)
              }}
              disabled={isToggling}
            >
              {isToggling ? <LoadingSpinner className="mr-2 h-4 w-4" /> : null}
              {t('confirmDisable') || '确认禁用'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* 创建成功的对话框 */}
      <Dialog open={showCreatedKey} onOpenChange={setShowCreatedKey}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t('createSuccess')}</DialogTitle>
            <DialogDescription>
              {t('copyAndSave')}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{t('yourApiKey')}</Label>
              <div className="flex items-center space-x-2">
                <Textarea
                  value={createdKey || ''}
                  readOnly
                  className="font-mono text-sm"
                  rows={3}
                />
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => createdKey && handleCopyKey(createdKey)}
                >
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <div className="bg-yellow-50 dark:bg-yellow-900/20 p-3 rounded-md">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                {t('securityWarning')}
              </p>
            </div>
            <div className="flex justify-end">
              <Button onClick={() => setShowCreatedKey(false)}>
                {t('iHaveSaved')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
