import { afterEach, describe, expect, it, vi } from "vitest";

type AuthCookieConfigModule = typeof import("@/lib/auth-cookie-config");

function loadAuthCookieConfig(
  env: Record<string, string | undefined> = {}
): Promise<AuthCookieConfigModule> {
  vi.resetModules();
  vi.doMock("@/lib/env", () => ({
    env: {
      AUTH_COOKIE_PREFIX: "better-auth",
      NEXT_PUBLIC_APP_URL: "https://knowhereto.ai",
      ...env,
    },
  }));
  return import("@/lib/auth-cookie-config");
}

function createCookieLookup(cookieNames: readonly string[]): {
  readonly has: (name: string) => boolean;
} {
  const cookieNameSet = new Set(cookieNames);
  return {
    has: (name: string): boolean => cookieNameSet.has(name),
  };
}

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("authCookies", () => {
  it("uses the Better Auth default session cookie names", async () => {
    const { authCookies } = await loadAuthCookieConfig();

    expect(authCookies.getSessionCookieNames()).toEqual([
      "better-auth.session_token",
      "__Secure-better-auth.session_token",
    ]);
  });

  it("uses staging session cookie names when AUTH_COOKIE_PREFIX is configured", async () => {
    const { authCookies } = await loadAuthCookieConfig({
      AUTH_COOKIE_PREFIX: "better-auth-staging",
    });

    expect(authCookies.getSessionCookieNames()).toEqual([
      "better-auth-staging.session_token",
      "__Secure-better-auth-staging.session_token",
    ]);
  });

  it("recognizes only the configured proxy session cookie prefix", async () => {
    const { authCookies } = await loadAuthCookieConfig({
      AUTH_COOKIE_PREFIX: "better-auth-staging",
    });

    expect(
      authCookies.hasSessionCookie(
        createCookieLookup(["better-auth.session_token", "__Secure-better-auth.session_token"])
      )
    ).toBe(false);
    expect(
      authCookies.hasSessionCookie(
        createCookieLookup([
          "better-auth-staging.session_token",
          "__Secure-better-auth-staging.session_token",
        ])
      )
    ).toBe(true);
  });

  it("uses app URL and cookie prefix for the cookie cache version", async () => {
    const { authCookies } = await loadAuthCookieConfig({
      AUTH_COOKIE_PREFIX: "better-auth-staging",
      NEXT_PUBLIC_APP_URL: "https://staging.knowhereto.ai",
    });

    expect(authCookies.getCookieCacheVersion()).toBe(
      "https://staging.knowhereto.ai:better-auth-staging"
    );
  });
});
