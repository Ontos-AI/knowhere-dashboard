"use client";

import { usernameClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { env } from "@/lib/env";

// Shared Better Auth client. Email/password is the only sign-in method.
export const authClient = createAuthClient({
  baseURL:
    typeof window === "undefined"
      ? env.NEXT_PUBLIC_AUTH_BASE_URL?.startsWith("http")
        ? env.NEXT_PUBLIC_AUTH_BASE_URL
        : `${env.NEXT_PUBLIC_APP_URL}${env.NEXT_PUBLIC_AUTH_BASE_URL}`
      : `${window.location.origin}/api/auth`,
  plugins: [usernameClient()],
});
