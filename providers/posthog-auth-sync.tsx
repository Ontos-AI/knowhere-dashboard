"use client";

import {
  buildPostHogAuthCleanupPath,
  clearPendingAuthLogin,
  consumePendingMagicLinkAuth,
  getPostHogAuthCallbackURL,
  hasPendingAuthLogin,
  identifyUser,
  isAuthEventTracked,
  isLikelyNewUser,
  trackLogin,
  trackSignUp,
} from "@lib/posthog";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useRef } from "react";
import { authClient } from "@/lib/better-auth-client";

const EMAIL_PROVIDERS = new Set(["credential", "email", "magic-link"]);

type LoginMethod = "apple" | "email" | "github" | "google";

const resolveLoginMethod = async (): Promise<LoginMethod> => {
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

const trackAuthEvent = async (user: { id: string; createdAt?: Date | string }) => {
  if (isAuthEventTracked()) {
    return;
  }

  const method = await resolveLoginMethod();
  if (isAuthEventTracked()) {
    return;
  }

  if (isLikelyNewUser(user.createdAt)) {
    trackSignUp(method, user.id);
  } else {
    trackLogin(method, user.id);
  }
};

export function PostHogAuthSync() {
  const { data: session, isPending } = authClient.useSession();
  const lastIdentifiedUserId = useRef<string | null>(null);
  const hasHandledMagicLinkParam = useRef(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const finishPostAuthRedirect = useCallback(() => {
    const callbackURL = getPostHogAuthCallbackURL(searchParams);
    if (callbackURL) {
      router.replace(callbackURL);
      return;
    }

    if (searchParams.get("ph_auth")) {
      router.replace(buildPostHogAuthCleanupPath(pathname, searchParams));
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
      identifyUser(user.id, {
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

    const hasPostAuthCallback = Boolean(getPostHogAuthCallbackURL(searchParams));
    const phAuth = searchParams.get("ph_auth");

    if (isAuthEventTracked()) {
      finishPostAuthRedirect();
      return;
    }

    if (phAuth === "magic" && !hasHandledMagicLinkParam.current) {
      hasHandledMagicLinkParam.current = true;
      consumePendingMagicLinkAuth();
      void trackAuthEvent(user)
        .catch((error) => {
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
      .catch((error) => {
        console.error("Failed to track auth event:", error);
      })
      .finally(finishPostAuthRedirect);
  }, [finishPostAuthRedirect, isPending, searchParams, session?.user]);

  return null;
}
