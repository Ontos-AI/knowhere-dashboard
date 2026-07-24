"use client";

import { ErrorBoundary } from "@components/common/error-boundary";
import { Toaster } from "@components/ui/sonner";
import { AcquisitionAttributionProvider } from "@providers/acquisition-attribution-provider";
import { AuthenticatedJobAnalyticsSync } from "@providers/authenticated-job-analytics-sync";
import { QueryProvider } from "@providers/query-provider";
import { TimezoneSync } from "@providers/timezone-sync";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { Suspense } from "react";

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <NuqsAdapter>
      <QueryProvider>
        <Suspense fallback={null}>
          <AcquisitionAttributionProvider />
        </Suspense>
        <TimezoneSync />
        <AuthenticatedJobAnalyticsSync />
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster />
      </QueryProvider>
    </NuqsAdapter>
  );

  return content;
}
