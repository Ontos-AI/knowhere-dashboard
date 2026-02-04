"use client"

import { AuthProvider } from '@/contexts/AuthContext'
import { TimezoneProvider } from '@/contexts/TimezoneContext'
import { CreditsProvider } from '@/contexts/CreditsContext'
import { Toaster } from '@/components/ui/sonner'
import { useAppConfigContext } from '@/components/providers/ConfigProvider'

export function Providers({ children }: { children: React.ReactNode }) {
  const config = useAppConfigContext()
  const content = (
    <AuthProvider>
      <TimezoneProvider>
        <CreditsProvider>
          {children}
          <Toaster />
        </CreditsProvider>
      </TimezoneProvider>
    </AuthProvider>
  )
  
  return content
}
