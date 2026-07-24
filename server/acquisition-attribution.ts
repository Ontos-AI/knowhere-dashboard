import { db } from "@lib/db";
import { marketingAttributionSession, marketingPageView } from "@lib/db/schema";
import { createId } from "@paralleldrive/cuid2";
import { and, eq, isNull } from "drizzle-orm";
import {
  type AcquisitionAttributionRepository,
  type AcquisitionAttributionSessionInsert,
  type AcquisitionAttributionStoredSession,
  type AcquisitionBindInput,
  type AcquisitionBindResult,
  type AcquisitionCaptureInput,
  type AcquisitionCaptureResult,
  createAcquisitionAttributionService,
  type MarketingPageViewCaptureInput,
  type MarketingPageViewCaptureResult,
  type MarketingPageViewInsert,
} from "@/lib/acquisition-attribution/core";

const repository: AcquisitionAttributionRepository = {
  bindSessionToUser: async ({ boundAt, sessionId, userId }): Promise<boolean> => {
    const [boundSession] = await db
      .update(marketingAttributionSession)
      .set({
        boundAt,
        boundUserId: userId,
      })
      .where(
        and(
          eq(marketingAttributionSession.sessionId, sessionId),
          isNull(marketingAttributionSession.boundUserId)
        )
      )
      .returning({
        sessionId: marketingAttributionSession.sessionId,
      });

    return Boolean(boundSession);
  },
  findSessionById: async (
    sessionId: string
  ): Promise<AcquisitionAttributionStoredSession | null> => {
    const session = await db.query.marketingAttributionSession.findFirst({
      columns: {
        boundUserId: true,
        capturedAt: true,
        sessionId: true,
      },
      where: eq(marketingAttributionSession.sessionId, sessionId),
    });

    return session ?? null;
  },
  insertPageView: async (pageView: MarketingPageViewInsert): Promise<boolean> => {
    const [insertedPageView] = await db
      .insert(marketingPageView)
      .values(pageView)
      .onConflictDoNothing()
      .returning({
        viewId: marketingPageView.viewId,
      });

    return Boolean(insertedPageView);
  },
  insertSession: async (session: AcquisitionAttributionSessionInsert): Promise<boolean> => {
    const [insertedSession] = await db
      .insert(marketingAttributionSession)
      .values(session)
      .onConflictDoNothing()
      .returning({
        sessionId: marketingAttributionSession.sessionId,
      });

    return Boolean(insertedSession);
  },
};

const service = createAcquisitionAttributionService({
  createSessionId: createId,
  createViewId: createId,
  getNow: (): Date => new Date(),
  repository,
});

export function captureAcquisitionSession(
  input: AcquisitionCaptureInput
): Promise<AcquisitionCaptureResult> {
  return service.captureAcquisitionSession(input);
}

export function bindAcquisitionSessionToUser(
  input: AcquisitionBindInput
): Promise<AcquisitionBindResult> {
  return service.bindAcquisitionSessionToUser(input);
}

export function captureMarketingPageView(
  input: MarketingPageViewCaptureInput
): Promise<MarketingPageViewCaptureResult> {
  return service.captureMarketingPageView(input);
}
