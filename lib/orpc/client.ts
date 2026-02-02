import { createORPCClient } from "@orpc/client";
import { RPCLink } from "@orpc/client/fetch";
import type { RouterClient } from "@orpc/server";
import { createTanstackQueryUtils } from "@orpc/tanstack-query";
import type { AppRouter } from "@/app/api/orpc/[...orpc]/route";
import { env } from "@/lib/env";

// Create RPC link for HTTP communication
// Authentication is handled automatically via Better Auth session cookies — no manual token management needed
const link = new RPCLink({
  url: `${typeof window !== "undefined" ? window.location.origin : env.NEXT_PUBLIC_APP_URL}/api/orpc`,
  headers: async () => {
    if (typeof window !== "undefined") {
      // Browser: cookies are sent automatically by fetch
      return {};
    }

    // SSR: forward incoming request headers (includes session cookie)
    const { headers } = await import("next/headers");
    return await headers();
  },
});

// Create oRPC client for type-safe API calls
export const orpcClient = createORPCClient<RouterClient<AppRouter>>(link);

// Create TanStack Query utilities for oRPC
export const orpcQuery = createTanstackQueryUtils<RouterClient<AppRouter>>(orpcClient);
