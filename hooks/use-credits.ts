import { orpcQuery } from "@lib/orpc/client";
import type { CreditsBalance } from "@server/external-api/credits";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";
import { useAppConfigContext } from "@/providers/config-provider";

/**
 * Hook to fetch credits balance
 * Uses oRPC for type-safe API calls
 */
export function useCredits() {
  const { user, isLoading: isAuthLoading } = useAuth();
  const { billingEnabled } = useAppConfigContext();

  return useQuery({
    ...orpcQuery.credits.getBalance.queryOptions(),
    select: (data: CreditsBalance) => data.credits_balance ?? 0,
    enabled: billingEnabled && !isAuthLoading && !!user,
    staleTime: 30 * 1000, // 30 seconds
  });
}
