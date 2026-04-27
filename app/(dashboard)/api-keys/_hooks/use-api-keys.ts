import { orpcQuery } from "@lib/orpc/client";
import type { ListAPIKeysResponse } from "@server/external-api/api-keys";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to fetch API keys list
 * Uses oRPC for type-safe API calls
 */
export function useApiKeys() {
  return useQuery({
    ...orpcQuery.apiKeys.list.queryOptions(),
    select: (data) => data.api_keys || [],
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}

/**
 * Hook to create a new API key
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.apiKeys.create.mutationOptions(),
    onSuccess: () => {
      // Invalidate the API keys list cache
      queryClient.invalidateQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      });
    },
  });
}

/**
 * Hook to toggle API key status (enable/disable)
 * Uses oRPC mutation with optimistic update
 */
export function useToggleApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.apiKeys.toggle.mutationOptions(),
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(orpcQuery.apiKeys.list.queryKey());

      // Optimistically update to the new value
      queryClient.setQueryData(
        orpcQuery.apiKeys.list.queryKey(),
        (old: ListAPIKeysResponse | undefined) => {
          if (!old?.api_keys) return old;
          return {
            ...old,
            api_keys: old.api_keys.map((key) =>
              key.id === id ? { ...key, is_active: !key.is_active } : key
            ),
          };
        }
      );

      // Return context object with the snapshot
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(orpcQuery.apiKeys.list.queryKey(), context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      });
    },
  });
}

/**
 * Hook to revoke an API key
 * Uses oRPC mutation with optimistic update
 */
export function useRevokeApiKey() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.apiKeys.revoke.mutationOptions(),
    onMutate: async ({ id }) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      });

      // Snapshot the previous value
      const previousData = queryClient.getQueryData(orpcQuery.apiKeys.list.queryKey());

      // Optimistically remove from list
      queryClient.setQueryData(
        orpcQuery.apiKeys.list.queryKey(),
        (old: ListAPIKeysResponse | undefined) => {
          if (!old?.api_keys) return old;
          return {
            ...old,
            api_keys: old.api_keys.filter((key) => key.id !== id),
          };
        }
      );

      // Return context object with the snapshot
      return { previousData };
    },
    onError: (_err, _variables, context) => {
      // Rollback on error
      if (context?.previousData) {
        queryClient.setQueryData(orpcQuery.apiKeys.list.queryKey(), context.previousData);
      }
    },
    onSettled: () => {
      // Always refetch after error or success
      queryClient.invalidateQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      });
    },
  });
}
