export type UsageStatusKind = "done" | "failed" | "running" | "pending" | "waiting-file" | "other";

type UsageStatusInfo = {
  kind: UsageStatusKind;
  label: string;
};

const KNOWN_STATUS_INFO: Record<string, UsageStatusInfo> = {
  done: { kind: "done", label: "Done" },
  succeeded: { kind: "done", label: "Done" },
  failed: { kind: "failed", label: "Failed" },
  error: { kind: "failed", label: "Failed" },
  running: { kind: "running", label: "Running" },
  pending: { kind: "pending", label: "Pending" },
  "waiting-file": { kind: "waiting-file", label: "Waiting File" },
  waiting_file: { kind: "waiting-file", label: "Waiting File" },
};

function humanizeBackendStatus(status: string): string {
  return status
    .split(/[-_]/)
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getUsageStatusInfo(status?: string): UsageStatusInfo {
  const normalizedStatus = status?.trim().toLowerCase();
  if (!normalizedStatus) {
    return {
      kind: "other",
      label: "Unknown",
    };
  }

  return (
    KNOWN_STATUS_INFO[normalizedStatus] ?? {
      kind: "other",
      label: humanizeBackendStatus(normalizedStatus),
    }
  );
}
