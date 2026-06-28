"use client";

import { initPostHogClient, isPostHogEnabled, trackPageView } from "@lib/posthog";
import { AuthenticatedJobPosthogSync } from "@providers/authenticated-job-posthog-sync";
import { PostHogAuthSync } from "@providers/posthog-auth-sync";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

type PostHogProviderProps = {
  children: ReactNode;
};

function PostHogPageView({ children }: PostHogProviderProps) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPostHogEnabled) {
      return;
    }

    initPostHogClient();
  }, []);

  useEffect(() => {
    if (!isPostHogEnabled) {
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackPageView(pagePath);
  }, [pathname, searchParams]);

  return (
    <>
      <PostHogAuthSync />
      <AuthenticatedJobPosthogSync />
      {children}
    </>
  );
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  return (
    <Suspense fallback={children}>
      <PostHogPageView>{children}</PostHogPageView>
    </Suspense>
  );
}
