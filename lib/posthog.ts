import type { PostHog } from "posthog-js";
import { requestAcquisitionSessionBind } from "@/lib/acquisition-attribution/client";
import {
  type AnalyticsProperties,
  type AuthMethod,
  buildAnalyticsAuthCallbackURL,
  buildAnalyticsAuthCleanupPath,
  type CheckoutType,
  clearAnalyticsAuthAndCheckoutState,
  clearPendingAuthLogin,
  consumePendingCheckout,
  consumePendingMagicLinkAuth,
  getAnalyticsAuthCallbackURL,
  hasPendingAuthLogin,
  identifyAnalyticsUser,
  isAuthEventTracked,
  isLikelyNewUser,
  markAuthEventTracked,
  markPendingAuthLogin,
  markPendingMagicLinkAuth,
  type PendingCheckout,
  peekPendingCheckout,
  resetAnalyticsUser,
  setAnalyticsUserProperties,
  shouldTrackBuyCreditsClick,
  storePendingCheckout,
  trackAnalyticsEvent,
  trackAnalyticsPageView,
} from "@/lib/analytics";
import {
  getPostHogClient,
  initPostHogClient,
  isPostHogAdapterEnabled,
} from "@/lib/analytics/adapters/posthog";
import { clearTrackedJobEvents } from "@/lib/job-posthog-tracking";

export type { CheckoutType, PendingCheckout };

export {
  buildAnalyticsAuthCallbackURL as buildPostHogAuthCallbackURL,
  buildAnalyticsAuthCleanupPath as buildPostHogAuthCleanupPath,
  clearPendingAuthLogin,
  consumePendingCheckout,
  consumePendingMagicLinkAuth,
  getAnalyticsAuthCallbackURL as getPostHogAuthCallbackURL,
  hasPendingAuthLogin,
  initPostHogClient,
  isAuthEventTracked,
  isLikelyNewUser,
  markAuthEventTracked,
  markPendingAuthLogin,
  markPendingMagicLinkAuth,
  peekPendingCheckout,
  storePendingCheckout,
};

export const isPostHogEnabled = isPostHogAdapterEnabled;

const createTimestamp = (): string => new Date().toISOString();

const getStringProperty = (
  properties: AnalyticsProperties | undefined,
  key: string
): string | undefined => {
  const value = properties?.[key];
  return typeof value === "string" ? value : undefined;
};

const getNumberProperty = (
  properties: AnalyticsProperties | undefined,
  key: string
): number | undefined => {
  const value = properties?.[key];
  return typeof value === "number" ? value : undefined;
};

const clearAuthTrackingState = (): void => {
  clearAnalyticsAuthAndCheckoutState();
  clearTrackedJobEvents();
};

export const identifyUser = (userId: string, userProperties?: AnalyticsProperties): void => {
  identifyAnalyticsUser(userId, userProperties);
};

export const resetUser = (): void => {
  clearAuthTrackingState();
  resetAnalyticsUser();
};

export const trackPageView = (pageName?: string): void => {
  const pagePath =
    pageName || (typeof window !== "undefined" ? window.location.pathname : undefined);

  if (!pagePath) {
    return;
  }

  trackAnalyticsPageView(pagePath);
};

export const trackEvent = (eventName: string, properties?: AnalyticsProperties): void => {
  trackAnalyticsEvent({
    eventName,
    name: "legacy.event",
    properties,
  });
};

export const setUserProperties = (properties: AnalyticsProperties): void => {
  setAnalyticsUserProperties(properties);
};

export const trackLogin = (method: AuthMethod, userId: string): void => {
  clearPendingAuthLogin();
  markAuthEventTracked();
  trackAnalyticsEvent({
    method,
    name: "auth.login",
    timestamp: createTimestamp(),
    userId,
  });
};

export const trackSignUp = (method: AuthMethod, userId: string): void => {
  clearPendingAuthLogin();
  markAuthEventTracked();
  trackAnalyticsEvent({
    method,
    name: "auth.signup",
    timestamp: createTimestamp(),
    userId,
  });
  void requestAcquisitionSessionBind({ userId }).catch((error: unknown): void => {
    console.error("Failed to bind acquisition attribution session:", error);
  });
};

export const trackApiKeyCreated = (keyId: string, keyName: string, source = "dashboard"): void => {
  trackAnalyticsEvent({
    keyId,
    keyName,
    name: "api_key.created",
    source,
    timestamp: createTimestamp(),
  });
};

export const trackApiKeyDeleted = (keyId: string): void => {
  trackAnalyticsEvent({
    keyId,
    name: "api_key.deleted",
    timestamp: createTimestamp(),
  });
};

export const trackCreditsPurchased = (
  amount: number,
  planType: string,
  transactionId: string
): void => {
  trackAnalyticsEvent({
    amount,
    name: "billing.credits_purchased",
    planType,
    timestamp: createTimestamp(),
    transactionId,
  });
};

export const trackSubscriptionPurchased = (planId: string, transactionId?: string): void => {
  trackAnalyticsEvent({
    name: "billing.subscription_purchased",
    planId,
    timestamp: createTimestamp(),
    transactionId: transactionId ?? "",
  });
};

export const trackCheckoutPurchaseUnknown = (
  transactionId: string,
  properties?: AnalyticsProperties
): void => {
  trackAnalyticsEvent({
    amount: getNumberProperty(properties, "amount"),
    name: "billing.checkout_purchase_unknown",
    planId: getStringProperty(properties, "plan_id"),
    properties,
    timestamp: createTimestamp(),
    transactionId,
  });
};

export const trackCheckoutStarted = (
  checkoutType: CheckoutType,
  properties?: AnalyticsProperties
): void => {
  const sessionId = getStringProperty(properties, "session_id") ?? "";
  const amount = getNumberProperty(properties, "amount");
  const planId = getStringProperty(properties, "plan_id");
  const priceId = getStringProperty(properties, "price_id");

  trackAnalyticsEvent({
    amount,
    checkoutType,
    name: "billing.checkout_started",
    planId,
    priceId,
    properties,
    sessionId,
    timestamp: createTimestamp(),
  });

  storePendingCheckout({
    amount,
    checkout_type: checkoutType,
    plan_id: planId,
    price_id: priceId,
    session_id: sessionId,
  });
};

export const trackCheckoutCanceled = (checkoutType?: CheckoutType): void => {
  trackAnalyticsEvent({
    checkoutType: checkoutType ?? "unknown",
    name: "billing.checkout_canceled",
    timestamp: createTimestamp(),
  });
};

export const trackBuyCreditsClicked = (source: string): void => {
  if (!shouldTrackBuyCreditsClick(source)) {
    return;
  }

  trackAnalyticsEvent({
    name: "billing.buy_credits_clicked",
    source,
    timestamp: createTimestamp(),
  });
};

export const trackContactSalesClicked = (sourceSection: string): void => {
  trackAnalyticsEvent({
    name: "marketing.contact_sales_clicked",
    sourceSection,
    timestamp: createTimestamp(),
  });
};

export const trackLandingCtaClick = (ctaId: string, properties?: AnalyticsProperties): void => {
  const defaultPagePath =
    typeof window !== "undefined"
      ? `${window.location.pathname}${window.location.search}`
      : undefined;
  const sourceSection = getStringProperty(properties, "source_section") ?? "unknown";

  trackAnalyticsEvent({
    ctaId,
    name: "marketing.landing_cta_clicked",
    pagePath: defaultPagePath,
    properties,
    sourceSection,
    timestamp: createTimestamp(),
  });
};

export const trackJobCreated = (
  jobType: "kb_management",
  jobId: string,
  sourceType: "direct_upload" | "url"
): void => {
  trackAnalyticsEvent({
    jobId,
    jobType,
    name: "job.created",
    sourceType,
    timestamp: createTimestamp(),
  });
};

export const trackJobCompleted = (
  jobType: "kb_management",
  jobId: string,
  processingTimeMs: number
): void => {
  trackAnalyticsEvent({
    jobId,
    jobType,
    name: "job.completed",
    processingTimeMs,
    timestamp: createTimestamp(),
  });
};

export const trackJobFailed = (
  jobType: "kb_management",
  jobId: string,
  errorMessage: string
): void => {
  trackAnalyticsEvent({
    errorMessage,
    jobId,
    jobType,
    name: "job.failed",
    timestamp: createTimestamp(),
  });
};

export const trackFileUpload = (
  fileType: string,
  fileSize: number,
  uploadMethod: "direct" | "url"
): void => {
  trackAnalyticsEvent({
    fileSize,
    fileType,
    name: "file.uploaded",
    timestamp: createTimestamp(),
    uploadMethod,
  });
};

export const trackWebhookConfigured = (webhookUrl: string): void => {
  trackAnalyticsEvent({
    name: "webhook.configured",
    timestamp: createTimestamp(),
    webhookUrl,
  });
};

export const trackWebhookSecretRevoked = (secretId: string): void => {
  trackAnalyticsEvent({
    name: "webhook.secret_revoked",
    secretId,
    timestamp: createTimestamp(),
  });
};

export const trackError = (errorMessage: string, errorContext?: AnalyticsProperties): void => {
  trackAnalyticsEvent({
    errorContext,
    errorMessage,
    name: "error.occurred",
    timestamp: createTimestamp(),
  });
};

export const trackFeatureUsage = (featureName: string, properties?: AnalyticsProperties): void => {
  trackAnalyticsEvent({
    featureName,
    name: "feature.used",
    properties,
    timestamp: createTimestamp(),
  });
};

const getPostHog = (): PostHog | null => getPostHogClient();

export default getPostHog;
