import { emailsForLiveAudience } from "@lib/blog-email/audience";
import { normalizeNewsletterEmail } from "@lib/blog-email/email";
import { readBlogEmailSettings } from "@lib/blog-email/mode";
import { renderBlogEmail } from "@lib/blog-email/template";
import {
  createBlogUnsubscribeOneClickUrl,
  createBlogUnsubscribeUrl,
  signBlogUnsubscribeToken,
} from "@lib/blog-email/token";
import type {
  BlogDeliverySource,
  BlogEmailConfig,
  BlogEmailCronResult,
  BlogEmailMessage,
  BlogEmailPost,
  BlogEmailPreviewResult,
  BlogEmailRuntime,
} from "@lib/blog-email/types";

function errorMessage(error: unknown, fallback: string): string {
  return error instanceof Error && error.message ? error.message : fallback;
}

function buildMessage(
  runtime: BlogEmailRuntime,
  post: BlogEmailPost,
  email: string
): BlogEmailMessage {
  const token = signBlogUnsubscribeToken(email, runtime.unsubscribeSecret);
  const unsubscribeUrl = createBlogUnsubscribeUrl(runtime.appUrl, token);
  const oneClickUrl = createBlogUnsubscribeOneClickUrl(runtime.appUrl, token);
  const rendered = renderBlogEmail({
    post,
    unsubscribeUrl,
    wordpressOrigin: runtime.wordpressOrigin,
  });

  return {
    headers: {
      "List-Unsubscribe": `<${oneClickUrl}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
    html: rendered.html,
    subject: rendered.subject,
    text: rendered.text,
    to: email,
  };
}

async function saveOutcome(
  runtime: BlogEmailRuntime,
  post: Pick<BlogEmailPost, "title" | "wordpressPostId">,
  recipients: readonly string[],
  source: BlogDeliverySource,
  outcome:
    | { readonly ids: readonly string[]; readonly ok: true }
    | { readonly error: string; readonly ok: false }
): Promise<void> {
  const now = runtime.now();
  await runtime.store.saveDeliveries(
    recipients.map((email, index) => {
      const resendId = outcome.ok ? outcome.ids[index] : undefined;
      const sent = typeof resendId === "string" && resendId.length > 0;
      return {
        createdAt: now,
        email,
        error: sent ? null : outcome.ok ? "Resend did not accept this recipient" : outcome.error,
        id: runtime.createDeliveryId(),
        postTitle: post.title,
        resendId: sent ? resendId : null,
        sentAt: sent ? now : null,
        source,
        status: sent ? "sent" : "failed",
        updatedAt: now,
        wordpressPostId: post.wordpressPostId,
      };
    })
  );
}

async function sendRecipientBatch(
  runtime: BlogEmailRuntime,
  post: BlogEmailPost,
  recipients: readonly string[],
  source: BlogDeliverySource,
  scope: string
): Promise<{ readonly ok: true } | { readonly message: string; readonly ok: false }> {
  const messages = recipients.map((email) => buildMessage(runtime, post, email));
  let result: Awaited<ReturnType<BlogEmailRuntime["sendBatch"]>>;
  try {
    result = await runtime.sendBatch({
      idempotencyKey: `${post.wordpressPostId}:${source}:${scope}`,
      messages,
    });
  } catch (error) {
    result = { error: errorMessage(error, "Email send failed"), ok: false };
  }

  const accepted =
    result.ok && result.ids.length === recipients.length && result.ids.every((id) => id.length > 0);
  const outcome = accepted
    ? result
    : {
        error: result.ok ? "Resend did not accept every recipient in the batch" : result.error,
        ok: false as const,
      };
  await saveOutcome(runtime, post, recipients, source, outcome);
  return outcome.ok ? { ok: true } : { message: outcome.error, ok: false };
}

async function deliverToAudience(
  runtime: BlogEmailRuntime,
  post: BlogEmailPost,
  fullAudience: readonly string[],
  source: BlogDeliverySource
): Promise<{ readonly ok: true } | { readonly message: string; readonly ok: false }> {
  const batchSize = Math.max(1, runtime.batchSize);
  const sent = new Set(
    (await runtime.store.listSuccessfulDeliveryEmails(post.wordpressPostId)).map((email) =>
      normalizeNewsletterEmail(email)
    )
  );
  const groups = new Map<number, string[]>();
  fullAudience.forEach((email, index) => {
    if (sent.has(email)) {
      return;
    }

    const batchIndex = Math.floor(index / batchSize);
    const group = groups.get(batchIndex) ?? [];
    group.push(email);
    groups.set(batchIndex, group);
  });

  for (const batchIndex of Array.from(groups.keys()).sort((left, right) => left - right)) {
    const recipients = groups.get(batchIndex) ?? [];
    const outcome = await sendRecipientBatch(runtime, post, recipients, source, String(batchIndex));
    if (!outcome.ok) {
      return outcome;
    }
  }

  return { ok: true };
}

async function recordTestFailure(
  runtime: BlogEmailRuntime,
  post: Pick<BlogEmailPost, "title" | "wordpressPostId">,
  email: string,
  message: string
): Promise<void> {
  await saveOutcome(runtime, post, [email], "test", { error: message, ok: false });
}

async function sendNextTestPost(
  runtime: BlogEmailRuntime,
  email: string
): Promise<BlogEmailCronResult> {
  const dispatch = await runtime.store.findNextTestDispatch(email);
  if (!dispatch) {
    return { status: "idle" };
  }

  let post: BlogEmailPost | null;
  try {
    post = await runtime.getPublishedPost(dispatch.wordpressPostId);
  } catch (error) {
    const message = errorMessage(error, "WordPress request failed");
    await recordTestFailure(
      runtime,
      { title: dispatch.title, wordpressPostId: dispatch.wordpressPostId },
      email,
      message
    );
    return { message, status: "test_failed", wordpressPostId: dispatch.wordpressPostId };
  }

  if (!post) {
    return skipMissingPost(runtime, dispatch.wordpressPostId);
  }

  const existing = await runtime.store.getDelivery(post.wordpressPostId, email);
  if (existing?.status === "sent") {
    return { status: "idle" };
  }

  const outcome = await deliverToAudience(runtime, post, [email], "test");
  if (!outcome.ok) {
    return {
      message: outcome.message,
      status: "test_failed",
      wordpressPostId: post.wordpressPostId,
    };
  }

  return { status: "test_sent", wordpressPostId: post.wordpressPostId };
}

async function skipMissingPost(
  runtime: BlogEmailRuntime,
  wordpressPostId: string
): Promise<BlogEmailCronResult> {
  const now = runtime.now();
  await runtime.store.updateDispatch(wordpressPostId, {
    lastError: "WordPress post is no longer published",
    status: "skipped",
    updatedAt: now,
  });
  return { status: "skipped_missing", wordpressPostId };
}

async function markDispatch(
  runtime: BlogEmailRuntime,
  wordpressPostId: string,
  status: "failed" | "sending" | "sent",
  lastError: string | null
): Promise<void> {
  const now = runtime.now();
  await runtime.store.updateDispatch(wordpressPostId, {
    lastError,
    sentAt: status === "sent" ? now : undefined,
    status,
    updatedAt: now,
  });
}

async function sendNextLivePost(runtime: BlogEmailRuntime): Promise<BlogEmailCronResult> {
  const dispatch = await runtime.store.findNextLiveDispatch();
  if (!dispatch) {
    return { status: "idle" };
  }

  await markDispatch(runtime, dispatch.wordpressPostId, "sending", null);

  let post: BlogEmailPost | null;
  try {
    post = await runtime.getPublishedPost(dispatch.wordpressPostId);
  } catch (error) {
    const message = errorMessage(error, "WordPress request failed");
    await markDispatch(runtime, dispatch.wordpressPostId, "failed", message);
    return { message, status: "live_incomplete", wordpressPostId: dispatch.wordpressPostId };
  }

  if (!post) {
    return skipMissingPost(runtime, dispatch.wordpressPostId);
  }

  let subscriptions: Awaited<ReturnType<BlogEmailRuntime["loadSubscriptions"]>>;
  let users: Awaited<ReturnType<BlogEmailRuntime["loadUsers"]>>;
  let suppressed: readonly string[];
  try {
    [subscriptions, users, suppressed] = await Promise.all([
      runtime.loadSubscriptions(),
      runtime.loadUsers(),
      runtime.store.listSuppressedEmails(),
    ]);
  } catch (error) {
    const message = errorMessage(error, "Audience lookup failed");
    await markDispatch(runtime, post.wordpressPostId, "failed", message);
    return { message, status: "live_incomplete", wordpressPostId: post.wordpressPostId };
  }

  const audienceInput = {
    subscriptions,
    suppressedEmails: suppressed,
    users,
  };
  const fullAudience = emailsForLiveAudience({ ...audienceInput, alreadySentEmails: [] });
  if (fullAudience.length === 0) {
    await markDispatch(runtime, post.wordpressPostId, "sent", null);
    return { recipientCount: 0, status: "live_sent", wordpressPostId: post.wordpressPostId };
  }

  const outcome = await deliverToAudience(runtime, post, fullAudience, "live");
  if (!outcome.ok) {
    await markDispatch(runtime, post.wordpressPostId, "failed", outcome.message);
    return {
      message: outcome.message,
      status: "live_incomplete",
      wordpressPostId: post.wordpressPostId,
    };
  }

  const sent = await runtime.store.listSuccessfulDeliveryEmails(post.wordpressPostId);
  const stillPending = emailsForLiveAudience({ ...audienceInput, alreadySentEmails: sent });
  if (stillPending.length > 0) {
    const message = "Some recipients were not accepted";
    await markDispatch(runtime, post.wordpressPostId, "failed", message);
    return { message, status: "live_incomplete", wordpressPostId: post.wordpressPostId };
  }

  await markDispatch(runtime, post.wordpressPostId, "sent", null);
  return {
    recipientCount: fullAudience.length,
    status: "live_sent",
    wordpressPostId: post.wordpressPostId,
  };
}

async function sendPreview(
  runtime: BlogEmailRuntime,
  settings: BlogEmailConfig
): Promise<BlogEmailPreviewResult> {
  const email = settings.testRecipient;
  if (!email) {
    return { status: "missing_test_recipient" };
  }

  const post = await runtime.getLatestPublishedPost();
  if (!post) {
    return { status: "no_post" };
  }

  const existing = await runtime.store.getDelivery(post.wordpressPostId, email);
  if (existing?.status === "sent") {
    return { status: "already_sent", wordpressPostId: post.wordpressPostId };
  }

  const outcome = await deliverToAudience(runtime, post, [email], "preview");
  if (!outcome.ok) {
    return { message: outcome.message, status: "failed", wordpressPostId: post.wordpressPostId };
  }

  return { status: "sent", wordpressPostId: post.wordpressPostId };
}

function manualRecipient(email: string): string | null {
  const normalized = normalizeNewsletterEmail(email);
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized) ? normalized : null;
}

async function finishManualSend(
  runtime: BlogEmailRuntime,
  pending: { readonly requestedAt: Date; readonly wordpressPostId: string },
  result: BlogEmailPreviewResult,
  cronResult: BlogEmailCronResult
): Promise<BlogEmailCronResult> {
  await runtime.store.completePreviewRequest({
    completedAt: runtime.now(),
    message: result.status === "failed" ? result.message : null,
    requestedAt: pending.requestedAt,
    result: result.status,
    wordpressPostId: pending.wordpressPostId,
  });
  return cronResult;
}

async function performPendingManualSend(
  runtime: BlogEmailRuntime
): Promise<BlogEmailCronResult | null> {
  const pending = await runtime.store.takePendingManualSend();
  if (!pending) {
    return null;
  }

  const email = manualRecipient(pending.email);
  if (!email) {
    return finishManualSend(
      runtime,
      pending,
      { message: "Invalid email", status: "failed", wordpressPostId: pending.wordpressPostId },
      {
        message: "Invalid email",
        status: "manual_failed",
        wordpressPostId: pending.wordpressPostId,
      }
    );
  }

  try {
    const post = await runtime.getPublishedPost(pending.wordpressPostId);
    if (!post) {
      const dispatch = await runtime.store.getDispatch(pending.wordpressPostId);
      await saveOutcome(
        runtime,
        {
          title: dispatch?.title ?? pending.wordpressPostId,
          wordpressPostId: pending.wordpressPostId,
        },
        [email],
        "preview",
        { error: "WordPress post is no longer published", ok: false }
      );
      return finishManualSend(
        runtime,
        pending,
        { status: "no_post" },
        {
          status: "manual_no_post",
          wordpressPostId: pending.wordpressPostId,
        }
      );
    }

    const existing = await runtime.store.getDelivery(post.wordpressPostId, email);
    if (existing?.status === "sent") {
      return finishManualSend(
        runtime,
        pending,
        { status: "already_sent", wordpressPostId: post.wordpressPostId },
        { status: "manual_already_sent", wordpressPostId: post.wordpressPostId }
      );
    }

    const outcome = await sendRecipientBatch(runtime, post, [email], "preview", email);
    if (!outcome.ok) {
      return finishManualSend(
        runtime,
        pending,
        {
          message: outcome.message,
          status: "failed",
          wordpressPostId: post.wordpressPostId,
        },
        {
          message: outcome.message,
          status: "manual_failed",
          wordpressPostId: post.wordpressPostId,
        }
      );
    }

    return finishManualSend(
      runtime,
      pending,
      { status: "sent", wordpressPostId: post.wordpressPostId },
      { status: "manual_sent", wordpressPostId: post.wordpressPostId }
    );
  } catch (error) {
    const message = errorMessage(error, "Email send failed");
    return finishManualSend(
      runtime,
      pending,
      { message, status: "failed", wordpressPostId: pending.wordpressPostId },
      { message, status: "manual_failed", wordpressPostId: pending.wordpressPostId }
    );
  }
}

async function performPendingPreview(
  runtime: BlogEmailRuntime,
  settings: BlogEmailConfig
): Promise<void> {
  const pending = await runtime.store.takePendingPreviewRequest();
  if (!pending) {
    return;
  }

  try {
    const outcome = await sendPreview(runtime, settings);
    await runtime.store.completePreviewRequest({
      completedAt: runtime.now(),
      message: outcome.status === "failed" ? outcome.message : null,
      requestedAt: pending.requestedAt,
      result: outcome.status,
      wordpressPostId: "wordpressPostId" in outcome ? outcome.wordpressPostId : null,
    });
  } catch (error) {
    await runtime.store.completePreviewRequest({
      completedAt: runtime.now(),
      message: errorMessage(error, "Preview failed"),
      requestedAt: pending.requestedAt,
      result: "failed",
      wordpressPostId: null,
    });
  }
}

async function catalogWhileAutomaticSendingIsOff(
  runtime: BlogEmailRuntime
): Promise<BlogEmailCronResult> {
  try {
    const posts = await runtime.listPublishedPosts();
    await runtime.store.catalogSkippedPosts(posts, runtime.now());
    return { status: "disabled" };
  } catch (error) {
    return { message: errorMessage(error, "WordPress poll failed"), status: "poll_failed" };
  }
}

export async function runBlogEmailCron(runtime: BlogEmailRuntime): Promise<BlogEmailCronResult> {
  const manual = await performPendingManualSend(runtime);
  if (manual) {
    return manual;
  }

  const settings = readBlogEmailSettings(await runtime.store.getSettings());
  if (!settings.enabled) {
    return catalogWhileAutomaticSendingIsOff(runtime);
  }

  await performPendingPreview(runtime, settings);

  const seededAt = await runtime.store.getSeededAt();
  if (!seededAt) {
    try {
      const posts = await runtime.listPublishedPosts();
      await runtime.store.seedSkippedPosts(posts, runtime.now());
      return { postCount: posts.length, status: "seeded" };
    } catch (error) {
      return { message: errorMessage(error, "WordPress poll failed"), status: "seed_failed" };
    }
  }

  try {
    const posts = await runtime.listPublishedPosts();
    await runtime.store.queueUnseenPosts(posts);
  } catch (error) {
    return { message: errorMessage(error, "WordPress poll failed"), status: "poll_failed" };
  }

  for (let attempt = 0; attempt < 100; attempt += 1) {
    const result = await dispatchNextPost(runtime, settings);
    if (result.status !== "skipped_missing") {
      return result;
    }
  }

  return { message: "Too many unpublished WordPress posts in a row", status: "poll_failed" };
}

async function dispatchNextPost(
  runtime: BlogEmailRuntime,
  settings: BlogEmailConfig
): Promise<BlogEmailCronResult> {
  if (settings.audienceLive) {
    return sendNextLivePost(runtime);
  }

  if (!settings.testRecipient) {
    return { reason: "missing_test_recipient", status: "held" };
  }

  return sendNextTestPost(runtime, settings.testRecipient);
}
