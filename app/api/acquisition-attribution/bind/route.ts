import { ACQUISITION_ATTRIBUTION_COOKIE_NAME } from "@lib/acquisition-attribution/core";
import { auth } from "@lib/auth";
import { bindAcquisitionSessionToUser } from "@server/acquisition-attribution";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { z } from "zod";

const bindRequestSchema = z.object({
  userId: z.string().min(1),
});

export async function POST(request: Request): Promise<Response> {
  const sessionData = await auth.api.getSession({ headers: request.headers });
  if (!sessionData?.user?.id) {
    return NextResponse.json({ message: "Authentication required" }, { status: 401 });
  }

  const requestBody = await request.json().catch(() => null);
  const parsedRequest = bindRequestSchema.safeParse(requestBody);
  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid acquisition bind payload" }, { status: 400 });
  }

  if (parsedRequest.data.userId !== sessionData.user.id) {
    return NextResponse.json(
      { message: "Cannot bind attribution to another user" },
      { status: 403 }
    );
  }

  const cookieStore = await cookies();
  const sessionId = cookieStore.get(ACQUISITION_ATTRIBUTION_COOKIE_NAME)?.value ?? null;
  const result = await bindAcquisitionSessionToUser({
    sessionId,
    userId: sessionData.user.id,
  });

  return NextResponse.json(result);
}
