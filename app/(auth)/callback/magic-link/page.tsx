"use client";

import { isAuthEventTracked, isLikelyNewUser, trackLogin, trackSignUp } from "@lib/posthog";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export default function MagicLinkCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const toast = useToast();
  const session = authClient.useSession();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const loginPath = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
    error: "magic",
  });
  const hasTrackedLogin = useRef(false);

  useEffect(() => {
    if (session.isPending) return;

    if (session.data?.user) {
      if (!hasTrackedLogin.current && !isAuthEventTracked()) {
        if (isLikelyNewUser(session.data.user.createdAt)) {
          trackSignUp("email", session.data.user.id);
        } else {
          trackLogin("email", session.data.user.id);
        }
        hasTrackedLogin.current = true;
      }
      toast.success(t("magicLinkLoginSuccess"));
      router.replace(callbackURL);
    } else {
      toast.error(t("magicLinkLoginFailed"));
      router.replace(loginPath);
    }
  }, [callbackURL, loginPath, session.isPending, session.data, toast, router, t]);

  return (
    <div className="landing-tone min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
        <p>{t("processingMagicLink")}</p>
      </div>
    </div>
  );
}
