"use client";

import { buildPostHogAuthCallbackURL, markPendingAuthLogin } from "@lib/posthog";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { AuthButton } from "@/app/(auth)/_components/form-controls";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

type OAuthButtonsProps = {
  onError?: (error: string) => void;
};

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      fill="#4285F4"
      d="M21.6 12.23c0-.71-.06-1.39-.18-2.05H12v3.88h5.38a4.6 4.6 0 0 1-2 3.01v2.51h3.24c1.9-1.75 2.98-4.33 2.98-7.35Z"
    />
    <path
      fill="#34A853"
      d="M12 22c2.7 0 4.96-.9 6.62-2.42l-3.24-2.51c-.9.6-2.05.97-3.38.97-2.6 0-4.81-1.76-5.6-4.12H3.05v2.59A10 10 0 0 0 12 22Z"
    />
    <path fill="#FBBC05" d="M6.4 13.92a6 6 0 0 1 0-3.84V7.49H3.05a10 10 0 0 0 0 9.02l3.35-2.59Z" />
    <path
      fill="#EA4335"
      d="M12 5.96c1.47 0 2.79.51 3.82 1.51l2.87-2.87A9.62 9.62 0 0 0 12 2a10 10 0 0 0-8.95 5.49l3.35 2.59C7.19 7.72 9.4 5.96 12 5.96Z"
    />
  </svg>
);

const GitHubIcon = () => (
  <svg
    className="github-mark"
    width="21"
    height="21"
    viewBox="0 0 128 128"
    fill="none"
    aria-hidden="true"
  >
    <path
      d="M56.7937 84.9688C44.4187 83.4688 35.7 74.5625 35.7 63.0313C35.7 58.3438 37.3875 53.2813 40.2 49.9063C38.9812 46.8125 39.1687 40.25 40.575 37.5313C44.325 37.0625 49.3875 39.0313 52.3875 41.75C55.95 40.625 59.7 40.0625 64.2937 40.0625C68.8875 40.0625 72.6375 40.625 76.0125 41.6563C78.9187 39.0313 84.075 37.0625 87.825 37.5313C89.1375 40.0625 89.325 46.625 88.1062 49.8125C91.1062 53.375 92.7 58.1563 92.7 63.0313C92.7 74.5625 83.9812 83.2813 71.4187 84.875C74.6062 86.9375 76.7625 91.4375 76.7625 96.5938L76.7625 106.344C76.7625 109.156 79.1062 110.75 81.9187 109.625C98.8875 103.156 112.2 86.1875 112.2 65.1875C112.2 38.6563 90.6375 17 64.1062 17C37.575 17 16.2 38.6562 16.2 65.1875C16.2 86 29.4187 103.25 47.2312 109.719C49.7625 110.656 52.2 108.969 52.2 106.438L52.2 98.9375C50.8875 99.5 49.2 99.875 47.7 99.875C41.5125 99.875 37.8562 96.5 35.2312 90.2188C34.2 87.6875 33.075 86.1875 30.9187 85.9063C29.7937 85.8125 29.4187 85.3438 29.4187 84.7813C29.4187 83.6563 31.2937 82.8125 33.1687 82.8125C35.8875 82.8125 38.2312 84.5 40.6687 87.9688C42.5437 90.6875 44.5125 91.9063 46.8562 91.9063C49.2 91.9063 50.7 91.0625 52.8562 88.9063C54.45 87.3125 55.6687 85.9063 56.7937 84.9688Z"
      fill="black"
    />
  </svg>
);

export function OAuthButtons({ onError }: OAuthButtonsProps) {
  const toast = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [clickedProvider, setClickedProvider] = useState<"google" | "github" | null>(null);
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const errorCallbackURL = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
    error: "oauth",
  });

  const signInWithProvider = async (provider: "github" | "google") => {
    if (isLoading) return;
    setIsLoading(true);
    setClickedProvider(provider);
    try {
      const trackedCallbackURL = buildPostHogAuthCallbackURL(callbackURL);
      markPendingAuthLogin();
      await authClient.signIn.social({
        provider,
        callbackURL: trackedCallbackURL,
        errorCallbackURL,
        newUserCallbackURL: trackedCallbackURL,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : t("loginFailed");
      toast.error(t("oauthFailed"), message);
      onError?.(message);
      setIsLoading(false);
      setClickedProvider(null);
    }
  };

  return (
    <>
      <div className="social-buttons">
        <AuthButton
          disabled={isLoading}
          loading={clickedProvider === "google"}
          onClick={() => signInWithProvider("google")}
          variant="white"
        >
          <GoogleIcon />
          {t("continueWithGoogle")}
        </AuthButton>
        <AuthButton
          disabled={isLoading}
          loading={clickedProvider === "github"}
          onClick={() => signInWithProvider("github")}
          variant="white"
        >
          <GitHubIcon />
          {t("continueWithGithub")}
        </AuthButton>
      </div>
      <div className="divider">
        <span>{t("orContinueWithEmail")}</span>
      </div>
    </>
  );
}
