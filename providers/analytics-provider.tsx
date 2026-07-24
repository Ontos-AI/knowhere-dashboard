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
  const { gaMeasurementId, openAIAdsPixelId } = useAppConfigContext();

  useEffect(() => {
    initializeAnalytics({ googleAnalyticsMeasurementId: gaMeasurementId, openAIAdsPixelId });

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackAnalyticsPageView(pagePath);
  }, [gaMeasurementId, openAIAdsPixelId, pathname, searchParams]);

  return null;
}

export function AnalyticsProvider({ children }: AnalyticsProviderProps) {
  const { gaMeasurementId, openAIAdsPixelId } = useAppConfigContext();

  useEffect(() => {
    initializeAnalytics({ googleAnalyticsMeasurementId: gaMeasurementId, openAIAdsPixelId });
  }, [gaMeasurementId, openAIAdsPixelId]);

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
