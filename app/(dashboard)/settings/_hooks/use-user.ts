import { authClient } from "@lib/better-auth-client";
import { orpcQuery } from "@lib/orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to update user profile
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useUpdateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.users.updateProfile.mutationOptions(),
    onSuccess: async () => {
      // Refresh Better Auth session with cache bypass
      await authClient.getSession({
        query: { disableCookieCache: true },
      });

      // Invalidate Better Auth session query
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}

/**
 * Hook to update user email
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useUpdateEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.users.updateEmail.mutationOptions(),
    onSuccess: async () => {
      // Refresh Better Auth session with cache bypass
      await authClient.getSession({
        query: { disableCookieCache: true },
      });

      // Invalidate Better Auth session query
      await queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}
