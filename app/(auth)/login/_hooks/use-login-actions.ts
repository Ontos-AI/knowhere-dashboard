"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export type OAuthProvider = "github" | "google";

export const useLoginActions = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Auth");
  const toast = useToast();
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);
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
  const forgotPasswordPath = authRedirect.buildAuthPagePath("/forgot-password", {
    callbackURL: rawCallbackURL,
  });
  // Preserve the sanitized callbackURL into the "Create account" link so
  // first-time Notebook users are still sent back to Notebook after they
  // finish registration. Without this, /register drops the callback and
  // Dashboard falls back to its default post-auth path.
  const registerPath = authRedirect.buildAuthPagePath("/register", {
    callbackURL: rawCallbackURL,
  });

  const signInWithProvider = async (provider: OAuthProvider) => {
    if (isMagicLinkLoading || isPasswordLoading || activeOAuthProvider) {
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
    if (isMagicLinkLoading || isPasswordLoading || activeOAuthProvider) {
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

  const signInWithPassword = async (email: string, password: string) => {
    if (isMagicLinkLoading || isPasswordLoading || activeOAuthProvider) {
      return false;
    }

    setIsPasswordLoading(true);

    try {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message || t("loginFailed"));
      }

      toast.success(t("loginSuccess"));
      router.push(callbackURL);
      router.refresh();
      return true;
    } catch (error) {
      const message = error instanceof Error ? error.message : t("loginFailed");
      toast.error(t("loginFailed"), message);
      return false;
    } finally {
      setIsPasswordLoading(false);
    }
  };

  return {
    activeOAuthProvider,
    forgotPasswordPath,
    registerPath,
    isMagicLinkLoading,
    isOAuthLoading: activeOAuthProvider !== null,
    isPasswordLoading,
    signInWithMagicLink,
    signInWithPassword,
    signInWithProvider,
  };
};
