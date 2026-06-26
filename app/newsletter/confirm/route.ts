import { confirmNewsletterSubscription } from "@server/newsletter-service";
import { type NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const token = request.nextUrl.searchParams.get("token") ?? "";
  const result = await confirmNewsletterSubscription(token);
  const redirectUrl = new URL("/newsletter/confirmed", request.nextUrl.origin);

  redirectUrl.searchParams.set("status", result.status);

  return NextResponse.redirect(redirectUrl);
}
