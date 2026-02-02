import { orpcQuery } from "@lib/orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch current subscription
 * Uses oRPC for type-safe API calls
 */
export function useSubscription() {
  return useQuery({
    ...orpcQuery.subscriptions.getCurrent.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch price configurations
 * Uses oRPC for type-safe API calls
 */
export function usePriceConfigs(productType: "subscription" | "credits_package") {
  return useQuery({
    ...orpcQuery.subscriptions.getPriceConfigs.queryOptions({ input: { productType } }),
    select: (data) =>
      productType === "credits_package" ? data.credits_packages || [] : data.subscriptions || [],
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 30 * 60 * 1000, // 30 minutes
  });
}

/**
 * Hook to subscribe to a plan
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useSubscribePlan() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.subscriptions.subscribe.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.subscriptions.getCurrent.queryKey(),
      });
      queryClient.invalidateQueries({
        queryKey: orpcQuery.credits.getBalance.queryKey(),
      });
    },
  });
}

/**
 * Hook to cancel subscription
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useCancelSubscription() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.subscriptions.cancel.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.subscriptions.getCurrent.queryKey(),
      });
    },
  });
}

/**
 * Hook to buy credits package
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useBuyCreditsPackage() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.credits.buyPackage.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.credits.getBalance.queryKey(),
      });
      // Invalidate all transaction history queries
      queryClient.invalidateQueries({
        queryKey: orpcQuery.usage.getTransactionHistory.queryKey({
          input: { limit: 50, offset: 0 },
        }),
      });
    },
  });
}

/**
 * Hook to fetch credit packages
 * Uses oRPC for type-safe API calls
 */
export function useCreditPackages() {
  return useQuery({
    ...orpcQuery.credits.getPackages.queryOptions(),
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
