"use client";

import {
  type AuthMethod,
  buildAnalyticsAuthCleanupPath,
  clearPendingAuthLogin,
  consumePendingMagicLinkAuth,
  getAnalyticsAuthCallbackURL,
  hasPendingAuthLogin,
  identifyAnalyticsUser,
  isAuthEventTracked,
  isLikelyNewUser,
} from "@lib/analytics";
import { trackLogin, trackSignUp } from "@lib/posthog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { authClient } from "@/lib/better-auth-client";

const EMAIL_PROVIDERS = new Set(["credential", "email", "magic-link"]);

const resolveLoginMethod = async (): Promise<AuthMethod> => {
  const { data: accounts } = await authClient.listAccounts();
  const oauthAccount = accounts?.find((account) => !EMAIL_PROVIDERS.has(account.providerId));

  if (oauthAccount?.providerId === "google") {
    return "google";
  }

  if (oauthAccount?.providerId === "github") {
    return "github";
  }

  if (oauthAccount?.providerId === "apple") {
    return "apple";
  }

  return "email";
};

const trackAuthEvent = async (user: {
  readonly createdAt?: Date | string;
  readonly id: string;
}): Promise<void> => {
  if (isAuthEventTracked()) {
    return;
  }

  const method = await resolveLoginMethod();
  if (isAuthEventTracked()) {
    return;
  }

  if (isLikelyNewUser(user.createdAt)) {
    trackSignUp(method, user.id);
    return;
  }

  trackLogin(method, user.id);
};

export function AnalyticsAuthSync() {
  const { data: session, isPending } = authClient.useSession();
  const lastIdentifiedUserId = useRef<string | null>(null);
  const hasHandledMagicLinkParam = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const finishPostAuthRedirect = useCallback((): void => {
    const callbackURL = getAnalyticsAuthCallbackURL(searchParams);
    if (callbackURL) {
      router.replace(callbackURL);
      return;
    }

    if (searchParams.get("ph_auth")) {
      router.replace(buildAnalyticsAuthCleanupPath(pathname, searchParams));
    }
  }, [pathname, router, searchParams]);

  useEffect(() => {
    if (isPending) {
      return;
    }

    const user = session?.user;
    if (!user?.id) {
      lastIdentifiedUserId.current = null;
      return;
    }

    if (lastIdentifiedUserId.current !== user.id) {
      identifyAnalyticsUser(user.id, {
        email: user.email,
        name: user.name,
      });
      lastIdentifiedUserId.current = user.id;
    }
  }, [isPending, session?.user]);

  useEffect(() => {
    if (isPending) {
      return;
    }

    const user = session?.user;
    if (!user?.id) {
      return;
    }

    const hasPostAuthCallback = Boolean(getAnalyticsAuthCallbackURL(searchParams));
    const phAuth = searchParams.get("ph_auth");

    if (isAuthEventTracked()) {
      finishPostAuthRedirect();
      return;
    }

    if (phAuth === "magic" && !hasHandledMagicLinkParam.current) {
      hasHandledMagicLinkParam.current = true;
      consumePendingMagicLinkAuth();
      void trackAuthEvent(user)
        .catch((error: unknown): void => {
          console.error("Failed to track magic-link auth event:", error);
        })
        .finally(finishPostAuthRedirect);
      return;
    }

    const hasPendingOAuth = hasPendingAuthLogin();
    const hasPendingMagicLink = consumePendingMagicLinkAuth();
    if (!hasPendingOAuth && !hasPendingMagicLink) {
      if (hasPostAuthCallback || phAuth) {
        finishPostAuthRedirect();
      }
      return;
    }

    if (hasPendingOAuth) {
      clearPendingAuthLogin();
    }

    void trackAuthEvent(user)
      .catch((error: unknown): void => {
        console.error("Failed to track auth event:", error);
      })
      .finally(finishPostAuthRedirect);
  }, [finishPostAuthRedirect, isPending, searchParams, session?.user]);

  return null;
}
