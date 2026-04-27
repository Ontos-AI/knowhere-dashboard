import { orpcQuery } from "@lib/orpc/client";
import type { CreditsPackage, SubscriptionPlan } from "@server/external-api/subscriptions";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useAppConfigContext } from "@/providers/config-provider";

/**
 * Hook to fetch current subscription
 * Uses oRPC for type-safe API calls
 */
export function useSubscription() {
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.subscriptions.getCurrent.queryOptions(),
    enabled: billingEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

/**
 * Hook to fetch price configurations
 * Uses oRPC for type-safe API calls with function overloads for type safety
 */
export function usePriceConfigs(
  productType: "credits_package"
): ReturnType<typeof useQuery<unknown, Error, CreditsPackage[]>>;
export function usePriceConfigs(
  productType: "subscription"
): ReturnType<typeof useQuery<unknown, Error, SubscriptionPlan[]>>;
export function usePriceConfigs(productType: "subscription" | "credits_package") {
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.subscriptions.getPriceConfigs.queryOptions({ input: { productType } }),
    select: (data) =>
      productType === "credits_package" ? data.credits_packages || [] : data.subscriptions || [],
    enabled: billingEnabled,
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
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.credits.getPackages.queryOptions(),
    enabled: billingEnabled,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}
