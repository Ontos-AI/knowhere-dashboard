"use client";

import { magicLinkClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";

// Shared Better Auth client. Magic Link is optional; email/password is available by default.
export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? env.NEXT_PUBLIC_AUTH_BASE_URL?.startsWith("http")
        ? env.NEXT_PUBLIC_AUTH_BASE_URL
        : `${env.NEXT_PUBLIC_APP_URL}${env.NEXT_PUBLIC_AUTH_BASE_URL}`
      : `${window.location.origin}/api/auth`,
  plugins: [magicLinkClient()],
});
