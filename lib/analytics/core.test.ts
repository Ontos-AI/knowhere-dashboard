import { afterEach, describe, expect, it, vi } from "vitest";
import { type AnalyticsAdapter, createAnalyticsController } from "@/lib/analytics/core";
import type { AnalyticsEvent } from "@/lib/analytics/types";

const createTestEvent = (): AnalyticsEvent => ({
  method: "email",
  name: "auth.signup",
  timestamp: "2026-07-22T00:00:00.000Z",
  userId: "user_123",
});

afterEach(() => {
  vi.restoreAllMocks();
});

describe("analytics controller", () => {
  it("dispatches events to enabled adapters", () => {
    const receivedEvents: AnalyticsEvent[] = [];
    const adapter: AnalyticsAdapter = {
      isEnabled: (): boolean => true,
      name: "enabled",
      trackEvent: (event: AnalyticsEvent): void => {
        receivedEvents.push(event);
      },
    };
    const controller = createAnalyticsController([adapter]);
    const event = createTestEvent();

    controller.trackEvent(event);

    expect(receivedEvents).toEqual([event]);
  });

  it("does not dispatch events to disabled adapters", () => {
    const trackEvent = vi.fn();
    const adapter: AnalyticsAdapter = {
      isEnabled: (): boolean => false,
      name: "disabled",
      trackEvent,
    };
    const controller = createAnalyticsController([adapter]);

    controller.trackEvent(createTestEvent());

    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("keeps dispatching when one adapter throws", () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation((): void => {});
    const receivedEvents: AnalyticsEvent[] = [];
    const failingAdapter: AnalyticsAdapter = {
      isEnabled: (): boolean => true,
      name: "failing",
      trackEvent: (): void => {
        throw new Error("adapter failed");
      },
    };
    const healthyAdapter: AnalyticsAdapter = {
      isEnabled: (): boolean => true,
      name: "healthy",
      trackEvent: (event: AnalyticsEvent): void => {
        receivedEvents.push(event);
      },
    };
    const event = createTestEvent();
    const controller = createAnalyticsController([failingAdapter, healthyAdapter]);

    controller.trackEvent(event);

    expect(receivedEvents).toEqual([event]);
    expect(consoleError).toHaveBeenCalledTimes(1);
  });
});
