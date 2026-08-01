"use client";

import { trackLogin } from "@lib/posthog";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export const useLoginActions = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("Auth");
  const toast = useToast();
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const forgotPasswordPath = authRedirect.buildAuthPagePath("/forgot-password", {
    callbackURL: rawCallbackURL,
  });
  // Preserve the sanitized callbackURL into the "Create account" link so
  // first-time users from a relying app are still sent back to that app
  // after they finish registration. Without this, /register drops the
  // callback and Dashboard falls back to its default post-auth path.
  const registerPath = authRedirect.buildAuthPagePath("/register", {
    callbackURL: rawCallbackURL,
  });

  const signInWithPassword = async (username: string, password: string) => {
    if (isPasswordLoading) {
      return false;
    }

    setIsPasswordLoading(true);

    try {
      const { error } = await authClient.signIn.username({
        username: username.trim(),
        password,
      });

      if (error) {
        throw new Error(error.message || t("loginFailed"));
      }

      const session = await authClient.getSession();
      if (session.data?.user?.id) {
        trackLogin("email", session.data.user.id);
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
    forgotPasswordPath,
    registerPath,
    isPasswordLoading,
    signInWithPassword,
  };
};
