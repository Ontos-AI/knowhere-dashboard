import { describe, expect, it } from "vitest";
import {
  type AcquisitionAttributionRepository,
  type AcquisitionAttributionSessionInsert,
  createAcquisitionAttributionService,
} from "@/lib/acquisition-attribution/core";

function createMemoryRepository(): {
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

  return {
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
});
