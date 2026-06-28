"use client";

import { useAppConfigContext } from "@providers/config-provider";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

type GoogleAnalyticsPageViewProps = {
  children: ReactNode;
};

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

function GoogleAnalyticsPageView({ children }: GoogleAnalyticsPageViewProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { gaMeasurementId } = useAppConfigContext();

  useEffect(() => {
    if (!gaMeasurementId || typeof window.gtag !== "function") {
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;

    window.gtag("config", gaMeasurementId, {
      page_path: pagePath,
    });
  }, [gaMeasurementId, pathname, searchParams]);

  return <>{children}</>;
}

export function GoogleAnalyticsProvider({ children }: GoogleAnalyticsPageViewProps) {
  return (
    <Suspense fallback={children}>
      <GoogleAnalyticsPageView>{children}</GoogleAnalyticsPageView>
    </Suspense>
  );
}
