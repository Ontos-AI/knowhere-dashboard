import { authClient } from "@lib/better-auth-client";
import { useQuery } from "@tanstack/react-query";

const EMAIL_PROVIDERS = new Set(["magic-link", "email", "credential"]);
const PASSWORD_PROVIDER_ID = "credential";

const PROVIDER_DISPLAY: Record<string, string> = {
  google: "Google",
  github: "GitHub",
};

export function useLinkedAccounts() {
  const { data: accounts, isPending } = useQuery({
    queryKey: ["linked-accounts"],
    queryFn: async () => {
      const { data, error } = await authClient.listAccounts();
      if (error) throw new Error(error.message);
      return data ?? [];
    },
    staleTime: 5 * 60 * 1000,
  });

  const oAuthAccount = accounts?.find((a) => !EMAIL_PROVIDERS.has(a.providerId));
  const hasOAuthAccount = !!oAuthAccount;
  const oAuthProviderName = oAuthAccount
    ? (PROVIDER_DISPLAY[oAuthAccount.providerId] ?? oAuthAccount.providerId)
    : undefined;
  const hasPasswordCredential = accounts?.some(
    (account) => account.providerId === PASSWORD_PROVIDER_ID
  );

  return {
    hasOAuthAccount,
    hasPasswordCredential: !!hasPasswordCredential,
    oAuthProviderName,
    isLoading: isPending,
  };
}
