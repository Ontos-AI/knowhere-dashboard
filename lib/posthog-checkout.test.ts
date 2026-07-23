import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const analyticsMocks = vi.hoisted(() => ({
  trackAnalyticsEvent: vi.fn(),
}));
const clientStateMocks = vi.hoisted(() => ({
  consumePendingCheckout: vi.fn(),
}));

vi.mock("@/lib/analytics", () => analyticsMocks);
vi.mock("@/lib/analytics/client-state", () => clientStateMocks);

import { trackPaymentRedirectFromSearchParams } from "@/lib/analytics/payment-redirect";

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

describe("payment redirect analytics tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    clientStateMocks.consumePendingCheckout.mockReturnValue(null);
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

    expect(analyticsMocks.trackAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(analyticsMocks.trackAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        amount: 20,
        name: "billing.credits_purchased",
        planType: "credits_package",
        transactionId: "cs_test_123",
      })
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

    expect(analyticsMocks.trackAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(analyticsMocks.trackAnalyticsEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        checkoutType: "subscription",
        name: "billing.checkout_canceled",
      })
    );
  });

  it("ignores malformed tracked redirect cache entries", () => {
    localStorage.setItem(
      "ph_tracked_payment_redirects",
      JSON.stringify([123, "success:cs_old", null])
    );
    const searchParams = new URLSearchParams(
      "success=true&type=credits_package&session_id=cs_new&amount=20"
    );

    expect(trackPaymentRedirectFromSearchParams(searchParams)).toEqual({
      handled: true,
      kind: "success",
    });
    expect(JSON.parse(localStorage.getItem("ph_tracked_payment_redirects") ?? "[]")).toEqual([
      "success:cs_new",
    ]);
  });
});
