"use client";

import { useCredits } from "@hooks/use-credits";
import { trackPaymentRedirectFromSearchParams } from "@lib/analytics/payment-redirect";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";
import { useAppConfigContext } from "@/providers/config-provider";

const PAYMENT_QUERY_KEYS = ["success", "canceled", "type", "session_id", "amount", "plan_id"];

export function usePaymentRedirectTracking() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { billingEnabled } = useAppConfigContext();
  const { refetch: refreshCredits } = useCredits();
  const hasTrackedPaymentResult = useRef(false);

  useEffect(() => {
    if (!billingEnabled || hasTrackedPaymentResult.current) {
      return;
    }

    const isBillingRoute = pathname === "/billing" || pathname.startsWith("/billing/");
    if (isBillingRoute) {
      return;
    }

    const isPaymentRedirect =
      searchParams.get("success") === "true" || searchParams.get("canceled") === "true";
    if (!isPaymentRedirect) {
      return;
    }

    hasTrackedPaymentResult.current = true;
    const result = trackPaymentRedirectFromSearchParams(searchParams);

    if (result.kind === "success") {
      void refreshCredits();
    }

    const params = new URLSearchParams(searchParams.toString());
    for (const key of PAYMENT_QUERY_KEYS) {
      params.delete(key);
    }
    const nextSearch = params.toString();
    router.replace(nextSearch ? `${pathname}?${nextSearch}` : pathname);
  }, [billingEnabled, pathname, refreshCredits, router, searchParams]);
}
