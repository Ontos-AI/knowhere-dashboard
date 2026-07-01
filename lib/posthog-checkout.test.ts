import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const posthogMocks = vi.hoisted(() => ({
  consumePendingCheckout: vi.fn(),
  trackCheckoutCanceled: vi.fn(),
  trackCheckoutPurchaseUnknown: vi.fn(),
  trackCreditsPurchased: vi.fn(),
  trackSubscriptionPurchased: vi.fn(),
}));

vi.mock("@lib/posthog", () => posthogMocks);

import { trackPaymentRedirectFromSearchParams } from "@/lib/posthog-checkout";

const stubLocalStorage = () => {
  const storage = new Map<string, string>();
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
};

describe("payment redirect PostHog tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    posthogMocks.consumePendingCheckout.mockReturnValue(null);
    stubLocalStorage();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("dedupes successful checkout redirects by session id", () => {
    const searchParams = new URLSearchParams(
      "success=true&type=credits_package&session_id=cs_test_123&amount=20"
    );

    expect(trackPaymentRedirectFromSearchParams(searchParams)).toEqual({
      handled: true,
      kind: "success",
    });
    expect(trackPaymentRedirectFromSearchParams(searchParams)).toEqual({
      handled: true,
      kind: "success",
    });

    expect(posthogMocks.trackCreditsPurchased).toHaveBeenCalledTimes(1);
    expect(posthogMocks.trackCreditsPurchased).toHaveBeenCalledWith(
      20,
      "credits_package",
      "cs_test_123"
    );
  });

  it("dedupes canceled checkout redirects by session id", () => {
    const searchParams = new URLSearchParams(
      "canceled=true&type=subscription&session_id=cs_cancel_123"
    );

    expect(trackPaymentRedirectFromSearchParams(searchParams)).toEqual({
      handled: true,
      kind: "canceled",
    });
    expect(trackPaymentRedirectFromSearchParams(searchParams)).toEqual({
      handled: true,
      kind: "canceled",
    });

    expect(posthogMocks.trackCheckoutCanceled).toHaveBeenCalledTimes(1);
    expect(posthogMocks.trackCheckoutCanceled).toHaveBeenCalledWith("subscription");
  });
});
