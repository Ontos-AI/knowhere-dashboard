type GAEventParams = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export const trackGAEvent = (eventName: string, params?: GAEventParams) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  const cleanedParams = params
    ? Object.fromEntries(
        Object.entries(params).filter((entry): entry is [string, string | number | boolean] => {
          return entry[1] !== undefined;
        })
      )
    : undefined;

  window.gtag("event", eventName, cleanedParams);
};

export const setGAUserId = (userId: string | null) => {
  if (typeof window === "undefined" || typeof window.gtag !== "function") {
    return;
  }

  if (userId) {
    window.gtag("set", { user_id: userId });
    return;
  }

  window.gtag("set", { user_id: undefined });
};

export const mirrorAuthLogin = (method: string) => {
  trackGAEvent("login", { method });
};

export const mirrorAuthSignUp = (method: string) => {
  trackGAEvent("sign_up", { method });
};

export const mirrorApiKeyCreated = (source: string) => {
  trackGAEvent("api_key_created", { source });
};

export const mirrorBuyCreditsClicked = (source: string) => {
  trackGAEvent("buy_credits_clicked", { source });
};

export const mirrorLandingCtaClick = (ctaId: string, sourceSection: string) => {
  trackGAEvent("select_content", {
    content_type: "landing_cta",
    item_id: ctaId,
    source_section: sourceSection,
  });
};

export const mirrorContactSalesClick = (sourceSection: string) => {
  trackGAEvent("generate_lead", {
    lead_source: sourceSection,
  });
};

export const mirrorCheckoutStarted = (checkoutType: string) => {
  trackGAEvent("begin_checkout", {
    checkout_type: checkoutType,
  });
};

export const mirrorCheckoutCanceled = (checkoutType: string) => {
  trackGAEvent("checkout_canceled", {
    checkout_type: checkoutType,
  });
};

export const mirrorCreditsPurchased = (amount: number, transactionId: string) => {
  trackGAEvent("purchase", {
    currency: "USD",
    transaction_id: transactionId,
    value: amount,
    item_category: "credits_package",
  });
};

export const mirrorSubscriptionPurchased = (planId: string, transactionId: string) => {
  trackGAEvent("purchase", {
    currency: "USD",
    transaction_id: transactionId,
    item_category: "subscription",
    item_id: planId,
  });
};

export const mirrorCheckoutPurchaseUnknown = (
  transactionId: string,
  amount?: number,
  planId?: string
) => {
  trackGAEvent("checkout_purchase_unknown", {
    transaction_id: transactionId,
    amount,
    plan_id: planId,
  });
};

export const mirrorJobCreated = (sourceType: string) => {
  trackGAEvent("job_created", {
    source_type: sourceType,
  });
};

export const mirrorJobCompleted = (processingTimeMs: number) => {
  trackGAEvent("job_completed", {
    processing_time_ms: processingTimeMs,
  });
};

export const mirrorJobFailed = (errorMessage: string) => {
  trackGAEvent("job_failed", {
    error_message: errorMessage,
  });
};

export const mirrorFileUploaded = (fileType: string, uploadMethod: string) => {
  trackGAEvent("file_uploaded", {
    file_type: fileType,
    upload_method: uploadMethod,
  });
};

export const mirrorPlaygroundParseStarted = (fileName: string) => {
  trackGAEvent("playground_parse_started", {
    file_name: fileName,
  });
};
