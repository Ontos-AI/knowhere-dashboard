import type { PostHog } from "posthog-js";
import type { AnalyticsAdapter } from "@/lib/analytics/core";
import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics/types";
import { env } from "@/lib/env";

const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;

export const isPostHogAdapterEnabled = Boolean(POSTHOG_KEY);

type QueuedAction =
  | {
      readonly eventName: string;
      readonly properties?: AnalyticsProperties;
      readonly type: "capture";
    }
  | {
      readonly properties?: AnalyticsProperties;
      readonly type: "identify";
      readonly userId: string;
    }
  | { readonly type: "reset" }
  | { readonly properties: AnalyticsProperties; readonly type: "people.set" };

type PostHogCapture = {
  readonly eventName: string;
  readonly properties?: AnalyticsProperties;
};

let posthog: PostHog | null = null;
let isPostHogReady = false;

const eventQueue: QueuedAction[] = [];

const flushQueue = (): void => {
  if (!posthog || !isPostHogReady) {
    return;
  }

  while (eventQueue.length > 0) {
    const action = eventQueue.shift();
    if (!action) {
      continue;
    }

    switch (action.type) {
      case "capture":
        posthog.capture(action.eventName, action.properties);
        break;
      case "identify":
        posthog.identify(action.userId, action.properties);
        break;
      case "reset":
        posthog.reset();
        break;
      case "people.set":
        posthog.people.set(action.properties);
        break;
      default:
        break;
    }
  }
};

const capturePostHogEvent = (eventName: string, properties?: AnalyticsProperties): void => {
  if (typeof window === "undefined" || !isPostHogAdapterEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.capture(eventName, properties);
    return;
  }

  eventQueue.push({ eventName, properties, type: "capture" });
};

export const initPostHogClient = (): void => {
  const key = POSTHOG_KEY;

  if (!key || typeof window === "undefined" || posthog) {
    return;
  }

  import("posthog-js")
    .then((module: { readonly default: PostHog }): void => {
      posthog = module.default;
      posthog.init(key, {
        api_host: POSTHOG_HOST,
        capture_pageleave: true,
        capture_pageview: false,
        loaded: (loadedPosthog: PostHog): void => {
          posthog = loadedPosthog;
          isPostHogReady = true;
          flushQueue();
          if (env.NODE_ENV === "development") {
            console.log("PostHog loaded");
          }
        },
        person_profiles: "identified_only",
      });
    })
    .catch((error: unknown): void => {
      console.error("Failed to load PostHog:", error);
    });
};

export const getPostHogClient = (): PostHog | null => posthog;

const mapAnalyticsEventToPostHogCapture = (event: AnalyticsEvent): PostHogCapture | null => {
  switch (event.name) {
    case "auth.login":
      return {
        eventName: "user_login",
        properties: {
          method: event.method,
          timestamp: event.timestamp,
          user_id: event.userId,
        },
      };
    case "auth.signup":
      return {
        eventName: "user_signup",
        properties: {
          method: event.method,
          timestamp: event.timestamp,
          user_id: event.userId,
        },
      };
    case "api_key.created":
      return {
        eventName: "api_key_created",
        properties: {
          key_id: event.keyId,
          key_name: event.keyName,
          source: event.source,
          timestamp: event.timestamp,
        },
      };
    case "api_key.deleted":
      return {
        eventName: "api_key_deleted",
        properties: {
          key_id: event.keyId,
          timestamp: event.timestamp,
        },
      };
    case "billing.credits_purchased":
      return {
        eventName: "credits_purchased",
        properties: {
          amount: event.amount,
          plan_type: event.planType,
          timestamp: event.timestamp,
          transaction_id: event.transactionId,
        },
      };
    case "billing.subscription_purchased":
      return {
        eventName: "subscription_purchased",
        properties: {
          plan_id: event.planId,
          timestamp: event.timestamp,
          transaction_id: event.transactionId,
        },
      };
    case "billing.checkout_purchase_unknown":
      return {
        eventName: "checkout_purchase_unknown",
        properties: {
          amount: event.amount,
          plan_id: event.planId,
          transaction_id: event.transactionId,
          ...event.properties,
          timestamp: event.timestamp,
        },
      };
    case "billing.checkout_started":
      return {
        eventName: "checkout_started",
        properties: {
          checkout_type: event.checkoutType,
          ...event.properties,
          timestamp: event.timestamp,
        },
      };
    case "billing.checkout_canceled":
      return {
        eventName: "checkout_canceled",
        properties: {
          checkout_type: event.checkoutType,
          timestamp: event.timestamp,
        },
      };
    case "billing.buy_credits_clicked":
      return {
        eventName: "buy_credits_clicked",
        properties: {
          source: event.source,
          timestamp: event.timestamp,
        },
      };
    case "marketing.contact_sales_clicked":
      return {
        eventName: "contact_sales_clicked",
        properties: {
          source_section: event.sourceSection,
          timestamp: event.timestamp,
        },
      };
    case "marketing.landing_cta_clicked":
      return {
        eventName: "landing_cta_clicked",
        properties: {
          cta_id: event.ctaId,
          page_path: event.pagePath,
          ...event.properties,
          timestamp: event.timestamp,
        },
      };
    case "job.created":
      return {
        eventName: "job_created",
        properties: {
          job_id: event.jobId,
          job_type: event.jobType,
          source_type: event.sourceType,
          timestamp: event.timestamp,
        },
      };
    case "job.completed":
      return {
        eventName: "job_completed",
        properties: {
          job_id: event.jobId,
          job_type: event.jobType,
          processing_time_ms: event.processingTimeMs,
          timestamp: event.timestamp,
        },
      };
    case "job.failed":
      return {
        eventName: "job_failed",
        properties: {
          error_message: event.errorMessage,
          job_id: event.jobId,
          job_type: event.jobType,
          timestamp: event.timestamp,
        },
      };
    case "file.uploaded":
      return {
        eventName: "file_uploaded",
        properties: {
          file_size: event.fileSize,
          file_type: event.fileType,
          timestamp: event.timestamp,
          upload_method: event.uploadMethod,
        },
      };
    case "webhook.configured":
      return {
        eventName: "webhook_configured",
        properties: {
          timestamp: event.timestamp,
          webhook_url: event.webhookUrl,
        },
      };
    case "webhook.secret_revoked":
      return {
        eventName: "webhook_secret_revoked",
        properties: {
          secret_id: event.secretId,
          timestamp: event.timestamp,
        },
      };
    case "error.occurred":
      return {
        eventName: "error_occurred",
        properties: {
          error_context: event.errorContext,
          error_message: event.errorMessage,
          timestamp: event.timestamp,
        },
      };
    case "feature.used":
      return {
        eventName: "feature_used",
        properties: {
          feature_name: event.featureName,
          ...event.properties,
          timestamp: event.timestamp,
        },
      };
    case "legacy.event":
      return {
        eventName: event.eventName,
        properties: event.properties,
      };
    default:
      return null;
  }
};

const identifyPostHogUser = (userId: string, properties?: AnalyticsProperties): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!isPostHogAdapterEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.identify(userId, properties);
    return;
  }

  eventQueue.push({ properties, type: "identify", userId });
};

const resetPostHogUser = (): void => {
  if (typeof window === "undefined") {
    return;
  }

  if (!isPostHogAdapterEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.reset();
    return;
  }

  eventQueue.push({ type: "reset" });
};

const setPostHogUserProperties = (properties: AnalyticsProperties): void => {
  if (typeof window === "undefined" || !isPostHogAdapterEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.people.set(properties);
    return;
  }

  eventQueue.push({ properties, type: "people.set" });
};

const trackPostHogAnalyticsEvent = (event: AnalyticsEvent): void => {
  const capture = mapAnalyticsEventToPostHogCapture(event);
  if (!capture) {
    return;
  }

  capturePostHogEvent(capture.eventName, capture.properties);
};

const trackPostHogPageView = (pagePath: string): void => {
  capturePostHogEvent("$pageview", {
    page: pagePath,
  });
};

export function createPostHogAnalyticsAdapter(): AnalyticsAdapter {
  return {
    name: "posthog",
    identifyUser: identifyPostHogUser,
    initialize: initPostHogClient,
    isEnabled: (): boolean => isPostHogAdapterEnabled,
    resetUser: resetPostHogUser,
    setUserProperties: setPostHogUserProperties,
    trackEvent: trackPostHogAnalyticsEvent,
    trackPageView: trackPostHogPageView,
  };
}
