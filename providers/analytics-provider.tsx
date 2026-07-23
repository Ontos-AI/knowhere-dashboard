"use client";

import { initializeAnalytics, trackAnalyticsPageView } from "@lib/analytics";
import { AnalyticsAuthSync } from "@providers/analytics-auth-sync";
import { useAppConfigContext } from "@providers/config-provider";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

type AnalyticsProviderProps = {
  readonly children: ReactNode;
};

function AnalyticsPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { gaMeasurementId } = useAppConfigContext();

  useEffect(() => {
    initializeAnalytics({ googleAnalyticsMeasurementId: gaMeasurementId });

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackAnalyticsPageView(pagePath);
  }, [gaMeasurementId, pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { gaMeasurementId } = useAppConfigContext();

  useEffect(() => {
    initializeAnalytics({ googleAnalyticsMeasurementId: gaMeasurementId });
  }, [gaMeasurementId]);

  return (
    <>
      <Suspense fallback={null}>
        <AnalyticsPageViewTracker />
      </Suspense>
      <AnalyticsAuthSync />
      {children}
    </>
  );
}
