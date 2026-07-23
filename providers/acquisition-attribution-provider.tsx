"use client";

import {
  requestAcquisitionSessionCapture,
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

    if (!shouldCaptureAcquisitionPath(pathname)) {
      return;
    }

    const landingUrl = `${window.location.origin}${pathname}${search ? `?${search}` : ""}`;
    if (capturedLandingUrlRef.current === landingUrl) {
      return;
    }

    capturedLandingUrlRef.current = landingUrl;

    void requestAcquisitionSessionCapture({
      landingUrl,
      referrer: document.referrer || undefined,
    }).catch((error: unknown): void => {
      console.error("Failed to capture acquisition attribution session:", error);
    });
  }, [pathname, search]);

  return null;
}
