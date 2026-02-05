import { orpcQuery } from "@lib/orpc/client";
import type { CreditsBalance } from "@server/external-api/credits";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/use-auth";

/**
 * Hook to fetch credits balance
 * Uses oRPC for type-safe API calls
 */
export function useCredits() {
  const { user, isLoading: isAuthLoading } = useAuth();

  return useQuery({
    ...orpcQuery.credits.getBalance.queryOptions(),
    select: (data: CreditsBalance) => data.credits_balance ?? 0,
    enabled: !isAuthLoading && !!user,
    staleTime: 30 * 1000, // 30 seconds
  });
}
