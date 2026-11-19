import { isAuthorizedCronRequest } from "@lib/blog-email/cron-auth";
import { runScheduledBlogEmailDispatch } from "@lib/blog-email/runtime";
import { env } from "@lib/env";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

function publicErrorMessage(error: unknown): string {
  const message =
    error instanceof Error && error.message ? error.message : "Blog email cron failed";
  return message
    .replace(/postgres(?:ql)?:\/\/\S+/gi, "[database]")
    .replace(/\bre_[A-Za-z0-9]+\b/g, "[resend]");
}

async function handle(request: Request): Promise<Response> {
  if (!isAuthorizedCronRequest(request.headers.get("authorization"), env.CRON_SECRET)) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }

  try {
    const result = await runScheduledBlogEmailDispatch();
    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Blog email cron failed", publicErrorMessage(error));
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}

export function GET(request: Request): Promise<Response> {
  return handle(request);
}

export function POST(request: Request): Promise<Response> {
  return handle(request);
}
