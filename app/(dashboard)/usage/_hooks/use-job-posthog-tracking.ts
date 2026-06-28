"use client";

import {
  createInitialJobTrackingState,
  persistTrackedJobEvents,
  processJobsForPosthogTracking,
} from "@lib/job-posthog-tracking";
import { useEffect, useRef } from "react";
import type { UsageRecord } from "@/app/(dashboard)/usage/_components/usage-table";

export function useJobPosthogTracking(jobs: UsageRecord[]) {
  const stateRef = useRef(createInitialJobTrackingState());

  useEffect(() => {
    const result = processJobsForPosthogTracking(jobs, stateRef.current);
    stateRef.current = result.state;

    if (result.didEmit) {
      persistTrackedJobEvents(result.state.tracked);
    }
  }, [jobs]);
}
