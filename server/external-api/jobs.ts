import { jwtRequest } from "@server/external-api/request";

// ============================================
// 类型定义
// ============================================

export type ParsingParams = {
  [key: string]: unknown;
};

export type JobCreate = {
  source_type: string;
  file?: unknown;
  file_name?: string;
  url?: string;
  text?: string;
  data_id?: string;
  parsing_params?: ParsingParams;
  webhook?: {
    url: string;
    secret: string;
  };
  webhook_url?: string;
  result_mode?: "auto" | "inline" | "url";
  options?: Record<string, unknown>;
};

export type JobResponse = {
  job_id: string;
  status: string;
  source_type: string;
  data_id?: string;
  created_at: string;
  result_mode: "auto" | "inline" | "url";

  file_name?: string;
  file_extension?: string;
  model?: string;
  ocr_enabled?: boolean;
  duration_seconds?: number;
  credits_spent?: number;
  result_url_expires_at?: string;

  // waiting-file 状态
  upload_url?: string;
  upload_headers?: Record<string, string>;
  expires_in?: number;

  // running 状态
  progress?: Record<string, unknown>;

  // done 状态
  result?: Record<string, unknown>;
  result_url?: string;
  result_metadata?: Record<string, unknown>;

  // failed 状态
  error?: Record<string, unknown>;
};

export type JobStatus = {
  job_id: string;
  status: string;
  source_type: string;
  data_id?: string;
  created_at: string;
  updated_at?: string;
  result_mode: "auto" | "inline" | "url";

  current_state?: string;
  progress?: Record<string, unknown>;
  error?: Record<string, unknown>;

  result?: Record<string, unknown>;
  result_url?: string;
  result_metadata?: Record<string, unknown>;

  file_path?: string;
  s3_key?: string;
  webhook_url?: string;
  webhook_enabled: boolean;
};

export type JobList = {
  jobs: JobResponse[];
  total: number;
  page: number;
  page_size: number;
};

// ============================================
// 任务管理函数
// ============================================

export async function createJob({
  userId,
  data,
}: {
  userId: string;
  data: JobCreate;
}): Promise<JobResponse> {
  const { file, ...jobData } = data;
  return jwtRequest({ method: "POST", path: "/v1/jobs", userId, body: jobData });
}

export async function confirmUpload({
  userId,
  jobId,
}: {
  userId: string;
  jobId: string;
}): Promise<JobResponse> {
  return jwtRequest({ method: "POST", path: `/v1/jobs/${jobId}/confirm-upload`, userId });
}

export async function getJobStatus({
  userId,
  jobId,
}: {
  userId: string;
  jobId: string;
}): Promise<JobStatus> {
  return jwtRequest({ method: "GET", path: `/v1/jobs/${jobId}`, userId });
}

export async function listJobs({
  userId,
  params,
}: {
  userId: string;
  params?: {
    page?: number;
    page_size?: number;
    status?: string;
    job_type?: string;
    recent_days?: 1 | 7 | 30;
    start_time?: string;
    end_time?: string;
  };
}): Promise<JobList> {
  const queryParams = new URLSearchParams();
  if (params?.page) queryParams.append("page", params.page.toString());
  if (params?.page_size) queryParams.append("page_size", params.page_size.toString());
  if (params?.status) queryParams.append("status", params.status);
  if (params?.recent_days) queryParams.append("recent_days", params.recent_days.toString());
  if (params?.start_time) queryParams.append("start_time", params.start_time);
  if (params?.end_time) queryParams.append("end_time", params.end_time);

  const query = queryParams.toString();
  return jwtRequest({ method: "GET", path: `/v1/jobs/page${query ? `?${query}` : ""}`, userId });
}
