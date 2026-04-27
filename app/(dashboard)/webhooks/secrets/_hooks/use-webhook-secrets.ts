import { orpcQuery } from "@lib/orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch webhook secrets list
 * Uses oRPC for type-safe API calls
 */
export function useWebhookSecrets() {
  return useQuery({
    ...orpcQuery.webhookSecrets.list.queryOptions(),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
    retry: 2,
  });
}

/**
 * Hook to create a new webhook secret
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useCreateWebhookSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.webhookSecrets.create.mutationOptions(),
    onSuccess: () => {
      // Invalidate the webhook secrets list cache
      queryClient.invalidateQueries({
        queryKey: orpcQuery.webhookSecrets.list.queryKey(),
      });
    },
  });
}

/**
 * Hook to revoke a webhook secret
 * Uses oRPC mutation with cache invalidation
 */
export function useRevokeWebhookSecret() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.webhookSecrets.revoke.mutationOptions(),
    onSuccess: () => {
      // Invalidate the webhook secrets list cache
      queryClient.invalidateQueries({
        queryKey: orpcQuery.webhookSecrets.list.queryKey(),
      });
    },
  });
}
