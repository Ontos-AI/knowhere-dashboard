import { NextRequest } from "next/server";
import { afterEach, describe, expect, it, vi } from "vitest";

type ProxyModule = typeof import("@/proxy");

function loadProxy(authCookiePrefix: string): Promise<ProxyModule> {
  vi.resetModules();
  vi.doMock("@/lib/env", () => ({
    env: {
      AUTH_COOKIE_PREFIX: authCookiePrefix,
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: undefined,
    },
  }));
  return import("@/proxy");
}

function createRequest(url: string, cookie?: string): NextRequest {
  return new NextRequest(url, {
    headers: cookie ? { cookie } : undefined,
  });
}

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("proxy auth cookie prefix", () => {
  it("redirects protected pages when only the production cookie name is present in staging", async () => {
    const { proxy } = await loadProxy("better-auth-staging");
    const response = proxy(
      createRequest("https://staging.knowhereto.ai/usage", "better-auth.session_token=prod")
    );

    expect(response.headers.get("location")).toBe(
      "https://staging.knowhereto.ai/login?callbackURL=%2Fusage"
    );
  });

  it("allows protected pages with the configured staging secure cookie name", async () => {
    const { proxy } = await loadProxy("better-auth-staging");
    const response = proxy(
      createRequest(
        "https://staging.knowhereto.ai/usage",
        "__Secure-better-auth-staging.session_token=staging"
      )
    );

    expect(response.headers.get("location")).toBeNull();
  });
});
