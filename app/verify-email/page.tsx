"use client";

import { useVerifyEmail } from "@app/(dashboard)/settings/_hooks/use-verification";
import { Button } from "@components/ui/button";
import { authClient } from "@lib/better-auth-client";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const t = useTranslations("VerifyEmail");
  const token = searchParams.get("token");

  const verifyMutation = useVerifyEmail();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const hasVerified = useRef(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: verifyMutation.mutate is stable
  useEffect(() => {
    // Prevent double verification
    if (hasVerified.current) return;

    if (!token) {
      setStatus("error");
      return;
    }

    hasVerified.current = true;

    verifyMutation.mutate(
      { token },
      {
        onSuccess: async () => {
          // Refresh Better Auth session with cache bypass
          await authClient.getSession({
            query: { disableCookieCache: true },
          });

          setStatus("success");

          // Force a hard navigation to settings page to ensure fresh data
          setTimeout(() => {
            window.location.href = "/settings";
          }, 3000);
        },
        onError: (error) => {
          console.error("[VerifyEmail] Verification failed:", error);
          setStatus("error");
        },
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
          <p className="mt-4 text-muted-foreground">{t("verifying")}</p>
        </div>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center max-w-md px-4">
          <CheckCircle className="mx-auto h-16 w-16 text-green-500" />
          <h1 className="mt-4 text-2xl font-bold">{t("success")}</h1>
          <p className="mt-2 text-muted-foreground">{t("successMessage")}</p>
          <p className="mt-2 text-sm text-muted-foreground">{t("redirecting")}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center max-w-md px-4">
        <XCircle className="mx-auto h-16 w-16 text-red-500" />
        <h1 className="mt-4 text-2xl font-bold">{t("error")}</h1>
        <p className="mt-2 text-muted-foreground">{t("errorMessage")}</p>
        <Button className="mt-4" onClick={() => router.push("/settings")}>
          {t("goToSettings")}
        </Button>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
