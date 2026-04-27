import { orpcQuery } from "@lib/orpc/client";
import { useQuery } from "@tanstack/react-query";
import { useAppConfigContext } from "@/providers/config-provider";

/**
 * Hook to fetch usage statistics
 * Uses oRPC for type-safe API calls
 */
export function useUsageStats(period: "day" | "week" | "month" | "year" = "month") {
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.usage.getStats.queryOptions({
      input: { period },
    }),
    enabled: billingEnabled,
    staleTime: 60 * 1000, // 1 minute
  });
}

/**
 * Hook to fetch parse usage
 * Uses oRPC for type-safe API calls
 */
export function useParseUsage() {
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.usage.getParseUsage.queryOptions(),
    enabled: billingEnabled,
    staleTime: 30 * 1000, // 30 seconds
  });
}

/**
 * Hook to fetch transaction history
 * Uses oRPC for type-safe API calls with pagination
 */
export function useTransactionHistory({
  limit = 50,
  offset = 0,
}: {
  limit?: number;
  offset?: number;
} = {}) {
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.usage.getTransactionHistory.queryOptions({
      input: { limit, offset },
    }),
    enabled: billingEnabled,
    staleTime: 60 * 1000, // 1 minute
  });
}
