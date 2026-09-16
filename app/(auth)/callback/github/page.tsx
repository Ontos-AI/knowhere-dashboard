"use client";

import { isAuthEventTracked, isLikelyNewUser, trackLogin, trackSignUp } from "@lib/posthog";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export default function GitHubCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const session = authClient.useSession();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const loginPath = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
    error: "oauth",
  });
  const hasTrackedLogin = useRef(false);

  useEffect(() => {
    if (session.isPending) return;
    if (session.data?.user) {
      if (!hasTrackedLogin.current && !isAuthEventTracked()) {
        if (isLikelyNewUser(session.data.user.createdAt)) {
          trackSignUp("github", session.data.user.id);
        } else {
          trackLogin("github", session.data.user.id);
        }
        hasTrackedLogin.current = true;
      }
      toast.success(t("githubLoginSuccess"));
      router.replace(callbackURL);
    } else {
      toast.error(t("githubLoginFailed"));
      router.replace(loginPath);
    }
  }, [callbackURL, loginPath, session.isPending, session.data, toast, router, t]);

  return (
    <div className="login-status">
      <span className="control-spinner" aria-hidden="true" />
      <p>{t("processingGithubLogin")}</p>
    </div>
  );
}
