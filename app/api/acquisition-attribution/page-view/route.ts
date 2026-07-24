import { captureMarketingPageView } from "@server/acquisition-attribution";
import { NextResponse } from "next/server";
import { z } from "zod";

const pageViewRequestSchema = z.object({
  acquisitionSessionId: z.string().optional(),
  landingUrl: z.url(),
  referrer: z.string().optional(),
});

export async function POST(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = pageViewRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid acquisition payload" }, { status: 400 });
  }

  const result = await captureMarketingPageView({
    acquisitionSessionId: parsedRequest.data.acquisitionSessionId,
    landingUrl: parsedRequest.data.landingUrl,
    referrer: parsedRequest.data.referrer,
  });

  return NextResponse.json(result);
}
