"use client";

import { initPostHogClient, isPostHogEnabled, trackPageView } from "@lib/posthog";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { useEffect } from "react";

type PostHogProviderProps = {
  children: ReactNode;
};

export default function PostHogProvider({ children }: PostHogProviderProps) {
  const pathname = usePathname();

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

    trackPageView(pathname);
  }, [pathname]);

  return <>{children}</>;
}
