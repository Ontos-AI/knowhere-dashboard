import { trackFileUpload, trackJobCompleted, trackJobCreated, trackJobFailed } from "@lib/posthog";
import type { UsageStatusKind } from "@/app/(dashboard)/usage/_lib/job-status";

export const RECENT_JOB_CREATED_MS = 30 * 60 * 1000;
export const RECENT_JOB_TERMINAL_MS = 24 * 60 * 60 * 1000;
const TRACKED_JOB_EVENTS_KEY = "ph_tracked_job_events";

export type JobTrackingSnapshot = {
  jobId: string;
  date: string;
  statusKind: UsageStatusKind;
  status: string;
  sourceType?: string;
  duration: string;
  durationSeconds?: number;
};

type JobEventKind = "created" | "completed" | "failed";
type TrackedJobEvents = Record<JobEventKind, Set<string>>;

export type JobTrackingState = {
  isInitialized: boolean;
  previousJobs: Map<string, UsageStatusKind>;
  tracked: TrackedJobEvents;
};

const emptyTrackedJobEvents = (): TrackedJobEvents => ({
  created: new Set(),
  completed: new Set(),
  failed: new Set(),
});

export const loadTrackedJobEvents = (): TrackedJobEvents => {
  if (typeof window === "undefined") {
    return emptyTrackedJobEvents();
  }

  try {
    const raw = localStorage.getItem(TRACKED_JOB_EVENTS_KEY);
    if (!raw) {
      return emptyTrackedJobEvents();
    }

    const parsed = JSON.parse(raw) as Partial<Record<JobEventKind, string[]>>;
    return {
      created: new Set(parsed.created ?? []),
      completed: new Set(parsed.completed ?? []),
      failed: new Set(parsed.failed ?? []),
    };
  } catch {
    return emptyTrackedJobEvents();
  }
};

export const persistTrackedJobEvents = (tracked: TrackedJobEvents) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    TRACKED_JOB_EVENTS_KEY,
    JSON.stringify({
      created: Array.from(tracked.created),
      completed: Array.from(tracked.completed),
      failed: Array.from(tracked.failed),
    })
  );
};

export const mergeTrackedJobEvents = (
  tracked: TrackedJobEvents,
  persisted: TrackedJobEvents = loadTrackedJobEvents()
): TrackedJobEvents => ({
  created: new Set([...Array.from(tracked.created), ...Array.from(persisted.created)]),
  completed: new Set([...Array.from(tracked.completed), ...Array.from(persisted.completed)]),
  failed: new Set([...Array.from(tracked.failed), ...Array.from(persisted.failed)]),
});

export const clearTrackedJobEvents = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TRACKED_JOB_EVENTS_KEY);
};

const mapJobSourceType = (sourceType?: string): "direct_upload" | "url" => {
  const normalized = sourceType?.trim().toLowerCase();
  if (normalized === "url" || normalized === "text") {
    return "url";
  }

  return "direct_upload";
};

const parseDurationMs = (durationSeconds?: number, durationLabel?: string) => {
  if (typeof durationSeconds === "number" && !Number.isNaN(durationSeconds)) {
    return Math.round(durationSeconds * 1000);
  }

  if (!durationLabel) {
    return 0;
  }

  const numericValue = Number.parseFloat(durationLabel.replace(/s$/i, ""));
  return Number.isNaN(numericValue) ? 0 : Math.round(numericValue * 1000);
};

const isWithinWindow = (createdAt: string, windowMs: number) => {
  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return false;
  }

  return Date.now() - created < windowMs;
};

const emitJobCreated = (job: JobTrackingSnapshot, tracked: TrackedJobEvents) => {
  if (tracked.created.has(job.jobId)) {
    return false;
  }

  trackJobCreated("kb_management", job.jobId, mapJobSourceType(job.sourceType));
  tracked.created.add(job.jobId);
  return true;
};

const emitJobCompleted = (job: JobTrackingSnapshot, tracked: TrackedJobEvents) => {
  if (tracked.completed.has(job.jobId)) {
    return false;
  }

  trackJobCompleted("kb_management", job.jobId, parseDurationMs(job.durationSeconds, job.duration));
  tracked.completed.add(job.jobId);
  return true;
};

const emitJobFailed = (job: JobTrackingSnapshot, tracked: TrackedJobEvents) => {
  if (tracked.failed.has(job.jobId)) {
    return false;
  }

  trackJobFailed("kb_management", job.jobId, job.status);
  tracked.failed.add(job.jobId);
  return true;
};

const backfillRecentBaselineJob = (job: JobTrackingSnapshot, tracked: TrackedJobEvents) => {
  let didEmit = false;

  if (isWithinWindow(job.date, RECENT_JOB_CREATED_MS)) {
    didEmit = emitJobCreated(job, tracked) || didEmit;
  }

  if (isWithinWindow(job.date, RECENT_JOB_TERMINAL_MS)) {
    if (job.statusKind === "done") {
      didEmit = emitJobCompleted(job, tracked) || didEmit;
    } else if (job.statusKind === "failed") {
      didEmit = emitJobFailed(job, tracked) || didEmit;
    }
  }

  return didEmit;
};

export const notifyJobCreatedFromUpload = (jobId: string, sourceType: "direct_upload" | "url") => {
  const tracked = loadTrackedJobEvents();
  if (tracked.created.has(jobId)) {
    return;
  }

  trackJobCreated("kb_management", jobId, sourceType);
  tracked.created.add(jobId);
  persistTrackedJobEvents(tracked);
};

export const notifyJobFailedFromUpload = (jobId: string, errorMessage: string) => {
  const tracked = loadTrackedJobEvents();
  if (tracked.failed.has(jobId)) {
    return;
  }

  trackJobFailed("kb_management", jobId, errorMessage);
  tracked.failed.add(jobId);
  persistTrackedJobEvents(tracked);
};

export const notifyFileUploadedFromUpload = (
  fileType: string,
  fileSize: number,
  uploadMethod: "direct" | "url"
) => {
  trackFileUpload(fileType, fileSize, uploadMethod);
};

export const processJobsForPosthogTracking = (
  jobs: JobTrackingSnapshot[],
  state: JobTrackingState
): { state: JobTrackingState; didEmit: boolean } => {
  const previousJobs = state.previousJobs;
  const nextJobs = new Map<string, UsageStatusKind>();
  const tracked = mergeTrackedJobEvents(state.tracked);
  let didEmit = false;

  for (const job of jobs) {
    nextJobs.set(job.jobId, job.statusKind);

    if (!state.isInitialized) {
      didEmit = backfillRecentBaselineJob(job, tracked) || didEmit;
      continue;
    }

    const previousStatus = previousJobs.get(job.jobId);

    if (!previousStatus) {
      if (isWithinWindow(job.date, RECENT_JOB_CREATED_MS)) {
        didEmit = emitJobCreated(job, tracked) || didEmit;
      }
      continue;
    }

    if (previousStatus !== "done" && job.statusKind === "done") {
      didEmit = emitJobCompleted(job, tracked) || didEmit;
      continue;
    }

    if (previousStatus !== "failed" && job.statusKind === "failed") {
      didEmit = emitJobFailed(job, tracked) || didEmit;
    }
  }

  return {
    state: {
      isInitialized: true,
      previousJobs: nextJobs,
      tracked,
    },
    didEmit,
  };
};

export const createInitialJobTrackingState = (): JobTrackingState => ({
  isInitialized: false,
  previousJobs: new Map(),
  tracked: loadTrackedJobEvents(),
});
