"use client";

import { ErrorBoundary } from "@components/common/error-boundary";
import { Toaster } from "@components/ui/sonner";
import { AuthenticatedJobPosthogSync } from "@providers/authenticated-job-posthog-sync";
import { QueryProvider } from "@providers/query-provider";
import { TimezoneSync } from "@providers/timezone-sync";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  const content = (
    <NuqsAdapter>
      <QueryProvider>
        <TimezoneSync />
        <AuthenticatedJobPosthogSync />
        <ErrorBoundary>{children}</ErrorBoundary>
        <Toaster />
      </QueryProvider>
    </NuqsAdapter>
  );

  return content;
}
