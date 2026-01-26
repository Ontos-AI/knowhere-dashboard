'use client'

import { useAppConfigContext } from '@/components/providers/ConfigProvider'
import { QueryProvider } from '@/components/providers/QueryProvider'
import { Toaster } from '@/components/ui/sonner'
import { AuthProvider } from '@/contexts/AuthContext'
import { CreditsProvider } from '@/contexts/CreditsContext'
import { TimezoneProvider } from '@/contexts/TimezoneContext'

export function Providers({ children }: { children: React.ReactNode }) {
  const config = useAppConfigContext()
  const content = (
    <QueryProvider>
      <AuthProvider>
        <TimezoneProvider>
          <CreditsProvider>
            {children}
            <Toaster />
          </CreditsProvider>
        </TimezoneProvider>
      </AuthProvider>
    </QueryProvider>
  )

  return content
}
