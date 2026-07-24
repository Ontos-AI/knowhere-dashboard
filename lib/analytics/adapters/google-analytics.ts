import type { AnalyticsAdapter, AnalyticsConfig } from "@/lib/analytics/core";
import type { AnalyticsEvent } from "@/lib/analytics/types";

type GAEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

let gaMeasurementId = "";

const cleanGAEventParams = (
  params?: GAEventParams
): Record<string, string | number | boolean> | undefined => {
  if (!params) {
    return undefined;
  }

  return Object.fromEntries(
    Object.entries(params).filter((entry): entry is [string, string | number | boolean] => {
      return entry[1] !== undefined;
    })
  );
};

export function trackGoogleAnalyticsEvent(eventName: string, params?: GAEventParams): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  window.gtag("event", eventName, cleanGAEventParams(params));
}

export function setGoogleAnalyticsUserId(userId: string | null): void {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  if (userId) {
    window.gtag("set", { user_id: userId });
    return;
  }

  window.gtag("set", { user_id: undefined });
}

const isGoogleAnalyticsEnabled = (): boolean => {
  return typeof window !== "undefined" && typeof window.gtag === "function";
};

const trackGoogleAnalyticsPageView = (pagePath: string): void => {
  if (!gaMeasurementId || !isGoogleAnalyticsEnabled()) {
    return;
  }

  window.gtag?.("config", gaMeasurementId, {
    page_path: pagePath,
  });
};

const trackGoogleAnalyticsAnalyticsEvent = (event: AnalyticsEvent): void => {
  switch (event.name) {
    case "auth.login":
      trackGoogleAnalyticsEvent("login", { method: event.method });
      return;
    case "auth.signup":
      trackGoogleAnalyticsEvent("sign_up", { method: event.method });
      return;
    case "api_key.created":
      trackGoogleAnalyticsEvent("api_key_created", { source: event.source });
      return;
    case "billing.buy_credits_clicked":
      trackGoogleAnalyticsEvent("buy_credits_clicked", { source: event.source });
      return;
    case "marketing.landing_cta_clicked":
      trackGoogleAnalyticsEvent("select_content", {
        content_type: "landing_cta",
        item_id: event.ctaId,
        source_section: event.sourceSection,
      });
      return;
    case "marketing.contact_sales_clicked":
      trackGoogleAnalyticsEvent("generate_lead", {
        lead_source: event.sourceSection,
      });
      return;
    case "billing.checkout_started":
      trackGoogleAnalyticsEvent("begin_checkout", {
        checkout_type: event.checkoutType,
      });
      return;
    case "billing.checkout_canceled":
      trackGoogleAnalyticsEvent("checkout_canceled", {
        checkout_type: event.checkoutType,
      });
      return;
    case "billing.credits_purchased":
      trackGoogleAnalyticsEvent("purchase", {
        currency: "USD",
        item_category: "credits_package",
        transaction_id: event.transactionId,
        value: event.amount,
      });
      return;
    case "billing.subscription_purchased":
      trackGoogleAnalyticsEvent("purchase", {
        currency: "USD",
        item_category: "subscription",
        item_id: event.planId,
        transaction_id: event.transactionId,
      });
      return;
    case "billing.checkout_purchase_unknown":
      trackGoogleAnalyticsEvent("checkout_purchase_unknown", {
        amount: event.amount,
        plan_id: event.planId,
        transaction_id: event.transactionId,
      });
      return;
    case "job.created":
      trackGoogleAnalyticsEvent("job_created", {
        source_type: event.sourceType,
      });
      return;
    case "job.completed":
      trackGoogleAnalyticsEvent("job_completed", {
        processing_time_ms: event.processingTimeMs,
      });
      return;
    case "job.failed":
      trackGoogleAnalyticsEvent("job_failed", {
        error_message: event.errorMessage,
      });
      return;
    case "file.uploaded":
      trackGoogleAnalyticsEvent("file_uploaded", {
        file_type: event.fileType,
        upload_method: event.uploadMethod,
      });
      return;
    case "playground.parse_started":
      trackGoogleAnalyticsEvent("playground_parse_started", {
        file_name: event.fileName,
      });
      return;
    default:
      return;
  }
};

export function createGoogleAnalyticsAdapter(): AnalyticsAdapter {
  return {
    name: "google-analytics",
    identifyUser: setGoogleAnalyticsUserId,
    initialize: (config: AnalyticsConfig): void => {
      gaMeasurementId = config.googleAnalyticsMeasurementId ?? gaMeasurementId;
    },
    isEnabled: isGoogleAnalyticsEnabled,
    resetUser: (): void => setGoogleAnalyticsUserId(null),
    trackEvent: trackGoogleAnalyticsAnalyticsEvent,
    trackPageView: trackGoogleAnalyticsPageView,
  };
}
