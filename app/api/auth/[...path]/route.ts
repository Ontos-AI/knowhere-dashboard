import "@/lib/polyfill";
import { toNextJsHandler } from "better-auth/next-js";

const getAuthHandlers = async () => {
  const { getAuth } = await import("@lib/auth");
  return toNextJsHandler(getAuth());
};

export async function GET(request: Request) {
  const handlers = await getAuthHandlers();
  return handlers.GET(request);
}

export async function POST(request: Request) {
  const handlers = await getAuthHandlers();
  return handlers.POST(request);
}
