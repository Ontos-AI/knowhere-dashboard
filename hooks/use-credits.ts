import { orpcQuery } from '@lib/orpc/client'
import { useAuth } from './useAuth'
import { useQuery } from '@tanstack/react-query'
import type { CreditsBalance } from '@server/external-api/client'

/**
 * Hook to fetch credits balance
 * Uses oRPC for type-safe API calls
 */
export function useCredits() {
  const { user } = useAuth()

  return useQuery({
    ...orpcQuery.credits.getBalance.queryOptions(),
    select: (data: CreditsBalance) => data.credits_balance,
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
  })
}
