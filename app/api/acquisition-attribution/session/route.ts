import {
  ACQUISITION_ATTRIBUTION_COOKIE_NAME,
  ACQUISITION_ATTRIBUTION_TTL_SECONDS,
} from "@lib/acquisition-attribution/core";
import { captureAcquisitionSession } from "@server/acquisition-attribution";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const captureRequestSchema = z.object({
  landingUrl: z.url(),
  referrer: z.string().optional(),
});

export async function POST(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = captureRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid acquisition payload" }, { status: 400 });
  }

  const cookieStore = await cookies();
  const existingSessionId = cookieStore.get(ACQUISITION_ATTRIBUTION_COOKIE_NAME)?.value ?? null;
  const result = await captureAcquisitionSession({
    existingSessionId,
    landingUrl: parsedRequest.data.landingUrl,
    referrer: parsedRequest.data.referrer,
  });
  const response = NextResponse.json(result);

  if (result.sessionId) {
    response.cookies.set(ACQUISITION_ATTRIBUTION_COOKIE_NAME, result.sessionId, {
      httpOnly: true,
      maxAge: ACQUISITION_ATTRIBUTION_TTL_SECONDS,
      path: "/",
      sameSite: "lax",
      secure: new URL(request.url).protocol === "https:",
    });
  }

  return response;
}
