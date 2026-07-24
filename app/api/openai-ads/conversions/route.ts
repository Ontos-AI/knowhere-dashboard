import { sendOpenAIAdsConversionEvent } from "@server/openai-ads-conversions";
import { NextResponse } from "next/server";
import { z } from "zod";

const openAIAdsEventNameSchema = z.enum([
  "checkout_started",
  "lead_created",
  "order_created",
  "registration_completed",
  "subscription_created",
]);

const openAIAdsConversionDataSchema = z.discriminatedUnion("type", [
  z
    .object({
      type: z.literal("customer_action"),
    })
    .strict(),
  z
    .object({
      amount: z.number().int().nonnegative().optional(),
      currency: z.literal("USD").optional(),
      type: z.literal("contents"),
    })
    .strict(),
  z
    .object({
      amount: z.number().int().nonnegative().optional(),
      currency: z.literal("USD").optional(),
      plan_id: z.string().min(1).optional(),
      type: z.literal("plan_enrollment"),
    })
    .strict(),
]);

const openAIAdsConversionRequestSchema = z.object({
  data: openAIAdsConversionDataSchema,
  eventId: z.string().min(1),
  eventName: openAIAdsEventNameSchema,
  sourceUrl: z.url().optional(),
  timestamp: z.iso.datetime(),
});

export async function POST(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = openAIAdsConversionRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid OpenAI Ads conversion payload" }, { status: 400 });
  }

  try {
    const result = await sendOpenAIAdsConversionEvent(parsedRequest.data);
    return NextResponse.json(result, { status: 202 });
  } catch (error: unknown) {
    console.error("[openai-ads] failed to send conversion event", error);
    return NextResponse.json({ message: "OpenAI Ads conversion delivery failed" }, { status: 502 });
  }
}
