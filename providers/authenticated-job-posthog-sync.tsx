"use client";

import { useJobPosthogTracking } from "@app/(dashboard)/usage/_hooks/use-job-posthog-tracking";
import { useJobs } from "@app/(dashboard)/usage/_hooks/use-jobs";
import { isPostHogEnabled } from "@lib/posthog";
import { authClient } from "@/lib/better-auth-client";

export function AuthenticatedJobPosthogSync() {
  const { data: session, isPending } = authClient.useSession();
  const shouldTrack = Boolean(session?.user?.id) && !isPending && isPostHogEnabled;

  const { data } = useJobs({
    page: 1,
    pageSize: 20,
    recentDays: 1,
    enabled: shouldTrack,
  });

  useJobPosthogTracking(data?.jobs ?? [], shouldTrack && data !== undefined);

  return null;
}
