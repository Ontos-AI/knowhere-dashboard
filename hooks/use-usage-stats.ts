import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

/**
 * Hook to fetch usage statistics
 */
export function useUsageStats(period: 'day' | 'week' | 'month' = 'month') {
  return useQuery({
    queryKey: ['usage-stats', period],
    queryFn: () => api.getUsageStats(period),
    staleTime: 60 * 1000, // 1 minute
  })
}

/**
 * Hook to fetch parse usage
 */
export function useParseUsage() {
  return useQuery({
    queryKey: ['parse-usage'],
    queryFn: () => api.getParseUsage(),
    staleTime: 30 * 1000, // 30 seconds
  })
}

/**
 * Hook to fetch transaction history
 */
export function useTransactionHistory(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['transaction-history', limit, offset],
    queryFn: () => api.getTransactionHistory(limit, offset),
    staleTime: 60 * 1000, // 1 minute
  })
}
