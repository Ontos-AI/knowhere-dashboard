import { orpcClient, orpcQuery } from "@lib/orpc/client";
import type { JobResponse } from "@server/external-api/jobs";
import { keepPreviousData, useMutation, useQuery } from "@tanstack/react-query";
import type { UsageRecord } from "@/app/(dashboard)/usage/_components/usage-table";

type UseJobsParams = {
  page: number;
  pageSize: number;
  recentDays?: number;
  startTime?: string;
  endTime?: string;
};

/**
 * Hook to fetch jobs list with pagination
 * Uses keepPreviousData to prevent flickering during pagination
 */
export function useJobs(params: UseJobsParams) {
  return useQuery({
    queryKey: ["jobs", params],
    queryFn: () =>
      orpcClient.jobs.list({
        page: params.page,
        page_size: params.pageSize,
        recent_days: params.recentDays as 1 | 7 | 30,
        start_time: params.startTime,
        end_time: params.endTime,
      }),
    select: (data) => ({
      jobs: data.jobs.map(mapJobToUsageRecord),
      total: data.total || 0,
    }),
    placeholderData: keepPreviousData, // Prevent flickering during pagination
    staleTime: 0, // Real-time data, immediately stale
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
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
 * Helper function to map job response to usage record
 */
function mapJobToUsageRecord(job: JobResponse): UsageRecord {
  let status: UsageRecord["status"] = "Running";
  if (job.status === "done" || job.status === "succeeded") status = "Done";
  else if (job.status === "failed" || job.status === "error") status = "Failed";

  let fileType = job.file_extension || job.source_type?.toUpperCase() || "UNKNOWN";
  if (!job.file_extension && (fileType === "FILE" || fileType === "URL")) {
    const fileName = job.file_name || job.result_metadata?.file_name || "";
    if (fileName) {
      const ext = fileName.split(".").pop()?.toUpperCase();
      if (ext) fileType = ext;
    }
  }

  const fileName = job.file_name || job.result_metadata?.file_name || job.source_type || "Unknown";

  return {
    id: job.job_id,
    date: job.created_at,
    jobId: job.job_id,
    fileName: fileName,
    fileType: fileType,
    model: job.model || job.result_metadata?.model || "-",
    pages: job.result_metadata?.pages || 0,
    ocr: job.ocr_enabled ?? job.result_metadata?.ocr ?? false,
    status: status,
    duration: job.duration_seconds
      ? `${job.duration_seconds.toFixed(2)}s`
      : job.result_metadata?.duration || "-",
    cost: job.credits_spent ?? job.result_metadata?.cost ?? 0,
    apiKey: "-",
    resultUrl: job.result_url,
  };
}
