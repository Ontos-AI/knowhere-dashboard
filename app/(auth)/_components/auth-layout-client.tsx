"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { LoginChrome } from "@/app/(auth)/_components/login-chrome";
import { useAuth } from "@/hooks/use-auth";
import { authRedirect } from "@/lib/auth-redirect";

export function AuthLayoutClient({ children }: { children: ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Common");
  const callbackURL = authRedirect.resolveCallbackURL(searchParams.get("callbackURL"));
  const isCallbackPage = pathname.startsWith("/callback/");

  useEffect(() => {
    if (!isLoading && isAuthenticated && !isCallbackPage) {
      router.replace(callbackURL);
    }
  }, [callbackURL, isAuthenticated, isCallbackPage, isLoading, router]);

  if ((isLoading || isAuthenticated) && !isCallbackPage) {
    return (
      <LoginChrome>
        <div className="login-status">
          <span className="control-spinner" aria-hidden="true" />
          <p>{t("loading")}</p>
        </div>
      </LoginChrome>
    );
  }

  return <LoginChrome>{children}</LoginChrome>;
}
