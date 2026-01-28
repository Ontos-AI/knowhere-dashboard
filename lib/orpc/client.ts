import { createORPCClient } from '@orpc/client'
import { RPCLink } from '@orpc/client/fetch'
import type { RouterClient } from '@orpc/server'
import type { AppRouter } from '@/app/api/orpc/[...orpc]/route'
import { createTanstackQueryUtils } from '@orpc/tanstack-query'
import { env } from '@/lib/env'

// Create RPC link for HTTP communication
// Use window.location.origin in browser, fallback to NEXT_PUBLIC_APP_URL for SSR
const link = new RPCLink({
  url: `${typeof window !== 'undefined' ? window.location.origin : env.NEXT_PUBLIC_APP_URL}/api/orpc`,
  headers: async () => {
    if (typeof window !== 'undefined') {
      // In browser environment, get auth_token from localStorage and add to Authorization header
      const token = localStorage.getItem('auth_token')
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        }
      }
      return {}
    }

    const { headers } = await import('next/headers')
    return await headers()
  },
})

// Create oRPC client for type-safe API calls
// RouterClient converts the server router type to a client-compatible type
export const orpcClient = createORPCClient<RouterClient<AppRouter>>(link)

// Create TanStack Query utilities for oRPC
// This provides query options, mutation options, and other TanStack Query helpers with full type safety
export const orpcQuery = createTanstackQueryUtils<RouterClient<AppRouter>>(orpcClient)
