const PARAMETER_MAX_LENGTH = 255;
const LANDING_PATH_MAX_LENGTH = 2048;
const SESSION_ID_PATTERN = /^[A-Za-z0-9_-]{8,128}$/;

export const ACQUISITION_ATTRIBUTION_COOKIE_NAME = "kh_acquisition_session";
export const ACQUISITION_ATTRIBUTION_TTL_DAYS = 90;
export const ACQUISITION_ATTRIBUTION_TTL_SECONDS = ACQUISITION_ATTRIBUTION_TTL_DAYS * 24 * 60 * 60;

export type AcquisitionCaptureInput = {
  readonly existingSessionId?: string | null;
  readonly landingUrl: string;
  readonly referrer?: string | null;
};

export type AcquisitionBindInput = {
  readonly sessionId?: string | null;
  readonly userId: string;
};

export type MarketingPageViewCaptureInput = {
  readonly acquisitionSessionId?: string | null;
  readonly landingUrl: string;
  readonly referrer?: string | null;
};

export type AcquisitionAttributionSessionInsert = {
  readonly sessionId: string;
  readonly source: string;
  readonly channel: string;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  readonly utmContent: string | null;
  readonly utmTerm: string | null;
  readonly oppref: string | null;
  readonly landingPath: string;
  readonly referrerHost: string | null;
  readonly capturedAt: Date;
};

export type MarketingPageViewInsert = {
  readonly viewId: string;
  readonly acquisitionSessionId: string | null;
  readonly source: string;
  readonly channel: string;
  readonly utmSource: string | null;
  readonly utmMedium: string | null;
  readonly utmCampaign: string | null;
  readonly utmContent: string | null;
  readonly utmTerm: string | null;
  readonly oppref: string | null;
  readonly visitedPath: string;
  readonly referrerHost: string | null;
  readonly viewedAt: Date;
};

export type AcquisitionAttributionStoredSession = {
  readonly sessionId: string;
  readonly boundUserId: string | null;
  readonly capturedAt: Date;
};

export type AcquisitionAttributionRepository = {
  readonly bindSessionToUser: (input: {
    readonly boundAt: Date;
    readonly sessionId: string;
    readonly userId: string;
  }) => Promise<boolean>;
  readonly findSessionById: (
    sessionId: string
  ) => Promise<AcquisitionAttributionStoredSession | null>;
  readonly insertSession: (session: AcquisitionAttributionSessionInsert) => Promise<boolean>;
  readonly insertPageView: (pageView: MarketingPageViewInsert) => Promise<boolean>;
};

export type AcquisitionCaptureResult =
  | {
      readonly captured: false;
      readonly reason: "duplicate";
      readonly sessionId: string;
    }
  | {
      readonly captured: false;
      readonly reason: "invalid_landing_url";
      readonly sessionId: null;
    }
  | {
      readonly captured: true;
      readonly sessionId: string;
    };

export type AcquisitionBindResult =
  | {
      readonly bound: false;
      readonly reason: "already_bound" | "bound_to_other_user" | "missing_session" | "not_found";
      readonly sessionId: string | null;
    }
  | {
      readonly bound: true;
      readonly sessionId: string;
    };

export type MarketingPageViewCaptureResult =
  | {
      readonly captured: false;
      readonly reason: "invalid_landing_url";
      readonly viewId: null;
      readonly acquisitionSessionId: null;
    }
  | {
      readonly captured: true;
      readonly viewId: string;
      readonly acquisitionSessionId: string | null;
    };

export type AcquisitionAttributionService = {
  readonly bindAcquisitionSessionToUser: (
    input: AcquisitionBindInput
  ) => Promise<AcquisitionBindResult>;
  readonly captureAcquisitionSession: (
    input: AcquisitionCaptureInput
  ) => Promise<AcquisitionCaptureResult>;
  readonly captureMarketingPageView: (
    input: MarketingPageViewCaptureInput
  ) => Promise<MarketingPageViewCaptureResult>;
};

type AcquisitionAttributionServiceOptions = {
  readonly createSessionId: () => string;
  readonly createViewId: () => string;
  readonly getNow: () => Date;
  readonly repository: AcquisitionAttributionRepository;
};

type NormalizedAcquisitionCapture = Omit<
  AcquisitionAttributionSessionInsert,
  "capturedAt" | "sessionId"
>;

function normalizeNullableText(value: string | null | undefined): string | null {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return null;
  }

  return trimmedValue.slice(0, PARAMETER_MAX_LENGTH);
}

function normalizeSlugText(value: string | null | undefined): string | null {
  return normalizeNullableText(value)?.toLowerCase() ?? null;
}

function normalizeSessionId(sessionId: string | null | undefined): string | null {
  const trimmedSessionId = sessionId?.trim();
  if (!trimmedSessionId || !SESSION_ID_PATTERN.test(trimmedSessionId)) {
    return null;
  }

  return trimmedSessionId;
}

function parseHttpUrl(value: string): URL | null {
  try {
    const parsedUrl = new URL(value);
    if (parsedUrl.protocol !== "http:" && parsedUrl.protocol !== "https:") {
      return null;
    }

    return parsedUrl;
  } catch {
    return null;
  }
}

function normalizeLandingPath(parsedLandingUrl: URL): string {
  const landingPath = parsedLandingUrl.pathname || "/";
  return landingPath.slice(0, LANDING_PATH_MAX_LENGTH);
}

function normalizeReferrerHost(
  referrer: string | null | undefined,
  landingHost: string
): string | null {
  if (!referrer) {
    return null;
  }

  const parsedReferrer = parseHttpUrl(referrer);
  if (!parsedReferrer) {
    return null;
  }

  const referrerHost = parsedReferrer.host.toLowerCase();
  if (!referrerHost || referrerHost === landingHost.toLowerCase()) {
    return null;
  }

  return referrerHost.slice(0, PARAMETER_MAX_LENGTH);
}

function deriveSource({
  oppref,
  referrerHost,
  utmSource,
}: {
  readonly oppref: string | null;
  readonly referrerHost: string | null;
  readonly utmSource: string | null;
}): string {
  if (utmSource) {
    return utmSource;
  }

  if (oppref) {
    return "openai";
  }

  if (referrerHost) {
    return referrerHost;
  }

  return "direct";
}

function deriveChannel({
  oppref,
  referrerHost,
  utmMedium,
}: {
  readonly oppref: string | null;
  readonly referrerHost: string | null;
  readonly utmMedium: string | null;
}): string {
  if (utmMedium) {
    return utmMedium;
  }

  if (oppref) {
    return "paid";
  }

  if (referrerHost) {
    return "referral";
  }

  return "direct";
}

function normalizeCaptureInput(
  input: AcquisitionCaptureInput | MarketingPageViewCaptureInput
): NormalizedAcquisitionCapture | null {
  const parsedLandingUrl = parseHttpUrl(input.landingUrl);
  if (!parsedLandingUrl) {
    return null;
  }

  const searchParams = parsedLandingUrl.searchParams;
  const utmSource = normalizeSlugText(searchParams.get("utm_source"));
  const utmMedium = normalizeSlugText(searchParams.get("utm_medium"));
  const utmCampaign = normalizeNullableText(searchParams.get("utm_campaign"));
  const utmContent = normalizeNullableText(searchParams.get("utm_content"));
  const utmTerm = normalizeNullableText(searchParams.get("utm_term"));
  const oppref = normalizeNullableText(searchParams.get("oppref"));
  const referrerHost = normalizeReferrerHost(input.referrer, parsedLandingUrl.host);
  const source = deriveSource({ oppref, referrerHost, utmSource });
  const channel = deriveChannel({ oppref, referrerHost, utmMedium });

  return {
    channel,
    landingPath: normalizeLandingPath(parsedLandingUrl),
    oppref,
    referrerHost,
    source,
    utmCampaign,
    utmContent,
    utmMedium,
    utmSource,
    utmTerm,
  };
}

export function createAcquisitionAttributionService({
  createSessionId,
  createViewId,
  getNow,
  repository,
}: AcquisitionAttributionServiceOptions): AcquisitionAttributionService {
  return {
    bindAcquisitionSessionToUser: async (
      input: AcquisitionBindInput
    ): Promise<AcquisitionBindResult> => {
      const sessionId = normalizeSessionId(input.sessionId);
      if (!sessionId) {
        return {
          bound: false,
          reason: "missing_session",
          sessionId: null,
        };
      }

      const boundAt = getNow();
      const didBind = await repository.bindSessionToUser({
        boundAt,
        sessionId,
        userId: input.userId,
      });

      if (didBind) {
        return {
          bound: true,
          sessionId,
        };
      }

      const existingSession = await repository.findSessionById(sessionId);
      if (!existingSession) {
        return {
          bound: false,
          reason: "not_found",
          sessionId,
        };
      }

      return {
        bound: false,
        reason:
          existingSession.boundUserId === input.userId ? "already_bound" : "bound_to_other_user",
        sessionId,
      };
    },
    captureAcquisitionSession: async (
      input: AcquisitionCaptureInput
    ): Promise<AcquisitionCaptureResult> => {
      const capture = normalizeCaptureInput(input);
      if (!capture) {
        return {
          captured: false,
          reason: "invalid_landing_url",
          sessionId: null,
        };
      }

      const existingSessionId = normalizeSessionId(input.existingSessionId);
      if (existingSessionId) {
        const existingSession = await repository.findSessionById(existingSessionId);
        if (existingSession) {
          return {
            captured: false,
            reason: "duplicate",
            sessionId: existingSession.sessionId,
          };
        }
      }

      const sessionId = existingSessionId ?? createSessionId();
      const didInsert = await repository.insertSession({
        ...capture,
        capturedAt: getNow(),
        sessionId,
      });

      return didInsert
        ? {
            captured: true,
            sessionId,
          }
        : {
            captured: false,
            reason: "duplicate",
            sessionId,
          };
    },
    captureMarketingPageView: async (
      input: MarketingPageViewCaptureInput
    ): Promise<MarketingPageViewCaptureResult> => {
      const capture = normalizeCaptureInput(input);
      if (!capture) {
        return {
          captured: false,
          reason: "invalid_landing_url",
          viewId: null,
          acquisitionSessionId: null,
        };
      }

      const acquisitionSessionId = normalizeSessionId(input.acquisitionSessionId);
      const viewId = createViewId();
      const didInsert = await repository.insertPageView({
        acquisitionSessionId,
        channel: capture.channel,
        oppref: capture.oppref,
        referrerHost: capture.referrerHost,
        source: capture.source,
        utmCampaign: capture.utmCampaign,
        utmContent: capture.utmContent,
        utmMedium: capture.utmMedium,
        utmSource: capture.utmSource,
        utmTerm: capture.utmTerm,
        viewId,
        viewedAt: getNow(),
        visitedPath: capture.landingPath,
      });

      if (!didInsert) {
        return {
          captured: false,
          reason: "invalid_landing_url",
          viewId: null,
          acquisitionSessionId: null,
        };
      }

      return {
        captured: true,
        viewId,
        acquisitionSessionId,
      };
    },
  };
}
