import { afterEach, describe, expect, it, vi } from "vitest";

type OpenAIAdsConversionsModule = typeof import("@/server/openai-ads-conversions");

const REQUIRED_ENV = {
  BETTER_AUTH_SECRET: "test-auth-secret-with-at-least-32-chars",
  BETTER_AUTH_URL: "https://knowhereto.ai",
  DATABASE_URL: "postgres://user:pass@example.com:5432/dashboard",
  NEXT_PUBLIC_API_URL: "https://api.knowhereto.ai/api",
  NEXT_PUBLIC_AUTH_BASE_URL: "/api/auth",
  NEXT_PUBLIC_APP_URL: "https://knowhereto.ai",
} as const;

const conversionEvent = {
  data: { type: "customer_action" as const },
  eventId: "registration:user_123",
  eventName: "registration_completed" as const,
  sourceUrl: "https://knowhereto.ai/dashboard",
  timestamp: "2026-07-24T00:00:00.000Z",
};

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

async function loadOpenAIAdsConversionsModule(): Promise<OpenAIAdsConversionsModule> {
  vi.resetModules();

  for (const [key, value] of Object.entries(REQUIRED_ENV)) {
    vi.stubEnv(key, value);
  }

  return import("@/server/openai-ads-conversions");
}

describe("openai ads conversions api sender", () => {
  it("skips sending when the server conversion config is disabled", async () => {
    const { sendOpenAIAdsConversionEvent } = await loadOpenAIAdsConversionsModule();
    const fetchMock = vi.fn();

    await expect(
      sendOpenAIAdsConversionEvent(conversionEvent, {
        fetch: fetchMock,
        openAIAdsConversionsAPIKey: "",
        openAIAdsPixelId: "",
      })
    ).resolves.toEqual({ reason: "disabled", sent: false });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("sends conversions API events with the pixel id, bearer token, and matching event id", async () => {
    const { sendOpenAIAdsConversionEvent } = await loadOpenAIAdsConversionsModule();
    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));

    await expect(
      sendOpenAIAdsConversionEvent(conversionEvent, {
        fetch: fetchMock,
        openAIAdsConversionsAPIKey: "conversions_key",
        openAIAdsPixelId: "pixel_123",
      })
    ).resolves.toEqual({ sent: true });

    expect(fetchMock).toHaveBeenCalledWith("https://bzr.openai.com/v1/events?pid=pixel_123", {
      body: JSON.stringify({
        events: [
          {
            action_source: "web",
            data: { type: "customer_action" },
            id: "registration:user_123",
            source_url: "https://knowhereto.ai/dashboard",
            timestamp_ms: 1784851200000,
            type: "registration_completed",
          },
        ],
        validate_only: false,
      }),
      headers: {
        authorization: "Bearer conversions_key",
        "content-type": "application/json",
      },
      method: "POST",
    });
  });

  it("raises a contextual error when OpenAI rejects the event", async () => {
    const { sendOpenAIAdsConversionEvent } = await loadOpenAIAdsConversionsModule();
    const fetchMock = vi.fn().mockResolvedValue(
      new Response("bad event", {
        status: 400,
        statusText: "Bad Request",
      })
    );

    await expect(
      sendOpenAIAdsConversionEvent(conversionEvent, {
        fetch: fetchMock,
        openAIAdsConversionsAPIKey: "conversions_key",
        openAIAdsPixelId: "pixel_123",
      })
    ).rejects.toThrow("OpenAI Ads Conversions API rejected event registration_completed");
  });
});
