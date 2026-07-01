import { describe, expect, it, vi } from "vitest";

vi.mock("@lib/posthog", () => ({
  trackJobCreated: vi.fn(),
  trackJobCompleted: vi.fn(),
  trackJobFailed: vi.fn(),
  trackFileUpload: vi.fn(),
}));

import {
  createInitialJobTrackingState,
  processJobsForPosthogTracking,
  RECENT_JOB_CREATED_MS,
} from "@/lib/job-posthog-tracking";

describe("job posthog tracking", () => {
  it("does not emit job_created for old jobs discovered via pagination", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 5, 26, 10, 0, 0));

    const oldCreatedAt = new Date(Date.now() - RECENT_JOB_CREATED_MS - 60_000).toISOString();
    const state = createInitialJobTrackingState();
    state.isInitialized = true;

    const result = processJobsForPosthogTracking(
      [
        {
          jobId: "job-old",
          date: oldCreatedAt,
          statusKind: "done",
          status: "Done",
          duration: "1.00s",
        },
      ],
      state
    );

    expect(result.didEmit).toBe(false);
    expect(result.state.tracked.created.size).toBe(0);

    vi.useRealTimers();
  });

  it("backfills recent terminal jobs on baseline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 5, 26, 10, 0, 0));

    const state = createInitialJobTrackingState();
    const createdAt = new Date(Date.UTC(2026, 5, 26, 8, 0, 0)).toISOString();

    const result = processJobsForPosthogTracking(
      [
        {
          jobId: "job-recent-done",
          date: createdAt,
          statusKind: "done",
          status: "Done",
          duration: "2.50s",
          durationSeconds: 2.5,
        },
      ],
      state
    );

    expect(result.didEmit).toBe(true);
    expect(result.state.tracked.created.size).toBe(0);
    expect(result.state.tracked.completed.size).toBe(1);

    vi.useRealTimers();
  });

  it("emits job_created only for recent jobs after baseline", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 5, 26, 10, 0, 0));

    const state = createInitialJobTrackingState();
    state.isInitialized = true;

    const recentCreatedAt = new Date(Date.UTC(2026, 5, 26, 9, 55, 0)).toISOString();
    const result = processJobsForPosthogTracking(
      [
        {
          jobId: "job-new",
          date: recentCreatedAt,
          statusKind: "running",
          status: "Running",
          duration: "-",
          sourceType: "url",
        },
      ],
      state
    );

    expect(result.didEmit).toBe(true);
    expect(result.state.tracked.created.size).toBe(1);

    vi.useRealTimers();
  });

  it("does not re-emit job_created after upload notification persisted tracked ids", () => {
    vi.useFakeTimers();
    vi.setSystemTime(Date.UTC(2026, 5, 26, 10, 0, 0));

    const storage = new Map<string, string>();
    storage.set(
      "ph_tracked_job_events",
      JSON.stringify({ created: ["job-uploaded"], completed: [], failed: [] })
    );
    const localStorageMock = {
      getItem: (key: string) => storage.get(key) ?? null,
      setItem: (key: string, value: string) => {
        storage.set(key, value);
      },
      removeItem: (key: string) => {
        storage.delete(key);
      },
    };
    vi.stubGlobal("window", { localStorage: localStorageMock });
    vi.stubGlobal("localStorage", localStorageMock);

    const state = createInitialJobTrackingState();
    state.isInitialized = true;
    state.tracked = {
      created: new Set(),
      completed: new Set(),
      failed: new Set(),
    };

    const recentCreatedAt = new Date(Date.UTC(2026, 5, 26, 9, 55, 0)).toISOString();
    const result = processJobsForPosthogTracking(
      [
        {
          jobId: "job-uploaded",
          date: recentCreatedAt,
          statusKind: "running",
          status: "Running",
          duration: "-",
          sourceType: "direct_upload",
        },
      ],
      state
    );

    expect(result.didEmit).toBe(false);
    expect(result.state.tracked.created.has("job-uploaded")).toBe(true);

    vi.unstubAllGlobals();
    vi.useRealTimers();
  });
});
