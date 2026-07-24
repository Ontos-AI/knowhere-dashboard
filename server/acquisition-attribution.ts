import { db } from "@lib/db";
import { marketingAttributionSession } from "@lib/db/schema";
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
