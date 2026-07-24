import { createGoogleAnalyticsAdapter } from "@/lib/analytics/adapters/google-analytics";
import { createOpenAIAdsAdapter } from "@/lib/analytics/adapters/openai-ads";
import { createPostHogAnalyticsAdapter } from "@/lib/analytics/adapters/posthog";
import { type AnalyticsConfig, createAnalyticsController } from "@/lib/analytics/core";
import type { AnalyticsEvent, AnalyticsProperties } from "@/lib/analytics/types";

export {
  buildAnalyticsAuthCallbackURL,
  buildAnalyticsAuthCleanupPath,
  clearAnalyticsAuthAndCheckoutState,
  clearPendingAuthLogin,
  consumePendingCheckout,
  consumePendingMagicLinkAuth,
  getAnalyticsAuthCallbackURL,
  hasPendingAuthLogin,
  isAuthEventTracked,
  isLikelyNewUser,
  markAuthEventTracked,
  markPendingAuthLogin,
  markPendingMagicLinkAuth,
  NEW_USER_WINDOW_MS,
  peekPendingCheckout,
  shouldTrackBuyCreditsClick,
  storePendingCheckout,
} from "@/lib/analytics/client-state";
export type {
  AnalyticsEvent,
  AnalyticsProperties,
  AuthMethod,
  CheckoutType,
  NormalizedCheckoutType,
  PendingCheckout,
} from "@/lib/analytics/types";

const analyticsController = createAnalyticsController([
  createPostHogAnalyticsAdapter(),
  createGoogleAnalyticsAdapter(),
  createOpenAIAdsAdapter(),
]);

export function initializeAnalytics(config: AnalyticsConfig = {}): void {
  analyticsController.initialize(config);
}

export function trackAnalyticsEvent(event: AnalyticsEvent): void {
  analyticsController.trackEvent(event);
}

export function trackAnalyticsPageView(pagePath: string): void {
  analyticsController.trackPageView(pagePath);
}

export function identifyAnalyticsUser(userId: string, properties?: AnalyticsProperties): void {
  analyticsController.identifyUser(userId, properties);
}

export function resetAnalyticsUser(): void {
  analyticsController.resetUser();
}

export function setAnalyticsUserProperties(properties: AnalyticsProperties): void {
  analyticsController.setUserProperties(properties);
}

export function isAnalyticsEventTrackingEnabled(): boolean {
  return analyticsController.hasEnabledEventAdapter();
}
