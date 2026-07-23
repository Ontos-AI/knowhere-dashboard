type CaptureAcquisitionSessionRequest = {
  readonly landingUrl: string;
  readonly referrer?: string;
};

type BindAcquisitionSessionRequest = {
  readonly userId: string;
};

const CAPTURE_PATH_PREFIXES = ["/claw", "/comparison", "/versus"] as const;
const CAPTURE_AUTH_PATHS = new Set(["/forgot-password", "/login", "/register", "/reset-password"]);

export function shouldCaptureAcquisitionPath(pathname: string): boolean {
  if (pathname === "/") {
    return true;
  }

  if (CAPTURE_AUTH_PATHS.has(pathname)) {
    return true;
  }

  return CAPTURE_PATH_PREFIXES.some((prefix: string): boolean => {
    return pathname === prefix || pathname.startsWith(`${prefix}/`);
  });
}

export async function requestAcquisitionSessionCapture(
  input: CaptureAcquisitionSessionRequest
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  await fetch("/api/acquisition-attribution/session", {
    body: JSON.stringify(input),
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
    method: "POST",
  });
}

export async function requestAcquisitionSessionBind(
  input: BindAcquisitionSessionRequest
): Promise<void> {
  if (typeof window === "undefined") {
    return;
  }

  await fetch("/api/acquisition-attribution/bind", {
    body: JSON.stringify(input),
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
    method: "POST",
  });
}
