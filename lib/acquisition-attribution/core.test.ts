import { describe, expect, it } from "vitest";
import {
  type AcquisitionAttributionRepository,
  type AcquisitionAttributionSessionInsert,
  createAcquisitionAttributionService,
  type MarketingPageViewInsert,
} from "@/lib/acquisition-attribution/core";

function createMemoryRepository(): {
  readonly pageViews: MarketingPageViewInsert[];
  readonly repository: AcquisitionAttributionRepository;
  readonly sessions: Map<
    string,
    AcquisitionAttributionSessionInsert & { boundUserId: string | null }
  >;
} {
  const sessions = new Map<
    string,
    AcquisitionAttributionSessionInsert & { boundUserId: string | null }
  >();
  const pageViews: MarketingPageViewInsert[] = [];

  return {
    pageViews,
    repository: {
      bindSessionToUser: async ({ boundAt: _boundAt, sessionId, userId }): Promise<boolean> => {
        const session = sessions.get(sessionId);
        if (!session || session.boundUserId !== null) {
          return false;
        }

        sessions.set(sessionId, {
          ...session,
          boundUserId: userId,
        });
        return true;
      },
      findSessionById: async (sessionId: string) => {
        const session = sessions.get(sessionId);
        if (!session) {
          return null;
        }

        return {
          boundUserId: session.boundUserId,
          capturedAt: session.capturedAt,
          sessionId: session.sessionId,
        };
      },
      insertPageView: async (pageView: MarketingPageViewInsert): Promise<boolean> => {
        pageViews.push(pageView);
        return true;
      },
      insertSession: async (session: AcquisitionAttributionSessionInsert): Promise<boolean> => {
        if (sessions.has(session.sessionId)) {
          return false;
        }

        sessions.set(session.sessionId, {
          ...session,
          boundUserId: null,
        });
        return true;
      },
    },
    sessions,
  };
}

describe("acquisition attribution", () => {
  it("captures first-touch landing data once and does not overwrite it", async () => {
    const { repository, sessions } = createMemoryRepository();
    const service = createAcquisitionAttributionService({
      createSessionId: (): string => "session_first",
      createViewId: (): string => "view_unused",
      getNow: (): Date => new Date("2026-07-23T00:00:00.000Z"),
      repository,
    });

    const firstCapture = await service.captureAcquisitionSession({
      landingUrl:
        "https://knowhereto.ai/?utm_source=OpenAI&utm_medium=Paid_Search&utm_campaign=launch&oppref=click_123",
      referrer: "https://chatgpt.com/search",
    });
    const duplicateCapture = await service.captureAcquisitionSession({
      existingSessionId: "session_first",
      landingUrl: "https://knowhereto.ai/claw?utm_source=google&utm_campaign=overwrite",
      referrer: "https://google.com/search",
    });

    expect(firstCapture).toEqual({ captured: true, sessionId: "session_first" });
    expect(duplicateCapture).toEqual({
      captured: false,
      reason: "duplicate",
      sessionId: "session_first",
    });
    expect(sessions.size).toBe(1);
    expect(sessions.get("session_first")).toMatchObject({
      channel: "paid_search",
      landingPath: "/",
      oppref: "click_123",
      referrerHost: "chatgpt.com",
      source: "openai",
      utmCampaign: "launch",
      utmMedium: "paid_search",
      utmSource: "openai",
    });
  });

  it("binds a signup user exactly once", async () => {
    const { repository, sessions } = createMemoryRepository();
    const service = createAcquisitionAttributionService({
      createSessionId: (): string => "session_signup",
      createViewId: (): string => "view_unused",
      getNow: (): Date => new Date("2026-07-23T00:00:00.000Z"),
      repository,
    });

    await service.captureAcquisitionSession({
      landingUrl: "https://knowhereto.ai/?utm_source=openai",
    });

    const firstBind = await service.bindAcquisitionSessionToUser({
      sessionId: "session_signup",
      userId: "user_123",
    });
    const secondBind = await service.bindAcquisitionSessionToUser({
      sessionId: "session_signup",
      userId: "user_456",
    });

    expect(firstBind).toEqual({ bound: true, sessionId: "session_signup" });
    expect(secondBind).toEqual({
      bound: false,
      reason: "bound_to_other_user",
      sessionId: "session_signup",
    });
    expect(sessions.get("session_signup")?.boundUserId).toBe("user_123");
  });

  it("records raw pageviews even when the first-touch session already exists", async () => {
    const { pageViews, repository } = createMemoryRepository();
    let viewCounter = 0;
    const service = createAcquisitionAttributionService({
      createSessionId: (): string => "session_first",
      createViewId: (): string => `view_${++viewCounter}`,
      getNow: (): Date => new Date("2026-07-23T00:00:00.000Z"),
      repository,
    });

    await service.captureAcquisitionSession({
      landingUrl: "https://knowhereto.ai/?utm_source=reddit",
    });

    const firstPageView = await service.captureMarketingPageView({
      acquisitionSessionId: "session_first",
      landingUrl: "https://knowhereto.ai/reddit?utm_source=reddit&utm_campaign=launch",
      referrer: "https://reddit.com/r/something",
    });
    const secondPageView = await service.captureMarketingPageView({
      acquisitionSessionId: "session_first",
      landingUrl: "https://knowhereto.ai/reddit?utm_source=reddit&utm_campaign=launch",
      referrer: "https://reddit.com/r/something",
    });

    expect(firstPageView).toEqual({
      captured: true,
      viewId: "view_1",
      acquisitionSessionId: "session_first",
    });
    expect(secondPageView).toEqual({
      captured: true,
      viewId: "view_2",
      acquisitionSessionId: "session_first",
    });
    expect(pageViews).toHaveLength(2);
    expect(pageViews[0]).toMatchObject({
      acquisitionSessionId: "session_first",
      channel: "referral",
      source: "reddit",
      utmCampaign: "launch",
      utmSource: "reddit",
      visitedPath: "/reddit",
      referrerHost: "reddit.com",
    });
  });
});
