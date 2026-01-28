'use client'

import { useAppConfigContext } from '@/components/providers/ConfigProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { TimezoneProvider } from '@/contexts/TimezoneContext'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({ children }: { children: React.ReactNode }) {
  const config = useAppConfigContext()
  const content = (
    <NuqsAdapter>
      <QueryProvider>
        <AuthProvider>
          <TimezoneProvider>
            {children}
            <Toaster />
          </TimezoneProvider>
        </AuthProvider>
      </QueryProvider>
    </NuqsAdapter>
  )

  return content
}
