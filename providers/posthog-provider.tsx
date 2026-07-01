"use client";

import { initPostHogClient, isPostHogEnabled, trackPageView } from "@lib/posthog";
import { PostHogAuthSync } from "@providers/posthog-auth-sync";
import { usePathname, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { Suspense, useEffect } from "react";

type PostHogProviderProps = {
  children: ReactNode;
};

function PostHogPageViewTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!isPostHogEnabled) {
      return;
    }

    const query = searchParams.toString();
    const pagePath = query ? `${pathname}?${query}` : pathname;
    trackPageView(pagePath);
  }, [pathname, searchParams]);

  return null;
}

export default function PostHogProvider({ children }: PostHogProviderProps) {
  useEffect(() => {
    if (!isPostHogEnabled) {
      return;
    }

    initPostHogClient();
  }, []);

  return (
    <>
      <Suspense fallback={null}>
        <PostHogPageViewTracker />
      </Suspense>
      <PostHogAuthSync />
      {children}
    </>
  );
}
