import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from './useAuth'

export function useCredits() {
  const { user } = useAuth()

  return useQuery({
    queryKey: ['credits', user?.id],
    queryFn: async () => {
      const data = await api.getCreditsBalance()
      return data.credits_balance
    },
    enabled: !!user,
    staleTime: 30 * 1000, // 30 seconds
  })
}
