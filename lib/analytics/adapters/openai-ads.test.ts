import { afterEach, describe, expect, it, vi } from "vitest";
import { createOpenAIAdsAdapter } from "@/lib/analytics/adapters/openai-ads";
import type { AnalyticsEvent } from "@/lib/analytics/types";

const sourceUrl = "https://knowhereto.ai/checkout/success?session_id=cs_123";

function stubBrowser(oaiq = vi.fn()) {
  const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));

  vi.stubGlobal("window", {
    location: {
      href: sourceUrl,
    },
    oaiq,
  });
  vi.stubGlobal("fetch", fetchMock);

  return { fetchMock, oaiq };
}

function createSignupEvent(): AnalyticsEvent {
  return {
    method: "email",
    name: "auth.signup",
    timestamp: "2026-07-24T00:00:00.000Z",
    userId: "user_123",
  };
}

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("openai ads analytics adapter", () => {
  it("does not emit conversions without a configured pixel id", () => {
    const { fetchMock, oaiq } = stubBrowser();
    const adapter = createOpenAIAdsAdapter();

    adapter.initialize?.({});
    adapter.trackEvent?.(createSignupEvent());

    expect(oaiq).not.toHaveBeenCalled();
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("emits signup conversions to the pixel and server route with the same event id", () => {
    const { fetchMock, oaiq } = stubBrowser();
    const adapter = createOpenAIAdsAdapter();

    adapter.initialize?.({ openAIAdsPixelId: "pixel_123" });
    adapter.trackEvent?.(createSignupEvent());

    expect(oaiq).toHaveBeenCalledWith(
      "measure",
      "registration_completed",
      { type: "customer_action" },
      { event_id: "registration:user_123" }
    );
    expect(fetchMock).toHaveBeenCalledWith(
      "/api/openai-ads/conversions",
      expect.objectContaining({
        body: JSON.stringify({
          data: { type: "customer_action" },
          eventId: "registration:user_123",
          eventName: "registration_completed",
          sourceUrl,
          timestamp: "2026-07-24T00:00:00.000Z",
        }),
        method: "POST",
      })
    );
  });

  it("normalizes purchase amounts to USD minor units", () => {
    const { oaiq } = stubBrowser();
    const adapter = createOpenAIAdsAdapter();

    adapter.initialize?.({ openAIAdsPixelId: "pixel_123" });
    adapter.trackEvent?.({
      amount: 129.99,
      name: "billing.credits_purchased",
      planType: "credits_package",
      timestamp: "2026-07-24T00:00:00.000Z",
      transactionId: "order_12345",
    });

    expect(oaiq).toHaveBeenCalledWith(
      "measure",
      "order_created",
      {
        amount: 12999,
        currency: "USD",
        type: "contents",
      },
      { event_id: "order:order_12345" }
    );
  });
});
