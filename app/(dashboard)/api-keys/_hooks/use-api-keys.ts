import { orpcQuery } from '@lib/orpc/client'
import { useQueryClient, useQuery, useMutation } from '@tanstack/react-query'

/**
 * Hook to fetch API keys list
 * Uses oRPC for type-safe API calls
 */
export function useApiKeys() {
  return useQuery(orpcQuery.apiKeys.list.queryOptions())
}

/**
 * Hook to create a new API key
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useCreateApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    ...orpcQuery.apiKeys.create.mutationOptions(),
    onSuccess: () => {
      // Invalidate the API keys list cache
      queryClient.invalidateQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      })
    },
  })
}

/**
 * Hook to delete an API key
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useDeleteApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    ...orpcQuery.apiKeys.delete.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      })
    },
  })
}

/**
 * Hook to revoke an API key
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useRevokeApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    ...orpcQuery.apiKeys.revoke.mutationOptions(),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: orpcQuery.apiKeys.list.queryKey(),
      })
    },
  })
}
