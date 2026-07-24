import {
  setGoogleAnalyticsUserId,
  trackGoogleAnalyticsEvent,
} from "@/lib/analytics/adapters/google-analytics";

type GAEventParams = Record<string, string | number | boolean | undefined>;

export const trackGAEvent = (eventName: string, params?: GAEventParams): void => {
  trackGoogleAnalyticsEvent(eventName, params);
};

export const setGAUserId = (userId: string | null): void => {
  setGoogleAnalyticsUserId(userId);
};

export const mirrorAuthLogin = (method: string): void => {
  trackGAEvent("login", { method });
};

export const mirrorAuthSignUp = (method: string): void => {
  trackGAEvent("sign_up", { method });
};

export const mirrorApiKeyCreated = (source: string): void => {
  trackGAEvent("api_key_created", { source });
};

export const mirrorBuyCreditsClicked = (source: string): void => {
  trackGAEvent("buy_credits_clicked", { source });
};

export const mirrorLandingCtaClick = (ctaId: string, sourceSection: string): void => {
  trackGAEvent("select_content", {
    content_type: "landing_cta",
    item_id: ctaId,
    source_section: sourceSection,
  });
};

export const mirrorContactSalesClick = (sourceSection: string): void => {
  trackGAEvent("generate_lead", {
    lead_source: sourceSection,
  });
};

export const mirrorCheckoutStarted = (checkoutType: string): void => {
  trackGAEvent("begin_checkout", {
    checkout_type: checkoutType,
  });
};

export const mirrorCheckoutCanceled = (checkoutType: string): void => {
  trackGAEvent("checkout_canceled", {
    checkout_type: checkoutType,
  });
};

export const mirrorCreditsPurchased = (amount: number, transactionId: string): void => {
  trackGAEvent("purchase", {
    currency: "USD",
    item_category: "credits_package",
    transaction_id: transactionId,
    value: amount,
  });
};

export const mirrorSubscriptionPurchased = (planId: string, transactionId: string): void => {
  trackGAEvent("purchase", {
    currency: "USD",
    item_category: "subscription",
    item_id: planId,
    transaction_id: transactionId,
  });
};

export const mirrorCheckoutPurchaseUnknown = (
  transactionId: string,
  amount?: number,
  planId?: string
): void => {
  trackGAEvent("checkout_purchase_unknown", {
    amount,
    plan_id: planId,
    transaction_id: transactionId,
  });
};

export const mirrorJobCreated = (sourceType: string): void => {
  trackGAEvent("job_created", {
    source_type: sourceType,
  });
};

export const mirrorJobCompleted = (processingTimeMs: number): void => {
  trackGAEvent("job_completed", {
    processing_time_ms: processingTimeMs,
  });
};

export const mirrorJobFailed = (errorMessage: string): void => {
  trackGAEvent("job_failed", {
    error_message: errorMessage,
  });
};

export const mirrorFileUploaded = (fileType: string, uploadMethod: string): void => {
  trackGAEvent("file_uploaded", {
    file_type: fileType,
    upload_method: uploadMethod,
  });
};

export const mirrorPlaygroundParseStarted = (fileName: string): void => {
  trackGAEvent("playground_parse_started", {
    file_name: fileName,
  });
};
