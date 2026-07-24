"use client";

import { useJobPosthogTracking } from "@app/(dashboard)/usage/_hooks/use-job-posthog-tracking";
import { useJobs } from "@app/(dashboard)/usage/_hooks/use-jobs";
import { isPostHogEnabled } from "@lib/posthog";
import { useAppConfigContext } from "@providers/config-provider";
import { authClient } from "@/lib/better-auth-client";

export function AuthenticatedJobAnalyticsSync() {
  const { data: session, isPending } = authClient.useSession();
  const { gaMeasurementId } = useAppConfigContext();
  const hasProductAnalyticsAdapter = isPostHogEnabled || Boolean(gaMeasurementId);
  const shouldTrack = Boolean(session?.user?.id) && !isPending && hasProductAnalyticsAdapter;

  const { data } = useJobs({
    enabled: shouldTrack,
    page: 1,
    pageSize: 20,
    recentDays: 1,
  });

  useJobPosthogTracking(data?.jobs ?? [], shouldTrack && data !== undefined);

  return null;
}
