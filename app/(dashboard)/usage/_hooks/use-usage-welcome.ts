"use client";

import { orpcQuery } from "@lib/orpc/client";
import { trackApiKeyCreated } from "@lib/posthog";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef } from "react";
import { authClient } from "@/lib/better-auth-client";

const usageWelcomeQueryKey = orpcQuery.users.getUsageWelcomeState.queryKey();
const WELCOME_API_KEY_NAME = "Welcome API Key";
const WELCOME_API_KEY_TRACKED_PREFIX = "ph_welcome_api_key_tracked_";

export const useUsageWelcomeState = () => {
  return useQuery({
    ...orpcQuery.users.getUsageWelcomeState.queryOptions(),
    refetchInterval: (query) => {
      return query.state.data?.isProvisioning ? 1000 : false;
    },
    staleTime: 0,
  });
};

export const useDismissUsageWelcome = () => {
  const queryClient = useQueryClient();

  return useMutation({
    ...orpcQuery.users.dismissUsageWelcome.mutationOptions(),
    onMutate: async () => {
      await queryClient.cancelQueries({
        queryKey: usageWelcomeQueryKey,
      });

      const previousData = queryClient.getQueryData(usageWelcomeQueryKey);

      queryClient.setQueryData(usageWelcomeQueryKey, {
        apiKey: null,
        apiKeyId: null,
        hasProvisionError: false,
        isProvisioning: false,
        shouldShow: false,
      });

      return { previousData };
    },
    onError: (_error, _variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(usageWelcomeQueryKey, context.previousData);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: usageWelcomeQueryKey,
      });
    },
  });
};

const trackWelcomeApiKeyIfNeeded = ({
  apiKey,
  apiKeyId,
  userId,
}: {
  apiKey: string | null;
  apiKeyId: string | null;
  userId: string;
}) => {
  if (!apiKey || typeof window === "undefined") {
    return;
  }

  const dedupeKey = `${WELCOME_API_KEY_TRACKED_PREFIX}${userId}`;
  if (localStorage.getItem(dedupeKey) === "1") {
    return;
  }

  trackApiKeyCreated(
    apiKeyId ?? `welcome:${userId}`,
    WELCOME_API_KEY_NAME,
    "welcome_auto_provision"
  );
  localStorage.setItem(dedupeKey, "1");
};

export const useUsageWelcome = () => {
  const usageWelcomeState = useUsageWelcomeState();
  const dismissWelcome = useDismissUsageWelcome();
  const session = authClient.useSession();
  const hasTrackedWelcomeApiKey = useRef(false);

  const apiKey = usageWelcomeState.data?.apiKey ?? null;
  const apiKeyId = usageWelcomeState.data?.apiKeyId ?? null;
  const userId = session.data?.user?.id;

  useEffect(() => {
    if (!userId || !apiKey || hasTrackedWelcomeApiKey.current) {
      return;
    }

    trackWelcomeApiKeyIfNeeded({ apiKey, apiKeyId, userId });
    hasTrackedWelcomeApiKey.current = true;
  }, [apiKey, apiKeyId, userId]);

  return {
    apiKey,
    apiKeyId,
    dismiss: () => dismissWelcome.mutate(undefined),
    hasProvisionError: usageWelcomeState.data?.hasProvisionError ?? false,
    isDismissing: dismissWelcome.isPending,
    isOpen: usageWelcomeState.data?.shouldShow ?? false,
    isProvisioning:
      usageWelcomeState.data?.isProvisioning ??
      (usageWelcomeState.isPending && !usageWelcomeState.data),
  };
};
