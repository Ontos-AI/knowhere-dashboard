import { orpcQuery } from '@lib/orpc/client'
import { useQuery } from '@tanstack/react-query'

/**
 * Hook to fetch usage statistics
 * Uses oRPC for type-safe API calls
 */
export function useUsageStats(period: 'day' | 'week' | 'month' | 'year' = 'month') {
  return useQuery({
    ...orpcQuery.usage.getStats.queryOptions({
      input: { period },
    }),
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch parse usage
 * Uses oRPC for type-safe API calls
 */
export function useParseUsage() {
  return useQuery({
    ...orpcQuery.usage.getParseUsage.queryOptions(),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to fetch transaction history
 * Uses oRPC for type-safe API calls with pagination
 */
export function useTransactionHistory(limit = 50, offset = 0) {
  return useQuery({
    ...orpcQuery.usage.getTransactionHistory.queryOptions({
      input: { limit, offset },
    }),
    staleTime: 60 * 1000, // 1 minute
  })
}
