import { orpcClient, orpcQuery } from "@lib/orpc/client";
import type { JobResponse } from "@server/external-api/jobs";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { UsageRecord } from "@/app/(dashboard)/usage/_components/usage-table";
import { getUsageStatusInfo } from "@/app/(dashboard)/usage/_lib/job-status";

type UseJobsParams = {
  page: number;
  pageSize: number;
  recentDays?: number;
  startTime?: string;
  endTime?: string;
  enabled?: boolean;
};

/**
 * Hook to fetch jobs list with pagination
 * Uses keepPreviousData to prevent flickering during pagination
 */
export function useJobs(params: UseJobsParams) {
  const { enabled = true, ...queryParams } = params;

  return useQuery({
    queryKey: ["jobs", queryParams],
    queryFn: () =>
      orpcClient.jobs.list({
        page: queryParams.page,
        page_size: queryParams.pageSize,
        recent_days: queryParams.recentDays as 1 | 7 | 30,
        start_time: queryParams.startTime,
        end_time: queryParams.endTime,
      }),
    select: (data) => ({
      jobs: data.jobs.map(mapJobToUsageRecord),
      total: data.total || 0,
    }),
    enabled,
    placeholderData: keepPreviousData, // Prevent flickering during pagination
    staleTime: 0, // Real-time data, immediately stale
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: true,
    refetchInterval: (query) => {
      const data = query.state.data as { jobs: UsageRecord[]; total: number } | undefined;
      const jobs = data?.jobs ?? [];
      return jobs.some(
        (job) =>
          job.statusKind === "running" ||
          job.statusKind === "pending" ||
          job.statusKind === "waiting-file"
      )
        ? 5000
        : false;
    },
  });
}

/**
 * Hook to create a new job
 * Uses oRPC mutation
 */
export function useCreateJob() {
  return useMutation({
    ...orpcQuery.jobs.create.mutationOptions(),
  });
}

/**
 * Hook to confirm upload completion
 * Uses oRPC mutation
 */
export function useConfirmUpload() {
  return useMutation({
    ...orpcQuery.jobs.confirmUpload.mutationOptions(),
  });
}

/**
 * Hook to get job status
 * Uses oRPC mutation (not query because it's called imperatively)
 */
export function useGetJobStatus() {
  return useMutation({
    ...orpcQuery.jobs.getStatus.mutationOptions(),
  });
}

/**
 * Hook to fetch ALL jobs for CSV export (no pagination limit)
 * Loops through all pages using a safe page size to avoid hitting external API limits
 */
export function useExportAllJobs() {
  return useMutation({
    mutationFn: async (params: {
      total: number;
      recentDays?: number;
      startTime?: string;
      endTime?: string;
    }) => {
      if (params.total === 0) return [];

      // Use a conservative page size that the external API is known to support
      const PAGE_SIZE = 100;
      const allJobs: UsageRecord[] = [];
      let page = 1;

      while (true) {
        const data = await orpcClient.jobs.list({
          page,
          page_size: PAGE_SIZE,
          recent_days: params.recentDays as 1 | 7 | 30 | undefined,
          start_time: params.startTime,
          end_time: params.endTime,
        });

        allJobs.push(...data.jobs.map(mapJobToUsageRecord));

        // Stop when all records are collected or the API returns an empty page
        if (allJobs.length >= data.total || data.jobs.length === 0) break;
        page++;
      }

      return allJobs;
    },
  });
}

/**
 * Helper function to map job response to usage record
 */
function mapJobToUsageRecord(job: JobResponse): UsageRecord {
  const statusInfo = getUsageStatusInfo(job.status);

  let fileType = job.file_extension || job.source_type?.toUpperCase() || "UNKNOWN";
  if (!job.file_extension && (fileType === "FILE" || fileType === "URL")) {
    const metadataFileName = job.result_metadata?.file_name as string | undefined;
    const fileName = job.file_name || metadataFileName || "";
    if (fileName) {
      const ext = fileName.split(".").pop()?.toUpperCase();
      if (ext) fileType = ext;
    }
  }

  const metadataFileName = job.result_metadata?.file_name as string | undefined;
  const fileName = job.file_name || metadataFileName || job.source_type || "Unknown";

  return {
    id: job.job_id,
    date: job.created_at,
    jobId: job.job_id,
    fileName: fileName,
    fileType: fileType,
    model: job.model || (job.result_metadata?.model as string | undefined) || "-",
    pages: (job.result_metadata?.pages as number | undefined) || 0,
    status: statusInfo.label,
    statusKind: statusInfo.kind,
    duration: job.duration_seconds
      ? `${job.duration_seconds.toFixed(2)}s`
      : (job.result_metadata?.duration as string | undefined) || "-",
    durationSeconds: job.duration_seconds,
    sourceType: job.source_type,
    cost: job.credits_spent ?? (job.result_metadata?.cost as number | undefined) ?? 0,
    apiKey: "-",
    resultUrl: job.result_url,
  };
}
