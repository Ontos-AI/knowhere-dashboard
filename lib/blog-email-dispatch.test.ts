import { emailsForLiveAudience } from "@lib/blog-email/audience";
import { isAuthorizedCronRequest } from "@lib/blog-email/cron-auth";
import { runBlogEmailCron } from "@lib/blog-email/dispatch";
import { readBlogEmailSettings } from "@lib/blog-email/mode";
import { renderBlogEmail } from "@lib/blog-email/template";
import {
  createBlogUnsubscribeUrl,
  readBlogUnsubscribeToken,
  signBlogUnsubscribeToken,
  unsubscribeWithSignedToken,
} from "@lib/blog-email/token";
import {
  BLOG_EMAIL_BATCH_SIZE,
  BLOG_EMAIL_BODY_BYTE_LIMIT,
  type BlogDeliveryRecord,
  type BlogDispatchRecord,
  type BlogEmailPost,
  type BlogEmailPreviewCompletion,
  type BlogEmailRuntime,
  type BlogEmailSendBatch,
  type BlogEmailSettingsRecord,
  type BlogEmailStore,
} from "@lib/blog-email/types";
import { describe, expect, it, type Mock, vi } from "vitest";

const SECRET = "test-auth-secret-with-at-least-32-chars";
const TEST_RECIPIENT = "qa@example.com";

function deliveryKey(wordpressPostId: string, email: string): string {
  return `${wordpressPostId}\u0000${email}`;
}

type MemoryPreview = {
  completedAt: Date | null;
  email: string | null;
  message: string | null;
  requestedAt: Date;
  result: BlogEmailPreviewCompletion["result"] | null;
  status: "completed" | "pending" | "processing";
  wordpressPostId: string | null;
};

type MemoryStore = BlogEmailStore & {
  readPreview: () => MemoryPreview | null;
  requestPreview: () => void;
  setSettings: (settings: BlogEmailSettingsRecord) => void;
};

function createMemoryStore(initial?: {
  readonly deliveries?: readonly BlogDeliveryRecord[];
  readonly manual?: { readonly email: string; readonly wordpressPostId: string };
  readonly posts?: readonly BlogDispatchRecord[];
  readonly preview?: "pending";
  readonly seededAt?: Date | null;
  readonly settings?: Partial<BlogEmailSettingsRecord>;
  readonly suppressed?: readonly string[];
}): MemoryStore {
  let seededAt = initial?.seededAt ?? null;
  let settings: BlogEmailSettingsRecord = {
    audience: initial?.settings?.audience ?? "test",
    enabled: initial?.settings?.enabled ?? true,
    testRecipient:
      initial?.settings?.testRecipient === undefined
        ? TEST_RECIPIENT
        : initial.settings.testRecipient,
    updatedAt: initial?.settings?.updatedAt ?? new Date("2026-01-01T00:00:00.000Z"),
  };
  let preview: MemoryPreview | null = initial?.manual
    ? {
        completedAt: null,
        email: initial.manual.email,
        message: null,
        requestedAt: new Date("2026-11-16T11:00:00.000Z"),
        result: null,
        status: "pending",
        wordpressPostId: initial.manual.wordpressPostId,
      }
    : initial?.preview === "pending"
      ? {
          completedAt: null,
          email: null,
          message: null,
          requestedAt: new Date("2026-11-16T11:00:00.000Z"),
          result: null,
          status: "pending",
          wordpressPostId: null,
        }
      : null;
  const posts = new Map(initial?.posts?.map((post) => [post.wordpressPostId, { ...post }]) ?? []);
  const deliveries = new Map(
    initial?.deliveries?.map((delivery) => [
      deliveryKey(delivery.wordpressPostId, delivery.email),
      { ...delivery },
    ]) ?? []
  );
  const suppressed = Array.from(initial?.suppressed ?? []);

  const byAge = (left: BlogDispatchRecord, right: BlogDispatchRecord): number => {
    const published = left.publishedAt.getTime() - right.publishedAt.getTime();
    return published === 0 ? left.wordpressPostId.localeCompare(right.wordpressPostId) : published;
  };

  return {
    completePreviewRequest: async (completion) => {
      if (!preview || preview.requestedAt.getTime() !== completion.requestedAt.getTime()) {
        return;
      }
      preview = {
        ...preview,
        completedAt: completion.completedAt,
        message: completion.message,
        result: completion.result,
        status: "completed",
        wordpressPostId: completion.wordpressPostId,
      };
    },
    findNextLiveDispatch: async () => {
      return (
        Array.from(posts.values())
          .filter(
            (post) =>
              post.status === "queued" || post.status === "sending" || post.status === "failed"
          )
          .sort(byAge)[0] ?? null
      );
    },
    findNextTestDispatch: async (email) => {
      return (
        Array.from(posts.values())
          .filter((post) => post.status === "queued")
          .filter(
            (post) => deliveries.get(deliveryKey(post.wordpressPostId, email))?.status !== "sent"
          )
          .sort(byAge)[0] ?? null
      );
    },
    getDelivery: async (wordpressPostId, email) => {
      return deliveries.get(deliveryKey(wordpressPostId, email)) ?? null;
    },
    getDispatch: async (wordpressPostId) => posts.get(wordpressPostId) ?? null,
    getSeededAt: async () => seededAt,
    getSettings: async () => settings,
    listSuccessfulDeliveryEmails: async (wordpressPostId) => {
      return Array.from(deliveries.values())
        .filter(
          (delivery) => delivery.wordpressPostId === wordpressPostId && delivery.status === "sent"
        )
        .map((delivery) => delivery.email);
    },
    listSuppressedEmails: async () => suppressed,
    queueUnseenPosts: async (summaries) => {
      const inserted: string[] = [];
      for (const summary of summaries) {
        const existing = posts.get(summary.wordpressPostId);
        if (existing) {
          if (!existing.permalinkUrl && summary.permalinkUrl) {
            posts.set(summary.wordpressPostId, {
              ...existing,
              permalinkUrl: summary.permalinkUrl,
            });
          }
          continue;
        }
        posts.set(summary.wordpressPostId, {
          lastError: null,
          permalinkUrl: summary.permalinkUrl,
          publishedAt: summary.publishedAt,
          sentAt: null,
          status: "queued",
          title: summary.title,
          wordpressPostId: summary.wordpressPostId,
        });
        inserted.push(summary.wordpressPostId);
      }
      return inserted;
    },
    saveDeliveries: async (records) => {
      for (const record of records) {
        const key = deliveryKey(record.wordpressPostId, record.email);
        const existing = deliveries.get(key);
        if (existing?.status === "sent") {
          continue;
        }
        deliveries.set(
          key,
          existing ? { ...record, createdAt: existing.createdAt, id: existing.id } : { ...record }
        );
      }
    },
    readPreview: () => preview,
    requestPreview: () => {
      preview = {
        completedAt: null,
        email: null,
        message: null,
        requestedAt: new Date("2026-11-16T11:30:00.000Z"),
        result: null,
        status: "pending",
        wordpressPostId: null,
      };
    },
    catalogSkippedPosts: async (summaries, nextSeededAt) => {
      for (const summary of summaries) {
        const existing = posts.get(summary.wordpressPostId);
        if (existing) {
          posts.set(summary.wordpressPostId, {
            ...existing,
            permalinkUrl: summary.permalinkUrl || existing.permalinkUrl,
            publishedAt: summary.publishedAt,
            title: summary.title,
          });
          continue;
        }
        posts.set(summary.wordpressPostId, {
          lastError: null,
          permalinkUrl: summary.permalinkUrl,
          publishedAt: summary.publishedAt,
          sentAt: null,
          status: "skipped",
          title: summary.title,
          wordpressPostId: summary.wordpressPostId,
        });
      }
      if (!seededAt) {
        seededAt = nextSeededAt;
      }
    },
    seedSkippedPosts: async (summaries, nextSeededAt) => {
      if (seededAt) {
        return;
      }
      for (const summary of summaries) {
        if (posts.has(summary.wordpressPostId)) {
          continue;
        }
        posts.set(summary.wordpressPostId, {
          lastError: null,
          permalinkUrl: summary.permalinkUrl,
          publishedAt: summary.publishedAt,
          sentAt: null,
          status: "skipped",
          title: summary.title,
          wordpressPostId: summary.wordpressPostId,
        });
      }
      seededAt = nextSeededAt;
    },
    updateDispatch: async (wordpressPostId, patch) => {
      const current = posts.get(wordpressPostId);
      if (!current) {
        throw new Error(`Missing dispatch ${wordpressPostId}`);
      }
      posts.set(wordpressPostId, {
        ...current,
        lastError: patch.lastError === undefined ? current.lastError : patch.lastError,
        sentAt: patch.sentAt === undefined ? current.sentAt : patch.sentAt,
        status: patch.status,
      });
    },
    setSettings: (nextSettings) => {
      settings = nextSettings;
    },
    takePendingManualSend: async () => {
      if (!preview || preview.status !== "pending" || !preview.email || !preview.wordpressPostId) {
        return null;
      }
      const pending = {
        email: preview.email,
        requestedAt: preview.requestedAt,
        wordpressPostId: preview.wordpressPostId,
      };
      preview = {
        ...preview,
        completedAt: null,
        message: null,
        result: null,
        status: "processing",
      };
      return pending;
    },
    takePendingPreviewRequest: async () => {
      if (!preview || preview.status !== "pending" || preview.email) {
        return null;
      }
      const requestedAt = preview.requestedAt;
      preview = {
        ...preview,
        completedAt: null,
        message: null,
        result: null,
        status: "processing",
        wordpressPostId: null,
      };
      return { requestedAt };
    },
  };
}

function article(id: string, title: string, publishedAt: string): BlogEmailPost {
  return {
    contentHtml: `<p>${title}</p><img src="/images/${id}.png" alt="">`,
    coverAlt: title,
    coverUrl: `https://knowheretoai.wordpress.com/cover-${id}.png`,
    excerpt: `${title} excerpt`,
    permalinkUrl: `https://knowhereto.ai/blog/2024/01/02/${id}/`,
    publishedAt: new Date(publishedAt),
    title,
    wordpressPostId: id,
  };
}

type TestRuntime = BlogEmailRuntime & {
  sendBatch: Mock<BlogEmailRuntime["sendBatch"]>;
};

function createRuntime(
  store: BlogEmailStore,
  posts: readonly BlogEmailPost[],
  overrides: Partial<BlogEmailRuntime> = {}
): TestRuntime {
  const byId = new Map(posts.map((post) => [post.wordpressPostId, post]));
  const sendBatch = vi.fn<BlogEmailRuntime["sendBatch"]>(async (batch) => ({
    ids: batch.messages.map((_message, index) => `resend-${index}`),
    ok: true,
  }));
  const { sendBatch: sendOverride, ...rest } = overrides;

  return {
    appUrl: "https://knowhereto.ai",
    batchSize: BLOG_EMAIL_BATCH_SIZE,
    createDeliveryId: (() => {
      let nextId = 0;
      return () => `delivery-${nextId++}`;
    })(),
    getLatestPublishedPost: async () =>
      Array.from(posts).sort(
        (left, right) => right.publishedAt.getTime() - left.publishedAt.getTime()
      )[0] ?? null,
    getPublishedPost: async (wordpressPostId) => byId.get(wordpressPostId) ?? null,
    listPublishedPosts: async () => posts,
    loadSubscriptions: async () => [],
    loadUsers: async () => {
      throw new Error("Live audience should not be loaded");
    },
    now: () => new Date("2026-11-16T12:00:00.000Z"),
    sendBatch: (sendOverride as TestRuntime["sendBatch"] | undefined) ?? sendBatch,
    store,
    unsubscribeSecret: SECRET,
    wordpressOrigin: "https://knowheretoai.wordpress.com",
    ...rest,
  };
}

describe("blog email mode and cron auth", () => {
  it("treats only an exact live audience row as the live switch", () => {
    expect(
      readBlogEmailSettings({
        audience: "LIVE",
        enabled: true,
        testRecipient: " QA@Example.com ",
        updatedAt: null,
      })
    ).toEqual({
      audienceLive: false,
      enabled: true,
      testRecipient: "qa@example.com",
    });
    expect(
      readBlogEmailSettings({
        audience: "live",
        enabled: false,
        testRecipient: "",
        updatedAt: null,
      })
    ).toEqual({
      audienceLive: true,
      enabled: false,
      testRecipient: null,
    });
    expect(readBlogEmailSettings(null)).toEqual({
      audienceLive: false,
      enabled: false,
      testRecipient: null,
    });
    expect(BLOG_EMAIL_BATCH_SIZE).toBe(100);
  });

  it("rejects cron requests unless the bearer secret matches", () => {
    expect(isAuthorizedCronRequest("Bearer secret", undefined)).toBe(false);
    expect(isAuthorizedCronRequest("Bearer wrong", "secret")).toBe(false);
    expect(isAuthorizedCronRequest(null, "secret")).toBe(false);
    expect(isAuthorizedCronRequest("Bearer secret", "secret")).toBe(true);
  });
});

describe("blog email audience", () => {
  it("merges confirmed subscribers with verified users and drops duplicates, unverified, and suppressed mail", () => {
    expect(
      emailsForLiveAudience({
        alreadySentEmails: ["qa@example.com"],
        subscriptions: [
          { email: "A@Example.com", status: "confirmed" },
          { email: "pending@example.com", status: "pending" },
        ],
        suppressedEmails: ["New@Example.com"],
        users: [
          { email: "a@example.com", emailVerified: true },
          { email: "new@example.com", emailVerified: true },
          { email: "qa@example.com", emailVerified: true },
          { email: "unverified@example.com", emailVerified: false },
        ],
      })
    ).toEqual(["a@example.com"]);
  });
});

describe("blog email template and unsubscribe token", () => {
  it("rewrites relative images, keeps a text alternative, and shortens oversized bodies", () => {
    const post = article("1", "Hello <script>", "2024-01-02T00:00:00.000Z");
    const rendered = renderBlogEmail({
      post: {
        ...post,
        contentHtml: `<p>Body</p><img src="/images/a.png"><a href="javascript:alert(1)">x</a>`,
      },
      unsubscribeUrl: "https://knowhereto.ai/blog-email/unsubscribe?token=abc",
      wordpressOrigin: "https://knowheretoai.wordpress.com",
    });

    expect(rendered.subject).toBe("Hello <script>");
    expect(rendered.html).toContain("https://knowheretoai.wordpress.com/images/a.png");
    expect(rendered.html).toContain("Hello &lt;script&gt;");
    expect(rendered.html).not.toContain("javascript:");
    expect(rendered.html).toContain("max-width:600px");
    expect(rendered.html).toContain(post.permalinkUrl);
    expect(rendered.text).toContain(post.permalinkUrl);
    expect(rendered.text).toContain("https://knowhereto.ai/blog-email/unsubscribe?token=abc");
    expect(rendered.truncated).toBe(false);

    const huge = renderBlogEmail({
      post: { ...post, contentHtml: "a".repeat(BLOG_EMAIL_BODY_BYTE_LIMIT + 1) },
      unsubscribeUrl: "https://knowhereto.ai/blog-email/unsubscribe?token=abc",
      wordpressOrigin: "https://knowheretoai.wordpress.com",
    });
    expect(huge.truncated).toBe(true);
    expect(huge.html).toContain("Continue reading on Knowhere");
    expect(huge.html).not.toContain("a".repeat(200));
  });

  it("signs an unsubscribe token that does not require a session", async () => {
    const token = signBlogUnsubscribeToken(" User@Example.com ", SECRET);
    expect(readBlogUnsubscribeToken(token, SECRET)).toBe("user@example.com");
    expect(readBlogUnsubscribeToken(`${token}x`, SECRET)).toBeNull();
    const seen: string[] = [];
    await expect(
      unsubscribeWithSignedToken(token, SECRET, async (email) => {
        seen.push(email);
      })
    ).resolves.toBe("unsubscribed");
    await expect(
      unsubscribeWithSignedToken("not-a-token", SECRET, async () => {
        throw new Error("should not unsubscribe");
      })
    ).resolves.toBe("invalid");
    expect(seen).toEqual(["user@example.com"]);
    expect(createBlogUnsubscribeUrl("https://knowhereto.ai", token)).toContain(token);
  });
});

describe("blog email dispatch", () => {
  it("seeds published posts without sending on the first run", async () => {
    const store = createMemoryStore();
    const oldPost = article("old", "Original", "2019-01-01T00:00:00.000Z");
    const runtime = createRuntime(store, [oldPost]);

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({ postCount: 1, status: "seeded" });

    expect(runtime.sendBatch).not.toHaveBeenCalled();
    expect(await store.getSeededAt()).toEqual(new Date("2026-11-16T12:00:00.000Z"));
    expect(await store.getDispatch("old")).toMatchObject({
      permalinkUrl: oldPost.permalinkUrl,
      status: "skipped",
      title: "Original",
    });
  });

  it("does not seed or send when a page of the first poll fails", async () => {
    const store = createMemoryStore();
    const runtime = createRuntime(store, [], {
      listPublishedPosts: async () => {
        throw new Error("page failed");
      },
    });

    await expect(runBlogEmailCron(runtime)).resolves.toMatchObject({ status: "seed_failed" });
    expect(await store.getSeededAt()).toBeNull();
    expect(runtime.sendBatch).not.toHaveBeenCalled();
  });

  it("queues only new ids and sends the test inbox without marking the post sent", async () => {
    const store = createMemoryStore();
    const oldPost = article("old", "Original", "2019-01-01T00:00:00.000Z");
    const olderNew = article("older-new", "Older new", "2021-01-01T00:00:00.000Z");
    const newerNew = article("newer-new", "Newer new", "2024-01-01T00:00:00.000Z");
    let visible = [oldPost];
    const runtime = createRuntime(store, [oldPost, olderNew, newerNew], {
      listPublishedPosts: async () => visible,
    });
    await runBlogEmailCron(runtime);

    visible = [{ ...oldPost, title: "Original edited" }, olderNew, newerNew];

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      status: "test_sent",
      wordpressPostId: "older-new",
    });

    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped", title: "Original" });
    expect(await store.getDispatch("older-new")).toMatchObject({ status: "queued" });
    expect(await store.getDispatch("newer-new")).toMatchObject({ status: "queued" });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    const batch = runtime.sendBatch.mock.calls[0]?.[0];
    expect(batch?.idempotencyKey).toBe("older-new:test:0");
    expect(batch?.messages.map((message) => message.to)).toEqual([TEST_RECIPIENT]);
    expect(batch?.messages[0]?.headers["List-Unsubscribe-Post"]).toBe("List-Unsubscribe=One-Click");
    expect(batch?.messages[0]?.text).toContain(olderNew.permalinkUrl);
    expect(await store.getDelivery("older-new", TEST_RECIPIENT)).toMatchObject({
      source: "test",
      status: "sent",
    });
    expect(await store.getDelivery("newer-new", TEST_RECIPIENT)).toBeNull();

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      status: "test_sent",
      wordpressPostId: "newer-new",
    });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(2);
    expect(runtime.sendBatch.mock.calls[1]?.[0].messages.map((message) => message.to)).toEqual([
      TEST_RECIPIENT,
    ]);
    expect(await store.getDispatch("older-new")).toMatchObject({ status: "queued" });
  });

  it("skips an unpublished queued post and sends the next one", async () => {
    const kept = article("kept", "Kept", "2024-01-01T00:00:00.000Z");
    const store = createMemoryStore({
      posts: [
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: new Date("2020-01-01T00:00:00.000Z"),
          sentAt: null,
          status: "queued",
          title: "Gone",
          wordpressPostId: "gone",
        },
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: kept.publishedAt,
          sentAt: null,
          status: "queued",
          title: kept.title,
          wordpressPostId: kept.wordpressPostId,
        },
      ],
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
    });
    const runtime = createRuntime(store, [kept], {
      getPublishedPost: async (wordpressPostId) =>
        wordpressPostId === kept.wordpressPostId ? kept : null,
      listPublishedPosts: async () => [kept],
    });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      status: "test_sent",
      wordpressPostId: "kept",
    });
    expect(await store.getDispatch("gone")).toMatchObject({
      lastError: "WordPress post is no longer published",
      status: "skipped",
    });
    expect(await store.getDispatch("kept")).toMatchObject({ status: "queued" });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    expect(await store.getDelivery("gone", TEST_RECIPIENT)).toBeNull();
  });

  it("holds queued posts when no test recipient is configured", async () => {
    const store = createMemoryStore({
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "test", enabled: true, testRecipient: null, updatedAt: null },
    });
    const post = article("new", "New", "2024-05-01T00:00:00.000Z");
    const runtime = createRuntime(store, [post]);

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      reason: "missing_test_recipient",
      status: "held",
    });
    expect(await store.getDispatch("new")).toMatchObject({ status: "queued" });
    expect(runtime.sendBatch).not.toHaveBeenCalled();
  });

  it("does nothing when the database sending switch is off", async () => {
    const store = createMemoryStore({
      preview: "pending",
      settings: {
        audience: "live",
        enabled: false,
        testRecipient: TEST_RECIPIENT,
        updatedAt: null,
      },
    });
    const listPublishedPosts = vi.fn(async () => [
      article("old", "Original", "2019-01-01T00:00:00.000Z"),
    ]);
    const runtime = createRuntime(store, [], { listPublishedPosts });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({ status: "disabled" });
    expect(listPublishedPosts).toHaveBeenCalledTimes(1);
    expect(runtime.sendBatch).not.toHaveBeenCalled();
    expect(store.readPreview()?.status).toBe("pending");
    expect(await store.getSeededAt()).toEqual(new Date("2026-11-16T12:00:00.000Z"));
    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped", title: "Original" });
  });

  it("reads test versus live audience from the settings row", async () => {
    const post = article("42", "Audience", "2024-06-01T00:00:00.000Z");
    const store = createMemoryStore({
      posts: [
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: post.publishedAt,
          sentAt: null,
          status: "queued",
          title: post.title,
          wordpressPostId: post.wordpressPostId,
        },
      ],
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "test", enabled: true, testRecipient: TEST_RECIPIENT, updatedAt: null },
    });
    const loadUsers = vi.fn(async () => [{ email: "reader@example.com", emailVerified: true }]);
    const runtime = createRuntime(store, [post], {
      loadSubscriptions: async () => [{ email: "reader@example.com", status: "confirmed" }],
      loadUsers,
    });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      status: "test_sent",
      wordpressPostId: "42",
    });
    expect(loadUsers).not.toHaveBeenCalled();
    expect(runtime.sendBatch.mock.calls[0]?.[0].messages.map((message) => message.to)).toEqual([
      TEST_RECIPIENT,
    ]);
    expect(await store.getDispatch("42")).toMatchObject({ status: "queued" });

    store.setSettings({
      audience: "live",
      enabled: true,
      testRecipient: TEST_RECIPIENT,
      updatedAt: new Date("2026-11-16T12:00:00.000Z"),
    });
    await expect(runBlogEmailCron(runtime)).resolves.toMatchObject({
      status: "live_sent",
      wordpressPostId: "42",
    });
    expect(loadUsers).toHaveBeenCalledTimes(1);
    expect(runtime.sendBatch.mock.calls[1]?.[0].messages.map((message) => message.to)).toEqual([
      "reader@example.com",
    ]);
  });

  it("previews a skipped post without changing its status or backfilling it later", async () => {
    const store = createMemoryStore();
    const updateDispatch = vi.spyOn(store, "updateDispatch");
    const oldPost = article("old", "Original", "2019-01-01T00:00:00.000Z");
    const runtime = createRuntime(store, [oldPost]);
    await runBlogEmailCron(runtime);

    store.requestPreview();
    await expect(runBlogEmailCron(runtime)).resolves.toEqual({ status: "idle" });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    expect(runtime.sendBatch.mock.calls[0]?.[0].idempotencyKey).toBe("old:preview:0");
    expect(await store.getDelivery("old", TEST_RECIPIENT)).toMatchObject({
      source: "preview",
      status: "sent",
    });
    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped" });
    expect(store.readPreview()).toMatchObject({ result: "sent", status: "completed" });

    store.requestPreview();
    await expect(runBlogEmailCron(runtime)).resolves.toEqual({ status: "idle" });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    expect(store.readPreview()).toMatchObject({
      result: "already_sent",
      wordpressPostId: "old",
    });

    store.setSettings({
      audience: "live",
      enabled: true,
      testRecipient: TEST_RECIPIENT,
      updatedAt: null,
    });
    await expect(runBlogEmailCron(runtime)).resolves.toEqual({ status: "idle" });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped" });
    expect(updateDispatch).not.toHaveBeenCalled();
  });

  it("holds a preview request when the test recipient is empty", async () => {
    const store = createMemoryStore({
      preview: "pending",
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "test", enabled: true, testRecipient: null, updatedAt: null },
    });
    const getLatestPublishedPost = vi.fn(async () =>
      article("old", "Original", "2019-01-01T00:00:00.000Z")
    );
    const runtime = createRuntime(store, [], { getLatestPublishedPost });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      reason: "missing_test_recipient",
      status: "held",
    });
    expect(getLatestPublishedPost).not.toHaveBeenCalled();
    expect(store.readPreview()).toMatchObject({ result: "missing_test_recipient" });
    expect(runtime.sendBatch).not.toHaveBeenCalled();
  });

  it("sends the live audience once, skipping an address that already received the post", async () => {
    const post = article("42", "Live post", "2024-06-01T00:00:00.000Z");
    const sentAt = new Date("2026-11-01T00:00:00.000Z");
    const store = createMemoryStore({
      deliveries: [
        {
          createdAt: sentAt,
          email: TEST_RECIPIENT,
          error: null,
          id: "existing-test",
          postTitle: post.title,
          resendId: "already",
          sentAt,
          source: "test",
          status: "sent",
          updatedAt: sentAt,
          wordpressPostId: post.wordpressPostId,
        },
      ],
      posts: [
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: post.publishedAt,
          sentAt: null,
          status: "queued",
          title: post.title,
          wordpressPostId: post.wordpressPostId,
        },
      ],
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "live", enabled: true, testRecipient: TEST_RECIPIENT, updatedAt: null },
    });
    const runtime = createRuntime(store, [post], {
      loadSubscriptions: async () => [{ email: "reader@example.com", status: "confirmed" }],
      loadUsers: async () => [
        { email: TEST_RECIPIENT, emailVerified: true },
        { email: "reader@example.com", emailVerified: true },
        { email: "pending-user@example.com", emailVerified: false },
      ],
    });

    await expect(runBlogEmailCron(runtime)).resolves.toMatchObject({
      status: "live_sent",
      wordpressPostId: "42",
    });

    const batch = runtime.sendBatch.mock.calls[0]?.[0];
    expect(batch?.idempotencyKey).toBe("42:live:0");
    expect(batch?.messages.map((message) => message.to)).toEqual(["reader@example.com"]);
    expect(await store.getDelivery("42", TEST_RECIPIENT)).toMatchObject({
      source: "test",
      status: "sent",
    });
    expect(await store.getDelivery("42", "reader@example.com")).toMatchObject({
      source: "live",
      status: "sent",
    });
    expect(await store.getDispatch("42")).toMatchObject({ status: "sent" });
    const token = new URL(
      batch?.messages[0]?.headers["List-Unsubscribe"].slice(1, -1) ?? "https://knowhereto.ai"
    ).searchParams.get("token");
    expect(readBlogUnsubscribeToken(token ?? "", SECRET)).toBe("reader@example.com");
  });

  it("retries a failed batch without emailing recipients Resend already accepted", async () => {
    const post = article("42", "Retry", "2024-06-01T00:00:00.000Z");
    const store = createMemoryStore({
      posts: [
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: post.publishedAt,
          sentAt: null,
          status: "queued",
          title: post.title,
          wordpressPostId: post.wordpressPostId,
        },
      ],
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "live", enabled: true, testRecipient: TEST_RECIPIENT, updatedAt: null },
    });
    let failedOnce = false;
    const sendBatch = vi.fn(async (batch: BlogEmailSendBatch) => {
      if (batch.idempotencyKey.endsWith(":1") && !failedOnce) {
        failedOnce = true;
        return { error: "timeout", ok: false as const };
      }
      return {
        ids: batch.messages.map((_message, index) => `id-${batch.idempotencyKey}-${index}`),
        ok: true as const,
      };
    });
    const runtime = createRuntime(store, [post], {
      batchSize: 2,
      loadUsers: async () => [
        { email: "a@example.com", emailVerified: true },
        { email: "b@example.com", emailVerified: true },
        { email: "c@example.com", emailVerified: true },
      ],
      sendBatch,
    });

    await expect(runBlogEmailCron(runtime)).resolves.toMatchObject({ status: "live_incomplete" });
    expect(await store.getDispatch("42")).toMatchObject({ status: "failed" });
    expect(sendBatch.mock.calls.map((call) => call[0].idempotencyKey)).toEqual([
      "42:live:0",
      "42:live:1",
    ]);
    expect(sendBatch.mock.calls[0]?.[0].messages.map((message) => message.to)).toEqual([
      "a@example.com",
      "b@example.com",
    ]);

    await expect(runBlogEmailCron(runtime)).resolves.toMatchObject({ status: "live_sent" });
    expect(sendBatch).toHaveBeenCalledTimes(3);
    expect(sendBatch.mock.calls[2]?.[0].idempotencyKey).toBe("42:live:1");
    expect(sendBatch.mock.calls[2]?.[0].messages.map((message) => message.to)).toEqual([
      "c@example.com",
    ]);
    expect(await store.getDispatch("42")).toMatchObject({ status: "sent" });
    expect((await store.listSuccessfulDeliveryEmails("42")).slice().sort()).toEqual([
      "a@example.com",
      "b@example.com",
      "c@example.com",
    ]);
  });

  it("sends one selected article when automatic sending is off", async () => {
    const post = article("old", "Original", "2019-01-01T00:00:00.000Z");
    const store = createMemoryStore({
      manual: { email: " Ops@Example.com ", wordpressPostId: "old" },
      posts: [
        {
          lastError: null,
          permalinkUrl: post.permalinkUrl,
          publishedAt: post.publishedAt,
          sentAt: null,
          status: "skipped",
          title: post.title,
          wordpressPostId: "old",
        },
      ],
      settings: {
        audience: "live",
        enabled: false,
        testRecipient: TEST_RECIPIENT,
        updatedAt: null,
      },
    });
    const listPublishedPosts = vi.fn(async () => [post]);
    const loadUsers = vi.fn(async () => [{ email: "reader@example.com", emailVerified: true }]);
    const runtime = createRuntime(store, [post], { listPublishedPosts, loadUsers });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      status: "manual_sent",
      wordpressPostId: "old",
    });
    expect(listPublishedPosts).not.toHaveBeenCalled();
    expect(loadUsers).not.toHaveBeenCalled();
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    expect(runtime.sendBatch.mock.calls[0]?.[0].idempotencyKey).toBe("old:preview:ops@example.com");
    expect(runtime.sendBatch.mock.calls[0]?.[0].messages.map((message) => message.to)).toEqual([
      "ops@example.com",
    ]);
    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped" });
    expect(await store.getDelivery("old", "ops@example.com")).toMatchObject({
      source: "preview",
      status: "sent",
    });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({ status: "disabled" });
    expect(runtime.sendBatch).toHaveBeenCalledTimes(1);
    expect(listPublishedPosts).toHaveBeenCalledTimes(1);
    expect(await store.getSeededAt()).toEqual(new Date("2026-11-16T12:00:00.000Z"));
    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped" });
  });

  it("does not queue a skipped article or mail the live audience for a manual send", async () => {
    const oldPost = article("old", "Original", "2019-01-01T00:00:00.000Z");
    const queued = article("new", "New", "2024-05-01T00:00:00.000Z");
    const store = createMemoryStore({
      manual: { email: "ops@example.com", wordpressPostId: "old" },
      posts: [
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: oldPost.publishedAt,
          sentAt: null,
          status: "skipped",
          title: oldPost.title,
          wordpressPostId: "old",
        },
        {
          lastError: null,
          permalinkUrl: queued.permalinkUrl,
          publishedAt: queued.publishedAt,
          sentAt: null,
          status: "queued",
          title: queued.title,
          wordpressPostId: "new",
        },
      ],
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "live", enabled: true, testRecipient: TEST_RECIPIENT, updatedAt: null },
    });
    const loadUsers = vi.fn(async () => [{ email: "reader@example.com", emailVerified: true }]);
    const runtime = createRuntime(store, [oldPost, queued], {
      loadSubscriptions: async () => [{ email: "reader@example.com", status: "confirmed" }],
      loadUsers,
    });

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      status: "manual_sent",
      wordpressPostId: "old",
    });
    expect(loadUsers).not.toHaveBeenCalled();
    expect(runtime.sendBatch.mock.calls[0]?.[0].messages.map((message) => message.to)).toEqual([
      "ops@example.com",
    ]);
    expect(await store.getDispatch("old")).toMatchObject({ status: "skipped" });
    expect(await store.getDispatch("new")).toMatchObject({ status: "queued" });
    expect(await store.getDelivery("new", "reader@example.com")).toBeNull();
  });

  it("stores a permalink on posts the poll already skipped", async () => {
    const oldPost = article("old", "Original", "2019-01-01T00:00:00.000Z");
    const store = createMemoryStore({
      posts: [
        {
          lastError: null,
          permalinkUrl: null,
          publishedAt: oldPost.publishedAt,
          sentAt: null,
          status: "skipped",
          title: "Original",
          wordpressPostId: "old",
        },
      ],
      seededAt: new Date("2026-01-01T00:00:00.000Z"),
      settings: { audience: "test", enabled: true, testRecipient: null, updatedAt: null },
    });
    const runtime = createRuntime(store, [oldPost]);

    await expect(runBlogEmailCron(runtime)).resolves.toEqual({
      reason: "missing_test_recipient",
      status: "held",
    });
    expect(await store.getDispatch("old")).toMatchObject({
      permalinkUrl: oldPost.permalinkUrl,
      status: "skipped",
      title: "Original",
    });
    expect(runtime.sendBatch).not.toHaveBeenCalled();
  });
});
