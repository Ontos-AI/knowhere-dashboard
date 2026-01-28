'use client'

import { QueryProvider } from './query-provider'
import { Toaster } from '@components/ui/sonner'
import { TimezoneSync } from './timezone-sync'
import { NuqsAdapter } from 'nuqs/adapters/next/app'

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <NuqsAdapter>
      <QueryProvider>
        <TimezoneSync />
        {children}
        <Toaster />
      </QueryProvider>
    </NuqsAdapter>
  )

  return content
}
