export type AnalyticsProperties = Record<string, unknown>;

export type AuthMethod = "apple" | "email" | "github" | "google";

export type CheckoutType = "credits_package" | "subscription";

export type NormalizedCheckoutType = CheckoutType | "unknown";

export type PendingCheckout = {
  readonly checkout_type: CheckoutType;
  readonly session_id: string;
  readonly amount?: number;
  readonly plan_id?: string;
  readonly price_id?: string;
};

export type AnalyticsEvent =
  | {
      readonly name: "auth.login";
      readonly method: AuthMethod;
      readonly userId: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "auth.signup";
      readonly method: AuthMethod;
      readonly userId: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "api_key.created";
      readonly keyId: string;
      readonly keyName: string;
      readonly source: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "api_key.deleted";
      readonly keyId: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "billing.credits_purchased";
      readonly amount: number;
      readonly planType: string;
      readonly transactionId: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "billing.subscription_purchased";
      readonly planId: string;
      readonly transactionId: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "billing.checkout_purchase_unknown";
      readonly transactionId: string;
      readonly amount?: number;
      readonly planId?: string;
      readonly properties?: AnalyticsProperties;
      readonly timestamp: string;
    }
  | {
      readonly name: "billing.checkout_started";
      readonly checkoutType: CheckoutType;
      readonly amount?: number;
      readonly planId?: string;
      readonly priceId?: string;
      readonly sessionId?: string;
      readonly properties?: AnalyticsProperties;
      readonly timestamp: string;
    }
  | {
      readonly name: "billing.checkout_canceled";
      readonly checkoutType: NormalizedCheckoutType;
      readonly timestamp: string;
    }
  | {
      readonly name: "billing.buy_credits_clicked";
      readonly source: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "marketing.contact_sales_clicked";
      readonly sourceSection: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "marketing.landing_cta_clicked";
      readonly ctaId: string;
      readonly pagePath?: string;
      readonly properties?: AnalyticsProperties;
      readonly sourceSection: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "job.created";
      readonly jobType: "kb_management";
      readonly jobId: string;
      readonly sourceType: "direct_upload" | "url";
      readonly timestamp: string;
    }
  | {
      readonly name: "job.completed";
      readonly jobType: "kb_management";
      readonly jobId: string;
      readonly processingTimeMs: number;
      readonly timestamp: string;
    }
  | {
      readonly name: "job.failed";
      readonly jobType: "kb_management";
      readonly jobId: string;
      readonly errorMessage: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "file.uploaded";
      readonly fileType: string;
      readonly fileSize: number;
      readonly uploadMethod: "direct" | "url";
      readonly timestamp: string;
    }
  | {
      readonly name: "webhook.configured";
      readonly webhookUrl: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "webhook.secret_revoked";
      readonly secretId: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "error.occurred";
      readonly errorContext?: AnalyticsProperties;
      readonly errorMessage: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "feature.used";
      readonly featureName: string;
      readonly properties?: AnalyticsProperties;
      readonly timestamp: string;
    }
  | {
      readonly name: "playground.parse_started";
      readonly fileName: string;
      readonly timestamp: string;
    }
  | {
      readonly name: "legacy.event";
      readonly eventName: string;
      readonly properties?: AnalyticsProperties;
    };
