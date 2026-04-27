"use client";

import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export type OAuthProvider = "github" | "google";

export const useLoginActions = () => {
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const toast = useToast();
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [activeOAuthProvider, setActiveOAuthProvider] = useState<OAuthProvider | null>(null);

  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const oauthErrorCallbackURL = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
    error: "oauth",
  });
  const magicLinkErrorCallbackURL = authRedirect.buildMagicLinkErrorCallbackURL("/login", {
    callbackURL: rawCallbackURL,
    error: "magic",
  });

  const signInWithProvider = async (provider: OAuthProvider) => {
    if (isMagicLinkLoading || activeOAuthProvider) {
      return;
    }

    setActiveOAuthProvider(provider);

    try {
      await authClient.signIn.social({
        provider,
        callbackURL,
        errorCallbackURL: oauthErrorCallbackURL,
        newUserCallbackURL: callbackURL,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t("loginFailed");
      toast.error(t("oauthFailed"), message);
      setActiveOAuthProvider(null);
    }
  };

  const signInWithMagicLink = async (email: string) => {
    if (isMagicLinkLoading || activeOAuthProvider) {
      return false;
    }

    setIsMagicLinkLoading(true);

    try {
      const { error } = await authClient.signIn.magicLink({
        email: email.trim(),
        callbackURL,
        errorCallbackURL: magicLinkErrorCallbackURL,
        newUserCallbackURL: callbackURL,
      });

      if (error) {
        throw new Error(error.message || t("magicLinkFailed"));
      }

      toast.success(t("magicLinkSent"));
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : t("loginFailed");
      toast.error(t("loginFailed"), message);
      return false;
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  return {
    activeOAuthProvider,
    isMagicLinkLoading,
    isOAuthLoading: activeOAuthProvider !== null,
    signInWithMagicLink,
    signInWithProvider,
  };
};
