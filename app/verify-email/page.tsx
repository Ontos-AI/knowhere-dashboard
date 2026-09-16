"use client";

import { useVerifyEmail } from "@app/(dashboard)/settings/_hooks/use-verification";
import { authClient } from "@lib/better-auth-client";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Suspense, useEffect, useRef, useState } from "react";

function VerifyEmailFallback() {
  const t = useTranslations("Common");

  return (
    <div className="login-status">
      <span className="control-spinner" aria-hidden="true" />
      <p>{t("loading")}</p>
    </div>
  );
}

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
      <div className="login-status">
        <span className="control-spinner" aria-hidden="true" />
        <p>{t("verifying")}</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="form-heading">
        <h1>{t("success")}</h1>
        <p className="form-heading-desc">{t("successMessage")}</p>
        <p className="form-heading-desc">{t("redirecting")}</p>
      </div>
    );
  }

  return (
    <>
      <div className="form-heading">
        <h1>{t("error")}</h1>
        <p className="form-heading-desc">{t("errorMessage")}</p>
      </div>
      <button
        className="control-button control-button--black"
        type="button"
        onClick={() => router.push("/settings")}
      >
        <span className="control-button-content">{t("goToSettings")}</span>
      </button>
    </>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<VerifyEmailFallback />}>
      <VerifyEmailContent />
    </Suspense>
  );
}
