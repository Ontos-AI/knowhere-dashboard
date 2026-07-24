"use client";

import {
  requestAcquisitionSessionCapture,
  requestMarketingPageViewCapture,
  shouldCaptureAcquisitionPath,
} from "@lib/acquisition-attribution/client";
import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

export function AcquisitionAttributionProvider() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const search = searchParams.toString();
  const capturedLandingUrlRef = useRef<string | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    if (!shouldCaptureAcquisitionPath(pathname, search)) {
      return;
    }

    const landingUrl = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`;
    if (capturedLandingUrlRef.current === landingUrl) {
      return;
    }

    capturedLandingUrlRef.current = landingUrl;
    const referrer = document.referrer || undefined;

    void (async (): Promise<void> => {
      try {
        const sessionCapture = await requestAcquisitionSessionCapture({
          landingUrl,
          referrer,
        });

        await requestMarketingPageViewCapture({
          acquisitionSessionId: sessionCapture.sessionId,
          landingUrl,
          referrer,
        });
      } catch (error: unknown) {
        console.error("Failed to capture acquisition attribution:", error);
      }
    })();
  }, [pathname, search]);

  return null;
}
