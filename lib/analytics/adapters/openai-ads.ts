import type { AnalyticsAdapter, AnalyticsConfig } from "@/lib/analytics/core";
import type { AnalyticsEvent } from "@/lib/analytics/types";

type OpenAIAdsStandardEventName =
  | "checkout_started"
  | "lead_created"
  | "order_created"
  | "registration_completed"
  | "subscription_created";

type OpenAIAdsConversionData =
  | {
      readonly type: "customer_action";
    }
  | {
      readonly amount?: number;
      readonly currency?: "USD";
      readonly type: "contents";
    }
  | {
      readonly amount?: number;
      readonly currency?: "USD";
      readonly plan_id?: string;
      readonly type: "plan_enrollment";
    };

type OpenAIAdsConversionEvent = {
  readonly data: OpenAIAdsConversionData;
  readonly eventId: string;
  readonly eventName: OpenAIAdsStandardEventName;
  readonly sourceUrl?: string;
  readonly timestamp: string;
};

type OpenAIAdsMeasureOptions = {
  readonly event_id: string;
};

declare global {
  interface Window {
    oaiq?: (
      command: "measure",
      eventName: OpenAIAdsStandardEventName,
      data: OpenAIAdsConversionData,
      options: OpenAIAdsMeasureOptions
    ) => void;
  }
}

let openAIAdsPixelId = "";

function getSourceUrl(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return window.location.href;
}

function toUSDMinorUnits(amount?: number): number | undefined {
  if (typeof amount !== "number" || !Number.isFinite(amount) || amount <= 0) {
    return undefined;
  }

  return Math.round(amount * 100);
}

function createContentsData(amount?: number): OpenAIAdsConversionData {
  const minorUnits = toUSDMinorUnits(amount);
  if (minorUnits === undefined) {
    return { type: "contents" };
  }

  return {
    amount: minorUnits,
    currency: "USD",
    type: "contents",
  };
}

function createPlanEnrollmentData(planId: string, amount?: number): OpenAIAdsConversionData {
  const minorUnits = toUSDMinorUnits(amount);
  if (minorUnits === undefined) {
    return {
      plan_id: planId,
      type: "plan_enrollment",
    };
  }

  return {
    amount: minorUnits,
    currency: "USD",
    plan_id: planId,
    type: "plan_enrollment",
  };
}

function getConversionEvent(event: AnalyticsEvent): OpenAIAdsConversionEvent | null {
  switch (event.name) {
    case "auth.signup":
      return {
        data: { type: "customer_action" },
        eventId: `registration:${event.userId}`,
        eventName: "registration_completed",
        sourceUrl: getSourceUrl(),
        timestamp: event.timestamp,
      };
    case "billing.checkout_started":
      return {
        data: createContentsData(event.amount),
        eventId: `checkout:${event.sessionId || event.timestamp}`,
        eventName: "checkout_started",
        sourceUrl: getSourceUrl(),
        timestamp: event.timestamp,
      };
    case "billing.credits_purchased":
      return {
        data: createContentsData(event.amount),
        eventId: `order:${event.transactionId}`,
        eventName: "order_created",
        sourceUrl: getSourceUrl(),
        timestamp: event.timestamp,
      };
    case "billing.checkout_purchase_unknown":
      return {
        data: createContentsData(event.amount),
        eventId: `order:${event.transactionId}`,
        eventName: "order_created",
        sourceUrl: getSourceUrl(),
        timestamp: event.timestamp,
      };
    case "billing.subscription_purchased":
      return {
        data: createPlanEnrollmentData(event.planId),
        eventId: `subscription:${event.transactionId || event.planId}:${event.timestamp}`,
        eventName: "subscription_created",
        sourceUrl: getSourceUrl(),
        timestamp: event.timestamp,
      };
    case "marketing.contact_sales_clicked":
      return {
        data: { type: "customer_action" },
        eventId: `lead:${event.sourceSection}:${event.timestamp}`,
        eventName: "lead_created",
        sourceUrl: getSourceUrl(),
        timestamp: event.timestamp,
      };
    default:
      return null;
  }
}

function isOpenAIAdsEnabled(): boolean {
  return (
    typeof window !== "undefined" && Boolean(openAIAdsPixelId) && typeof window.oaiq === "function"
  );
}

function sendServerConversionEvent(event: OpenAIAdsConversionEvent): void {
  if (typeof fetch !== "function") {
    return;
  }

  void fetch("/api/openai-ads/conversions", {
    body: JSON.stringify({
      data: event.data,
      eventId: event.eventId,
      eventName: event.eventName,
      sourceUrl: event.sourceUrl,
      timestamp: event.timestamp,
    }),
    credentials: "same-origin",
    headers: {
      "content-type": "application/json",
    },
    keepalive: true,
    method: "POST",
  }).catch((error: unknown): void => {
    console.error("[analytics] openai-ads server conversion failed", error);
  });
}

function trackOpenAIAdsEvent(event: AnalyticsEvent): void {
  const conversionEvent = getConversionEvent(event);
  if (!conversionEvent || !isOpenAIAdsEnabled()) {
    return;
  }

  window.oaiq?.("measure", conversionEvent.eventName, conversionEvent.data, {
    event_id: conversionEvent.eventId,
  });
  sendServerConversionEvent(conversionEvent);
}

export function createOpenAIAdsAdapter(): AnalyticsAdapter {
  return {
    name: "openai-ads",
    initialize: (config: AnalyticsConfig): void => {
      openAIAdsPixelId = config.openAIAdsPixelId ?? openAIAdsPixelId;
    },
    isEnabled: isOpenAIAdsEnabled,
    trackEvent: trackOpenAIAdsEvent,
  };
}
