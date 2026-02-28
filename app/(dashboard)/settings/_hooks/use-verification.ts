import { authClient } from "@lib/better-auth-client";
import { orpcQuery } from "@lib/orpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

/**
 * Hook to send email verification email
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useSendVerificationEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.users.sendVerificationEmail.mutationOptions(),
    onSuccess: () => {
      // No need to invalidate queries - verification status will be checked after email verification
      queryClient.invalidateQueries({ queryKey: ["session"] });
    },
  });
}

/**
 * Hook to verify email using token
 * Uses oRPC mutation with automatic cache invalidation
 */
export function useVerifyEmail() {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.users.verifyEmail.mutationOptions(),
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
