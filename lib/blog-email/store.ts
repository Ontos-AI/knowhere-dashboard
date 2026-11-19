import type {
  BlogDeliveryRecord,
  BlogDeliverySource,
  BlogDeliveryStatus,
  BlogDispatchPatch,
  BlogDispatchRecord,
  BlogDispatchStatus,
  BlogEmailPostSummary,
  BlogEmailPreviewCompletion,
  BlogEmailSettingsRecord,
  BlogEmailStore,
} from "@lib/blog-email/types";
import {
  BLOG_EMAIL_CURSOR_ID,
  BLOG_EMAIL_PREVIEW_REQUEST_ID,
  BLOG_EMAIL_SETTINGS_ID,
} from "@lib/blog-email/types";
import { newsletterDb } from "@lib/db/newsletter";
import {
  blogDelivery,
  blogEmailCursor,
  blogEmailPreviewRequest,
  blogEmailSettings,
  blogEmailSuppression,
  blogPostDispatch,
} from "@lib/db/newsletter-schema";
import { and, asc, eq, inArray, notExists, sql } from "drizzle-orm";

function getNewsletterDb() {
  return newsletterDb;
}

const INSERT_CHUNK = 500;
const LIVE_DISPATCH_STATUSES = ["queued", "sending", "failed"] as const;
const DISABLED_SETTINGS: BlogEmailSettingsRecord = {
  audience: "test",
  enabled: false,
  testRecipient: null,
  updatedAt: null,
};

function isDispatchStatus(value: string): value is BlogDispatchStatus {
  return (
    value === "skipped" ||
    value === "queued" ||
    value === "sending" ||
    value === "sent" ||
    value === "failed"
  );
}

function isDeliverySource(value: string): value is BlogDeliverySource {
  return value === "preview" || value === "test" || value === "live";
}

function isDeliveryStatus(value: string): value is BlogDeliveryStatus {
  return value === "sent" || value === "failed";
}

function mapDispatch(row: {
  lastError: string | null;
  permalink: string | null;
  publishedAt: Date;
  sentAt: Date | null;
  status: string;
  title: string;
  wordpressPostId: string;
}): BlogDispatchRecord {
  if (!isDispatchStatus(row.status)) {
    throw new Error(`Unexpected blog dispatch status: ${row.status}`);
  }

  return {
    lastError: row.lastError,
    permalinkUrl: row.permalink,
    publishedAt: row.publishedAt,
    sentAt: row.sentAt,
    status: row.status,
    title: row.title,
    wordpressPostId: row.wordpressPostId,
  };
}

function mapDelivery(row: {
  createdAt: Date;
  email: string;
  error: string | null;
  id: string;
  postTitle: string;
  resendId: string | null;
  sentAt: Date | null;
  source: string;
  status: string;
  updatedAt: Date;
  wordpressPostId: string;
}): BlogDeliveryRecord {
  if (!isDeliverySource(row.source) || !isDeliveryStatus(row.status)) {
    throw new Error(`Unexpected blog delivery row: ${row.id}`);
  }

  return {
    createdAt: row.createdAt,
    email: row.email,
    error: row.error,
    id: row.id,
    postTitle: row.postTitle,
    resendId: row.resendId,
    sentAt: row.sentAt,
    source: row.source,
    status: row.status,
    updatedAt: row.updatedAt,
    wordpressPostId: row.wordpressPostId,
  };
}

function chunks<T>(rows: readonly T[]): T[][] {
  const groups: T[][] = [];
  for (let index = 0; index < rows.length; index += INSERT_CHUNK) {
    groups.push(rows.slice(index, index + INSERT_CHUNK));
  }
  return groups;
}

async function upsertDelivery(
  executor: Pick<ReturnType<typeof getNewsletterDb>, "insert">,
  record: BlogDeliveryRecord
): Promise<void> {
  await executor
    .insert(blogDelivery)
    .values(record)
    .onConflictDoUpdate({
      set: {
        error: record.error,
        postTitle: record.postTitle,
        resendId: record.resendId,
        sentAt: record.sentAt,
        source: record.source,
        status: record.status,
        updatedAt: record.updatedAt,
      },
      setWhere: sql`${blogDelivery.status} != 'sent'`,
      target: [blogDelivery.wordpressPostId, blogDelivery.email],
    });
}

export const blogEmailStore: BlogEmailStore = {
  completePreviewRequest: async (completion: BlogEmailPreviewCompletion) => {
    await getNewsletterDb()
      .update(blogEmailPreviewRequest)
      .set({
        completedAt: completion.completedAt,
        message: completion.message,
        result: completion.result,
        status: "completed",
        wordpressPostId: completion.wordpressPostId,
      })
      .where(
        and(
          eq(blogEmailPreviewRequest.id, BLOG_EMAIL_PREVIEW_REQUEST_ID),
          eq(blogEmailPreviewRequest.status, "processing")
        )
      );
  },
  findNextLiveDispatch: async () => {
    const [row] = await getNewsletterDb()
      .select()
      .from(blogPostDispatch)
      .where(inArray(blogPostDispatch.status, [...LIVE_DISPATCH_STATUSES]))
      .orderBy(asc(blogPostDispatch.publishedAt), asc(blogPostDispatch.wordpressPostId))
      .limit(1);

    return row ? mapDispatch(row) : null;
  },
  findNextTestDispatch: async (email) => {
    const database = getNewsletterDb();
    const alreadySent = database
      .select({ wordpressPostId: blogDelivery.wordpressPostId })
      .from(blogDelivery)
      .where(
        and(
          eq(blogDelivery.wordpressPostId, blogPostDispatch.wordpressPostId),
          eq(blogDelivery.email, email),
          eq(blogDelivery.status, "sent")
        )
      );
    const [row] = await database
      .select()
      .from(blogPostDispatch)
      .where(and(eq(blogPostDispatch.status, "queued"), notExists(alreadySent)))
      .orderBy(asc(blogPostDispatch.publishedAt), asc(blogPostDispatch.wordpressPostId))
      .limit(1);

    return row ? mapDispatch(row) : null;
  },
  getDelivery: async (wordpressPostId, email) => {
    const [row] = await getNewsletterDb()
      .select()
      .from(blogDelivery)
      .where(and(eq(blogDelivery.wordpressPostId, wordpressPostId), eq(blogDelivery.email, email)))
      .limit(1);

    return row ? mapDelivery(row) : null;
  },
  getDispatch: async (wordpressPostId) => {
    const [row] = await getNewsletterDb()
      .select()
      .from(blogPostDispatch)
      .where(eq(blogPostDispatch.wordpressPostId, wordpressPostId))
      .limit(1);

    return row ? mapDispatch(row) : null;
  },
  getSeededAt: async () => {
    const [row] = await getNewsletterDb()
      .select({ seededAt: blogEmailCursor.seededAt })
      .from(blogEmailCursor)
      .where(eq(blogEmailCursor.id, BLOG_EMAIL_CURSOR_ID))
      .limit(1);

    return row?.seededAt ?? null;
  },
  getSettings: async () => {
    const [row] = await getNewsletterDb()
      .select({
        audience: blogEmailSettings.audience,
        enabled: blogEmailSettings.enabled,
        testRecipient: blogEmailSettings.testRecipient,
        updatedAt: blogEmailSettings.updatedAt,
      })
      .from(blogEmailSettings)
      .where(eq(blogEmailSettings.id, BLOG_EMAIL_SETTINGS_ID))
      .limit(1);

    return row ?? DISABLED_SETTINGS;
  },
  listSuccessfulDeliveryEmails: async (wordpressPostId) => {
    const rows = await getNewsletterDb()
      .select({ email: blogDelivery.email })
      .from(blogDelivery)
      .where(
        and(eq(blogDelivery.wordpressPostId, wordpressPostId), eq(blogDelivery.status, "sent"))
      );

    return rows.map((row) => row.email);
  },
  listSuppressedEmails: async () => {
    const rows = await getNewsletterDb()
      .select({ email: blogEmailSuppression.email })
      .from(blogEmailSuppression);
    return rows.map((row) => row.email);
  },
  queueUnseenPosts: async (posts) => {
    const inserted: string[] = [];
    const now = new Date();
    for (const group of chunks(posts)) {
      const rows = await getNewsletterDb()
        .insert(blogPostDispatch)
        .values(
          group.map((post) => ({
            createdAt: now,
            lastError: null,
            permalink: post.permalinkUrl,
            publishedAt: post.publishedAt,
            sentAt: null,
            status: "queued",
            title: post.title,
            updatedAt: now,
            wordpressPostId: post.wordpressPostId,
          }))
        )
        .onConflictDoUpdate({
          set: {
            permalink: sql.raw('excluded."permalink"'),
          },
          setWhere: sql`${blogPostDispatch.permalink} is null`,
          target: blogPostDispatch.wordpressPostId,
        })
        .returning({
          createdAt: blogPostDispatch.createdAt,
          wordpressPostId: blogPostDispatch.wordpressPostId,
        });
      inserted.push(
        ...rows
          .filter((row) => row.createdAt.getTime() === now.getTime())
          .map((row) => row.wordpressPostId)
      );
    }

    return inserted;
  },
  saveDeliveries: async (records) => {
    if (records.length === 0) {
      return;
    }

    await getNewsletterDb().transaction(async (tx) => {
      for (const record of records) {
        await upsertDelivery(tx, record);
      }
    });
  },
  catalogSkippedPosts: async (posts, seededAt) => {
    await getNewsletterDb().transaction(async (tx) => {
      await tx
        .insert(blogEmailCursor)
        .values({
          id: BLOG_EMAIL_CURSOR_ID,
          seededAt: null,
          updatedAt: seededAt,
        })
        .onConflictDoNothing();

      const [cursor] = await tx
        .select()
        .from(blogEmailCursor)
        .where(eq(blogEmailCursor.id, BLOG_EMAIL_CURSOR_ID))
        .for("update");

      if (!cursor) {
        throw new Error("Blog email cursor was not created");
      }

      for (const group of chunks(posts)) {
        await tx
          .insert(blogPostDispatch)
          .values(
            group.map((post) => ({
              createdAt: seededAt,
              lastError: null,
              permalink: post.permalinkUrl,
              publishedAt: post.publishedAt,
              sentAt: null,
              status: "skipped",
              title: post.title,
              updatedAt: seededAt,
              wordpressPostId: post.wordpressPostId,
            }))
          )
          .onConflictDoUpdate({
            set: {
              permalink: sql.raw('excluded."permalink"'),
              publishedAt: sql.raw('excluded."publishedAt"'),
              title: sql.raw('excluded."title"'),
              updatedAt: seededAt,
            },
            target: blogPostDispatch.wordpressPostId,
          });
      }

      if (!cursor.seededAt) {
        await tx
          .update(blogEmailCursor)
          .set({ seededAt, updatedAt: seededAt })
          .where(eq(blogEmailCursor.id, BLOG_EMAIL_CURSOR_ID));
      }
    });
  },
  seedSkippedPosts: async (posts: readonly BlogEmailPostSummary[], seededAt: Date) => {
    await getNewsletterDb().transaction(async (tx) => {
      await tx
        .insert(blogEmailCursor)
        .values({
          id: BLOG_EMAIL_CURSOR_ID,
          seededAt: null,
          updatedAt: seededAt,
        })
        .onConflictDoNothing();

      const [cursor] = await tx
        .select()
        .from(blogEmailCursor)
        .where(eq(blogEmailCursor.id, BLOG_EMAIL_CURSOR_ID))
        .for("update");

      if (!cursor) {
        throw new Error("Blog email cursor was not created");
      }
      if (cursor.seededAt) {
        return;
      }

      for (const group of chunks(posts)) {
        await tx
          .insert(blogPostDispatch)
          .values(
            group.map((post) => ({
              createdAt: seededAt,
              lastError: null,
              permalink: post.permalinkUrl,
              publishedAt: post.publishedAt,
              sentAt: null,
              status: "skipped",
              title: post.title,
              updatedAt: seededAt,
              wordpressPostId: post.wordpressPostId,
            }))
          )
          .onConflictDoNothing();
      }

      await tx
        .update(blogEmailCursor)
        .set({ seededAt, updatedAt: seededAt })
        .where(eq(blogEmailCursor.id, BLOG_EMAIL_CURSOR_ID));
    });
  },
  takePendingManualSend: async () => {
    const [row] = await getNewsletterDb()
      .update(blogEmailPreviewRequest)
      .set({
        completedAt: null,
        message: null,
        result: null,
        status: "processing",
      })
      .where(
        and(
          eq(blogEmailPreviewRequest.id, BLOG_EMAIL_PREVIEW_REQUEST_ID),
          eq(blogEmailPreviewRequest.status, "pending"),
          sql`${blogEmailPreviewRequest.email} is not null`,
          sql`${blogEmailPreviewRequest.wordpressPostId} is not null`
        )
      )
      .returning({
        email: blogEmailPreviewRequest.email,
        requestedAt: blogEmailPreviewRequest.requestedAt,
        wordpressPostId: blogEmailPreviewRequest.wordpressPostId,
      });

    if (!row?.email || !row.wordpressPostId) {
      return null;
    }

    return {
      email: row.email,
      requestedAt: row.requestedAt,
      wordpressPostId: row.wordpressPostId,
    };
  },
  takePendingPreviewRequest: async () => {
    const [row] = await getNewsletterDb()
      .update(blogEmailPreviewRequest)
      .set({
        completedAt: null,
        message: null,
        result: null,
        status: "processing",
        wordpressPostId: null,
      })
      .where(
        and(
          eq(blogEmailPreviewRequest.id, BLOG_EMAIL_PREVIEW_REQUEST_ID),
          eq(blogEmailPreviewRequest.status, "pending"),
          sql`${blogEmailPreviewRequest.email} is null`
        )
      )
      .returning({ requestedAt: blogEmailPreviewRequest.requestedAt });

    return row ?? null;
  },
  updateDispatch: async (wordpressPostId: string, patch: BlogDispatchPatch) => {
    await getNewsletterDb()
      .update(blogPostDispatch)
      .set({
        status: patch.status,
        updatedAt: patch.updatedAt,
        ...(patch.lastError !== undefined ? { lastError: patch.lastError } : {}),
        ...(patch.sentAt !== undefined ? { sentAt: patch.sentAt } : {}),
      })
      .where(eq(blogPostDispatch.wordpressPostId, wordpressPostId));
  },
};
