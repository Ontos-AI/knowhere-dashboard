"use client";

import { orpcQuery } from "@lib/orpc/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const usageWelcomeQueryKey = orpcQuery.users.getUsageWelcomeState.queryKey();

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

export const useUsageWelcome = () => {
  const usageWelcomeState = useUsageWelcomeState();
  const dismissWelcome = useDismissUsageWelcome();

  return {
    apiKey: usageWelcomeState.data?.apiKey ?? null,
    dismiss: () => dismissWelcome.mutate(undefined),
    hasProvisionError: usageWelcomeState.data?.hasProvisionError ?? false,
    isDismissing: dismissWelcome.isPending,
    isOpen: usageWelcomeState.data?.shouldShow ?? false,
    isProvisioning:
      usageWelcomeState.data?.isProvisioning ??
      (usageWelcomeState.isPending && !usageWelcomeState.data),
  };
};
