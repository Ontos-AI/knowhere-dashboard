export const BLOG_EMAIL_CURSOR_ID = "default";
export const BLOG_EMAIL_SETTINGS_ID = "default";
export const BLOG_EMAIL_PREVIEW_REQUEST_ID = "default";
export const BLOG_EMAIL_BATCH_SIZE = 100;
export const BLOG_EMAIL_BODY_BYTE_LIMIT = 80 * 1024;

export type BlogDispatchStatus = "skipped" | "queued" | "sending" | "sent" | "failed";
export type BlogDeliverySource = "preview" | "test" | "live";
export type BlogDeliveryStatus = "sent" | "failed";
export type BlogEmailPreviewResultStatus =
  | "already_sent"
  | "failed"
  | "missing_test_recipient"
  | "no_post"
  | "sent";

export type BlogEmailConfig = {
  readonly audienceLive: boolean;
  readonly enabled: boolean;
  readonly testRecipient: string | null;
};

export type BlogEmailSettingsRecord = {
  readonly audience: string;
  readonly enabled: boolean;
  readonly testRecipient: string | null;
  readonly updatedAt: Date | null;
};

export type BlogEmailPreviewCompletion = {
  readonly completedAt: Date;
  readonly message: string | null;
  readonly requestedAt: Date;
  readonly result: BlogEmailPreviewResultStatus;
  readonly wordpressPostId: string | null;
};

export type BlogEmailPostSummary = {
  readonly permalinkUrl: string;
  readonly publishedAt: Date;
  readonly title: string;
  readonly wordpressPostId: string;
};

export type BlogEmailPost = BlogEmailPostSummary & {
  readonly contentHtml: string;
  readonly coverAlt: string;
  readonly coverUrl: string | null;
  readonly excerpt: string;
};

export type BlogDispatchRecord = {
  readonly lastError: string | null;
  readonly permalinkUrl: string | null;
  readonly publishedAt: Date;
  readonly sentAt: Date | null;
  readonly status: BlogDispatchStatus;
  readonly title: string;
  readonly wordpressPostId: string;
};

export type BlogDeliveryRecord = {
  readonly createdAt: Date;
  readonly email: string;
  readonly error: string | null;
  readonly id: string;
  readonly postTitle: string;
  readonly resendId: string | null;
  readonly sentAt: Date | null;
  readonly source: BlogDeliverySource;
  readonly status: BlogDeliveryStatus;
  readonly updatedAt: Date;
  readonly wordpressPostId: string;
};

export type BlogEmailSubscriptionRow = {
  readonly email: string;
  readonly status: string;
};

export type BlogEmailUserRow = {
  readonly email: string;
  readonly emailVerified: boolean;
};

export type BlogEmailMessage = {
  readonly headers: {
    readonly "List-Unsubscribe": string;
    readonly "List-Unsubscribe-Post": "List-Unsubscribe=One-Click";
  };
  readonly html: string;
  readonly subject: string;
  readonly text: string;
  readonly to: string;
};

export type BlogEmailSendBatch = {
  readonly idempotencyKey: string;
  readonly messages: readonly BlogEmailMessage[];
};

export type BlogEmailSendResult =
  | { readonly ids: readonly string[]; readonly ok: true }
  | { readonly error: string; readonly ok: false };

export type BlogDispatchPatch = {
  readonly lastError?: string | null;
  readonly sentAt?: Date | null;
  readonly status: BlogDispatchStatus;
  readonly updatedAt: Date;
};

export type BlogEmailStore = {
  readonly completePreviewRequest: (completion: BlogEmailPreviewCompletion) => Promise<void>;
  readonly findNextLiveDispatch: () => Promise<BlogDispatchRecord | null>;
  readonly findNextTestDispatch: (email: string) => Promise<BlogDispatchRecord | null>;
  readonly getDelivery: (
    wordpressPostId: string,
    email: string
  ) => Promise<BlogDeliveryRecord | null>;
  readonly getDispatch: (wordpressPostId: string) => Promise<BlogDispatchRecord | null>;
  readonly getSeededAt: () => Promise<Date | null>;
  readonly getSettings: () => Promise<BlogEmailSettingsRecord>;
  readonly listSuccessfulDeliveryEmails: (wordpressPostId: string) => Promise<readonly string[]>;
  readonly listSuppressedEmails: () => Promise<readonly string[]>;
  readonly queueUnseenPosts: (posts: readonly BlogEmailPostSummary[]) => Promise<readonly string[]>;
  readonly saveDeliveries: (records: readonly BlogDeliveryRecord[]) => Promise<void>;
  readonly seedSkippedPosts: (
    posts: readonly BlogEmailPostSummary[],
    seededAt: Date
  ) => Promise<void>;
  readonly catalogSkippedPosts: (
    posts: readonly BlogEmailPostSummary[],
    seededAt: Date
  ) => Promise<void>;
  readonly takePendingManualSend: () => Promise<{
    readonly email: string;
    readonly requestedAt: Date;
    readonly wordpressPostId: string;
  } | null>;
  readonly takePendingPreviewRequest: () => Promise<{ readonly requestedAt: Date } | null>;
  readonly updateDispatch: (wordpressPostId: string, patch: BlogDispatchPatch) => Promise<void>;
};

export type BlogEmailRuntime = {
  readonly appUrl: string;
  readonly batchSize: number;
  readonly createDeliveryId: () => string;
  readonly getLatestPublishedPost: () => Promise<BlogEmailPost | null>;
  readonly getPublishedPost: (wordpressPostId: string) => Promise<BlogEmailPost | null>;
  readonly listPublishedPosts: () => Promise<readonly BlogEmailPostSummary[]>;
  readonly loadSubscriptions: () => Promise<readonly BlogEmailSubscriptionRow[]>;
  readonly loadUsers: () => Promise<readonly BlogEmailUserRow[]>;
  readonly now: () => Date;
  readonly sendBatch: (batch: BlogEmailSendBatch) => Promise<BlogEmailSendResult>;
  readonly store: BlogEmailStore;
  readonly unsubscribeSecret: string;
  readonly wordpressOrigin: string;
};

export type BlogEmailCronResult =
  | { readonly postCount: number; readonly status: "seeded" }
  | { readonly message: string; readonly status: "seed_failed" }
  | { readonly message: string; readonly status: "poll_failed" }
  | { readonly reason: "missing_test_recipient"; readonly status: "held" }
  | { readonly status: "disabled" }
  | { readonly status: "idle" }
  | { readonly status: "manual_already_sent"; readonly wordpressPostId: string }
  | { readonly message: string; readonly status: "manual_failed"; readonly wordpressPostId: string }
  | { readonly status: "manual_no_post"; readonly wordpressPostId: string }
  | { readonly status: "manual_sent"; readonly wordpressPostId: string }
  | { readonly status: "skipped_missing"; readonly wordpressPostId: string }
  | { readonly status: "test_sent"; readonly wordpressPostId: string }
  | { readonly message: string; readonly status: "test_failed"; readonly wordpressPostId: string }
  | {
      readonly recipientCount: number;
      readonly status: "live_sent";
      readonly wordpressPostId: string;
    }
  | {
      readonly message: string;
      readonly status: "live_incomplete";
      readonly wordpressPostId: string;
    };

export type BlogEmailPreviewResult =
  | { readonly status: "missing_test_recipient" }
  | { readonly status: "no_post" }
  | { readonly status: "already_sent"; readonly wordpressPostId: string }
  | { readonly status: "sent"; readonly wordpressPostId: string }
  | { readonly message: string; readonly status: "failed"; readonly wordpressPostId: string };
