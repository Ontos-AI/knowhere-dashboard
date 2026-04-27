import "@/lib/polyfill";
import { getAuth } from "@lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

const handleAuthRequest = (request: Request): Promise<Response> => {
  return getAuth().handler(request);
};

export const { GET, POST } = toNextJsHandler(handleAuthRequest);
