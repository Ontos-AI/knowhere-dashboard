import { completeSignedBlogUnsubscribe } from "@server/blog-email-service";

export const dynamic = "force-dynamic";

async function unsubscribe(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return new Response(null, {
      headers: { allow: "POST", "cache-control": "no-store" },
      status: 405,
    });
  }

  const token = new URL(request.url).searchParams.get("token") ?? "";

  try {
    const result = await completeSignedBlogUnsubscribe(token);
    if (result === "invalid") {
      return new Response("invalid", { headers: { "cache-control": "no-store" }, status: 400 });
    }

    return new Response("unsubscribed", {
      headers: { "cache-control": "no-store", "content-type": "text/plain; charset=utf-8" },
      status: 200,
    });
  } catch (error) {
    console.error("[BlogEmail] One-click unsubscribe failed:", error);
    return new Response("error", { headers: { "cache-control": "no-store" }, status: 500 });
  }
}

export function GET(): Response {
  return new Response(null, {
    headers: { allow: "POST", "cache-control": "no-store" },
    status: 405,
  });
}

export function POST(request: Request): Promise<Response> {
  return unsubscribe(request);
}
