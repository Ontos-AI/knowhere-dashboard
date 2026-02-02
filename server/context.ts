import { auth } from "@lib/auth";
import { os } from "@orpc/server";
import type { Session, User } from "better-auth/types";

// Context type that will be available in all oRPC procedures
export type Context = {
  headers: Headers;
  user: User | null;
  session: Session | null;
};

// Base oRPC instance with context type
export const base = os.$context<Context>();

// Helper function to create context from request headers
export async function createContext(headers: Headers): Promise<Context> {
  const sessionData = await auth.api.getSession({ headers });

  return {
    headers,
    user: sessionData?.user ?? null,
    session: sessionData?.session ?? null,
  };
}
