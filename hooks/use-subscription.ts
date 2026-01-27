import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'

/**
 * Hook to fetch current subscription
 */
export function useSubscription() {
  return useQuery({
    queryKey: ['subscription'],
    queryFn: () => api.getCurrentSubscription(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}

/**
 * Hook to fetch price configurations
 */
export function usePriceConfigs(productType?: 'subscription' | 'credits_package') {
  return useQuery({
    queryKey: ['price-configs', productType],
    queryFn: () => api.getPriceConfigs(productType),
    staleTime: 10 * 60 * 1000, // 10 minutes
  })
}

/**
 * Hook to subscribe to a plan
 */
export function useSubscribePlan() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (planId: string) => api.subscribePlan(planId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
      queryClient.invalidateQueries({ queryKey: ['credits'] })
    },
  })
}

/**
 * Hook to cancel subscription
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: () => api.cancelSubscription(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['subscription'] })
    },
  })
}

/**
 * Hook to buy credits package
 */
export function useBuyCreditsPackage() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ priceId, quantity }: { priceId: string; quantity: number }) =>
      api.buyCreditsPackage(priceId, quantity),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['credits'] })
      queryClient.invalidateQueries({ queryKey: ['transaction-history'] })
    },
  })
}

/**
 * Hook to fetch credit packages
 */
export function useCreditPackages() {
  return useQuery({
    queryKey: ['credit-packages'],
    queryFn: () => api.getCreditPackages(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}
