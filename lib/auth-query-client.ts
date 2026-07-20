import { MutationCache, QueryCache, QueryClient } from "@tanstack/react-query";
import { authRecovery } from "@/lib/auth-recovery";
import { authClient } from "@/lib/better-auth-client";
import { resetUser } from "@/lib/posthog";

type AuthRouter = {
  readonly replace: (href: string) => void;
  readonly refresh: () => void;
};

function getCurrentBrowserPath(): string {
  if (typeof window === "undefined") {
    return "/";
  }

  return `${window.location.pathname}${window.location.search}`;
}

function createQueryClient(router: AuthRouter): QueryClient {
  let queryClient: QueryClient;

  const handleUnauthorizedError = (error: unknown): void => {
    void authRecovery.handleUnauthorizedError(error, {
      queryClient,
      router,
      signOut: () => authClient.signOut(),
      resetUser,
      getCurrentPath: getCurrentBrowserPath,
    });
  };

  queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: handleUnauthorizedError,
    }),
    mutationCache: new MutationCache({
      onError: handleUnauthorizedError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        gcTime: 5 * 60 * 1000, // 5 minutes
        refetchOnWindowFocus: false,
        retry: authRecovery.shouldRetryQuery,
      },
      mutations: {
        retry: authRecovery.shouldRetryMutation,
      },
    },
  });

  return queryClient;
}

export const authQueryClient = {
  create: createQueryClient,
} as const;
