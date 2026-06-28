/**
 * PostHog 用户行为追踪 - 官方推荐实现
 */

import type { PostHog } from "posthog-js";
import { isAllowedExternalOrigin } from "@/lib/auth-redirect";
import { env } from "@/lib/env";
import {
  mirrorApiKeyCreated,
  mirrorAuthLogin,
  mirrorAuthSignUp,
  mirrorBuyCreditsClicked,
  mirrorCheckoutCanceled,
  mirrorCheckoutPurchaseUnknown,
  mirrorCheckoutStarted,
  mirrorContactSalesClick,
  mirrorCreditsPurchased,
  mirrorFileUploaded,
  mirrorJobCompleted,
  mirrorJobCreated,
  mirrorJobFailed,
  mirrorLandingCtaClick,
  mirrorSubscriptionPurchased,
  setGAUserId,
} from "@/lib/google-analytics";
import { clearTrackedJobEvents } from "@/lib/job-posthog-tracking";

const POSTHOG_KEY = env.NEXT_PUBLIC_POSTHOG_KEY;
const POSTHOG_HOST = env.NEXT_PUBLIC_POSTHOG_HOST;
export const isPostHogEnabled = Boolean(POSTHOG_KEY);

let posthog: PostHog | null = null;
let isPostHogReady = false;

type QueuedAction =
  | { type: "capture"; eventName: string; properties?: Record<string, unknown> }
  | { type: "identify"; userId: string; userProperties?: Record<string, unknown> }
  | { type: "reset" }
  | { type: "people.set"; properties: Record<string, unknown> };

const eventQueue: QueuedAction[] = [];

const AUTH_EVENT_TRACKED_KEY = "ph_auth_event_tracked";
const PENDING_AUTH_LOGIN_KEY = "ph_pending_auth_login";
const PENDING_MAGIC_LINK_AUTH_KEY = "ph_pending_magic_link_auth";
const PENDING_CHECKOUT_KEY = "ph_pending_checkout";
const BUY_CREDITS_ENTRY_TS_KEY = "ph_buy_credits_entry_ts";
const BUY_CREDITS_DEDUPE_MS = 5000;
const PENDING_OAUTH_TTL_MS = 30 * 60 * 1000;
const PENDING_MAGIC_LINK_TTL_MS = 30 * 60 * 1000;
export const NEW_USER_WINDOW_MS = 5 * 60 * 1000;

export type CheckoutType = "credits_package" | "subscription";

const timestamp = () => new Date().toISOString();

export const markAuthEventTracked = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AUTH_EVENT_TRACKED_KEY, "1");
};

export const isAuthEventTracked = () => {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(AUTH_EVENT_TRACKED_KEY) === "1";
};

export const markPendingAuthLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(PENDING_AUTH_LOGIN_KEY, String(Date.now()));
};

export const hasPendingAuthLogin = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = sessionStorage.getItem(PENDING_AUTH_LOGIN_KEY);
  if (!raw) {
    return false;
  }

  const timestamp = Number(raw);
  if (Number.isNaN(timestamp) || Date.now() - timestamp > PENDING_OAUTH_TTL_MS) {
    sessionStorage.removeItem(PENDING_AUTH_LOGIN_KEY);
    return false;
  }

  return true;
};

export const clearPendingAuthLogin = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_AUTH_LOGIN_KEY);
};

export const markPendingMagicLinkAuth = () => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PENDING_MAGIC_LINK_AUTH_KEY, String(Date.now()));
};

export const consumePendingMagicLinkAuth = () => {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = localStorage.getItem(PENDING_MAGIC_LINK_AUTH_KEY);
  if (!raw) {
    return false;
  }

  localStorage.removeItem(PENDING_MAGIC_LINK_AUTH_KEY);
  const timestamp = Number(raw);
  if (Number.isNaN(timestamp) || Date.now() - timestamp > PENDING_MAGIC_LINK_TTL_MS) {
    return false;
  }

  return true;
};

export const appendPostHogAuthFlag = (callbackURL: string, flag: string) => {
  if (typeof window === "undefined") {
    return callbackURL;
  }

  try {
    if (callbackURL.startsWith("/") && !callbackURL.startsWith("//")) {
      const parsed = new URL(callbackURL, window.location.origin);
      if (parsed.origin !== window.location.origin) {
        return callbackURL;
      }

      parsed.searchParams.set("ph_auth", flag);
      return `${parsed.pathname}${parsed.search}`;
    }

    const parsed = new URL(callbackURL);
    if (parsed.origin !== window.location.origin && !isAllowedExternalOrigin(parsed.origin)) {
      return callbackURL;
    }

    parsed.searchParams.set("ph_auth", flag);
    return parsed.toString();
  } catch {
    return callbackURL;
  }
};

export type PendingCheckout = {
  checkout_type: CheckoutType;
  session_id: string;
  amount?: number;
  plan_id?: string;
  price_id?: string;
};

export const storePendingCheckout = (data: PendingCheckout) => {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(data));
};

export const peekPendingCheckout = (): PendingCheckout | null => {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PendingCheckout;
  } catch {
    return null;
  }
};

export const consumePendingCheckout = (): PendingCheckout | null => {
  const data = peekPendingCheckout();
  if (typeof window !== "undefined") {
    localStorage.removeItem(PENDING_CHECKOUT_KEY);
  }

  return data;
};

export const isLikelyNewUser = (createdAt?: Date | string) => {
  if (!createdAt) {
    return false;
  }

  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return false;
  }

  return Date.now() - created < NEW_USER_WINDOW_MS;
};

const clearAuthTrackingState = () => {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(AUTH_EVENT_TRACKED_KEY);
  sessionStorage.removeItem(PENDING_AUTH_LOGIN_KEY);
  localStorage.removeItem(PENDING_MAGIC_LINK_AUTH_KEY);
  localStorage.removeItem(PENDING_CHECKOUT_KEY);
  clearTrackedJobEvents();
  sessionStorage.removeItem(BUY_CREDITS_ENTRY_TS_KEY);

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("ph_welcome_api_key_tracked_")) {
      localStorage.removeItem(key);
    }
  }
};

const flushQueue = () => {
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
        posthog.identify(action.userId, action.userProperties);
        setGAUserId(action.userId);
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

const captureEvent = (eventName: string, properties?: Record<string, unknown>) => {
  if (typeof window === "undefined" || !isPostHogEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.capture(eventName, properties);
    return;
  }

  eventQueue.push({ type: "capture", eventName, properties });
};

const initPostHog = () => {
  const key = POSTHOG_KEY;

  if (!key || typeof window === "undefined" || posthog) {
    return;
  }

  import("posthog-js")
    .then((module) => {
      posthog = module.default;
      posthog.init(key, {
        api_host: POSTHOG_HOST,
        person_profiles: "identified_only",
        capture_pageview: false,
        capture_pageleave: true,
        loaded: (loadedPosthog: PostHog) => {
          posthog = loadedPosthog;
          isPostHogReady = true;
          flushQueue();
          if (env.NODE_ENV === "development") {
            console.log("PostHog loaded");
          }
        },
      });
    })
    .catch((error) => {
      console.error("Failed to load PostHog:", error);
    });
};

const getPostHog = () => posthog;

export const initPostHogClient = initPostHog;

export const identifyUser = (userId: string, userProperties?: Record<string, unknown>) => {
  if (typeof window === "undefined") {
    return;
  }

  setGAUserId(userId);

  if (!isPostHogEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.identify(userId, userProperties);
    return;
  }

  eventQueue.push({ type: "identify", userId, userProperties });
};

export const resetUser = () => {
  if (typeof window === "undefined") {
    return;
  }

  setGAUserId(null);
  clearAuthTrackingState();

  if (!isPostHogEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.reset();
    return;
  }

  eventQueue.push({ type: "reset" });
};

export const trackPageView = (pageName?: string) => {
  captureEvent("$pageview", {
    page: pageName || (typeof window !== "undefined" ? window.location.pathname : undefined),
  });
};

export const trackEvent = (eventName: string, properties?: Record<string, unknown>) => {
  captureEvent(eventName, properties);
};

export const setUserProperties = (properties: Record<string, unknown>) => {
  if (typeof window === "undefined" || !isPostHogEnabled) {
    return;
  }

  if (posthog && isPostHogReady) {
    posthog.people.set(properties);
    return;
  }

  eventQueue.push({ type: "people.set", properties });
};

export const trackLogin = (method: "google" | "github" | "apple" | "email", userId: string) => {
  clearPendingAuthLogin();
  markAuthEventTracked();
  mirrorAuthLogin(method);
  trackEvent("user_login", {
    method,
    user_id: userId,
    timestamp: timestamp(),
  });
};

export const trackSignUp = (method: "google" | "github" | "apple" | "email", userId: string) => {
  clearPendingAuthLogin();
  markAuthEventTracked();
  mirrorAuthSignUp(method);
  trackEvent("user_signup", {
    method,
    user_id: userId,
    timestamp: timestamp(),
  });
};

export const trackApiKeyCreated = (keyId: string, keyName: string, source = "dashboard") => {
  mirrorApiKeyCreated(source);
  trackEvent("api_key_created", {
    key_id: keyId,
    key_name: keyName,
    source,
    timestamp: timestamp(),
  });
};

export const trackApiKeyDeleted = (keyId: string) => {
  trackEvent("api_key_deleted", {
    key_id: keyId,
    timestamp: timestamp(),
  });
};

export const trackCreditsPurchased = (amount: number, planType: string, transactionId: string) => {
  mirrorCreditsPurchased(amount, transactionId);
  trackEvent("credits_purchased", {
    amount,
    plan_type: planType,
    transaction_id: transactionId,
    timestamp: timestamp(),
  });
};

export const trackSubscriptionPurchased = (planId: string, transactionId?: string) => {
  mirrorSubscriptionPurchased(planId, transactionId ?? "");
  trackEvent("subscription_purchased", {
    plan_id: planId,
    transaction_id: transactionId ?? "",
    timestamp: timestamp(),
  });
};

export const trackCheckoutPurchaseUnknown = (
  transactionId: string,
  properties?: Record<string, unknown>
) => {
  const amount = typeof properties?.amount === "number" ? properties.amount : undefined;
  const planId = typeof properties?.plan_id === "string" ? properties.plan_id : undefined;

  mirrorCheckoutPurchaseUnknown(transactionId, amount, planId);
  trackEvent("checkout_purchase_unknown", {
    transaction_id: transactionId,
    amount,
    plan_id: planId,
    ...properties,
    timestamp: timestamp(),
  });
};

export const trackCheckoutStarted = (
  checkoutType: CheckoutType,
  properties?: Record<string, unknown>
) => {
  mirrorCheckoutStarted(checkoutType);
  trackEvent("checkout_started", {
    checkout_type: checkoutType,
    ...properties,
    timestamp: timestamp(),
  });

  storePendingCheckout({
    checkout_type: checkoutType,
    session_id: String(properties?.session_id ?? ""),
    amount: typeof properties?.amount === "number" ? properties.amount : undefined,
    plan_id: typeof properties?.plan_id === "string" ? properties.plan_id : undefined,
    price_id: typeof properties?.price_id === "string" ? properties.price_id : undefined,
  });
};

export const trackCheckoutCanceled = (checkoutType?: CheckoutType) => {
  const normalizedType = checkoutType ?? "unknown";
  mirrorCheckoutCanceled(normalizedType);
  trackEvent("checkout_canceled", {
    checkout_type: normalizedType,
    timestamp: timestamp(),
  });
};

export const trackBuyCreditsClicked = (source: string) => {
  if (typeof window !== "undefined") {
    if (source === "deep_link") {
      const lastEntry = sessionStorage.getItem(BUY_CREDITS_ENTRY_TS_KEY);
      if (lastEntry && Date.now() - Number(lastEntry) < BUY_CREDITS_DEDUPE_MS) {
        return;
      }
    } else {
      sessionStorage.setItem(BUY_CREDITS_ENTRY_TS_KEY, String(Date.now()));
    }
  }

  mirrorBuyCreditsClicked(source);
  trackEvent("buy_credits_clicked", {
    source,
    timestamp: timestamp(),
  });
};

export const trackContactSalesClicked = (sourceSection: string) => {
  mirrorContactSalesClick(sourceSection);
  trackEvent("contact_sales_clicked", {
    source_section: sourceSection,
    timestamp: timestamp(),
  });
};

export const trackLandingCtaClick = (ctaId: string, properties?: Record<string, unknown>) => {
  const defaultPagePath =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : undefined;

  trackEvent("landing_cta_clicked", {
    cta_id: ctaId,
    page_path: defaultPagePath,
    ...properties,
    timestamp: timestamp(),
  });

  const sourceSection =
    typeof properties?.source_section === "string" ? properties.source_section : "unknown";
  mirrorLandingCtaClick(ctaId, sourceSection);
};

export const trackJobCreated = (
  jobType: "kb_management",
  jobId: string,
  sourceType: "direct_upload" | "url"
) => {
  mirrorJobCreated(sourceType);
  trackEvent("job_created", {
    job_type: jobType,
    job_id: jobId,
    source_type: sourceType,
    timestamp: timestamp(),
  });
};

export const trackJobCompleted = (
  jobType: "kb_management",
  jobId: string,
  processingTimeMs: number
) => {
  mirrorJobCompleted(processingTimeMs);
  trackEvent("job_completed", {
    job_type: jobType,
    job_id: jobId,
    processing_time_ms: processingTimeMs,
    timestamp: timestamp(),
  });
};

export const trackJobFailed = (jobType: "kb_management", jobId: string, errorMessage: string) => {
  mirrorJobFailed(errorMessage);
  trackEvent("job_failed", {
    job_type: jobType,
    job_id: jobId,
    error_message: errorMessage,
    timestamp: timestamp(),
  });
};

export const trackFileUpload = (
  fileType: string,
  fileSize: number,
  uploadMethod: "direct" | "url"
) => {
  mirrorFileUploaded(fileType, uploadMethod);
  trackEvent("file_uploaded", {
    file_type: fileType,
    file_size: fileSize,
    upload_method: uploadMethod,
    timestamp: timestamp(),
  });
};

export const trackWebhookConfigured = (webhookUrl: string) => {
  trackEvent("webhook_configured", {
    webhook_url: webhookUrl,
    timestamp: timestamp(),
  });
};

export const trackWebhookSecretRevoked = (secretId: string) => {
  trackEvent("webhook_secret_revoked", {
    secret_id: secretId,
    timestamp: timestamp(),
  });
};

export const trackError = (errorMessage: string, errorContext?: Record<string, unknown>) => {
  trackEvent("error_occurred", {
    error_message: errorMessage,
    error_context: errorContext,
    timestamp: timestamp(),
  });
};

export const trackFeatureUsage = (featureName: string, properties?: Record<string, unknown>) => {
  trackEvent("feature_used", {
    feature_name: featureName,
    ...properties,
    timestamp: timestamp(),
  });
};

export default getPostHog;
