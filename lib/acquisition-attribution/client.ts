type CaptureAcquisitionSessionRequest = {
  readonly landingUrl: string;
  readonly referrer?: string;
};

type CaptureMarketingPageViewRequest = {
  readonly acquisitionSessionId?: string | null;
  readonly landingUrl: string;
  readonly referrer?: string;
};

type BindAcquisitionSessionRequest = {
  readonly userId: string;
};

type AcquisitionSessionCaptureResponse = {
  readonly sessionId: string | null;
};

type MarketingPageViewCaptureResponse = {
  readonly viewId: string | null;
  readonly acquisitionSessionId: string | null;
};

const CAPTURE_LANDING_PATH_PREFIXES = ["/claw", "/comparison", "/versus"] as const;
const CAPTURE_EXPLICIT_PATHS = new Set<string>(["/", "/github"]);
const CAMPAIGN_QUERY_KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_content",
  "utm_term",
  "oppref",
] as const;

export function hasCampaignQueryParams(search: string): boolean {
  const normalizedSearch = search.startsWith("?") ? search.slice(1) : search;
  if (!normalizedSearch) {
    return false;
  }

  const searchParams = new URLSearchParams(normalizedSearch);
  return CAMPAIGN_QUERY_KEYS.some((key) => {
    const value = searchParams.get(key);
    return Boolean(value?.trim());
  });
}

export function shouldCaptureAcquisitionPath(pathname: string, search = ""): boolean {
  if (CAPTURE_EXPLICIT_PATHS.has(pathname)) {
    return true;
  }

  if (
    CAPTURE_LANDING_PATH_PREFIXES.some((prefix: string): boolean => {
      return pathname === prefix || pathname.startsWith(`${prefix}/`);
    })
  ) {
    return true;
  }

  return hasCampaignQueryParams(search);
}

export async function requestAcquisitionSessionCapture(
  input: CaptureAcquisitionSessionRequest
): Promise<AcquisitionSessionCaptureResponse> {
  if (typeof window === "undefined") {
    return { sessionId: null };
  }

  const response = await fetch("/api/acquisition-attribution/session", {
    body: JSON.stringify(input),
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
    method: "POST",
  });

  if (!response.ok) {
    return { sessionId: null };
  }

  const payload = (await response.json().catch(() => null)) as {
    sessionId?: string | null;
  } | null;

  return {
    sessionId: typeof payload?.sessionId === "string" ? payload.sessionId : null,
  };
}

export async function requestMarketingPageViewCapture(
  input: CaptureMarketingPageViewRequest
): Promise<MarketingPageViewCaptureResponse> {
  if (typeof window === "undefined") {
    return { viewId: null, acquisitionSessionId: null };
  }

  const response = await fetch("/api/acquisition-attribution/page-view", {
    body: JSON.stringify({
      acquisitionSessionId: input.acquisitionSessionId ?? undefined,
      landingUrl: input.landingUrl,
      referrer: input.referrer,
    }),
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
    method: "POST",
  });

  if (!response.ok) {
    return { viewId: null, acquisitionSessionId: null };
  }

  const payload = (await response.json().catch(() => null)) as {
    viewId?: string | null;
    acquisitionSessionId?: string | null;
  } | null;

  return {
    viewId: typeof payload?.viewId === "string" ? payload.viewId : null,
    acquisitionSessionId:
      typeof payload?.acquisitionSessionId === "string" ? payload.acquisitionSessionId : null,
  };
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
