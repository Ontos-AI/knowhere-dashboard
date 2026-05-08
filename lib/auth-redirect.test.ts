import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/**
 * Tests for the callback sanitizer and allowlist.
 *
 * The allowlist is parsed once at module load from
 * `NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS`. We reset modules between test cases so
 * each one can stub `@/lib/env` with a different value and load a fresh
 * `auth-redirect` module.
 */

type LoadFn = () => Promise<typeof import("@/lib/auth-redirect")>;

function setEnv(env: Record<string, string | undefined>): LoadFn {
  vi.resetModules();
  vi.doMock("@/lib/env", () => ({
    env: {
      NEXT_PUBLIC_APP_URL: "https://dashboard.example",
      BETTER_AUTH_URL: "https://dashboard.example",
      AUTH_COOKIE_DOMAIN: undefined,
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: undefined,
      ...env,
    },
  }));
  return () => import("@/lib/auth-redirect");
}

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
});

describe("parseAllowedExternalOrigins (via authRedirect.allowedExternalOrigins)", () => {
  it("is empty when NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS is unset", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: undefined,
    })();
    expect(authRedirect.allowedExternalOrigins).toEqual([]);
  });

  it("is empty when the value is only whitespace", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "  ,  ,",
    })();
    expect(authRedirect.allowedExternalOrigins).toEqual([]);
  });

  it("normalizes each entry to its origin and trims whitespace", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS:
        "  https://app1.example.com/ , http://app1.local.example.com:3001 ",
    })();
    expect(authRedirect.allowedExternalOrigins).toEqual([
      "https://app1.example.com",
      "http://app1.local.example.com:3001",
    ]);
  });

  it("drops entries that do not parse as URLs", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "not-a-url, https://good.example, 🙂",
    })();
    expect(authRedirect.allowedExternalOrigins).toEqual(["https://good.example"]);
  });
});

describe("getSafeCallbackURL — relative paths (legacy flavor)", () => {
  let load: LoadFn;
  beforeEach(() => {
    load = setEnv({});
  });

  it("returns null for empty / nullish input", async () => {
    const { authRedirect } = await load();
    expect(authRedirect.getSafeCallbackURL(null)).toBeNull();
    expect(authRedirect.getSafeCallbackURL(undefined)).toBeNull();
    expect(authRedirect.getSafeCallbackURL("")).toBeNull();
  });

  it("returns a normalized safe internal path", async () => {
    const { authRedirect } = await load();
    expect(authRedirect.getSafeCallbackURL("/usage")).toBe("/usage");
    expect(authRedirect.getSafeCallbackURL("/settings/billing")).toBe("/settings/billing");
  });

  it("preserves query parameters for internal paths", async () => {
    const { authRedirect } = await load();
    expect(authRedirect.getSafeCallbackURL("/usage?plan=pro")).toBe("/usage?plan=pro");
  });

  it("rejects protocol-relative paths (//host)", async () => {
    const { authRedirect } = await load();
    expect(authRedirect.getSafeCallbackURL("//evil.example")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("//evil.example/path")).toBeNull();
  });

  it("rejects Dashboard auth pages (prevents login loops)", async () => {
    const { authRedirect } = await load();
    expect(authRedirect.getSafeCallbackURL("/login")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("/register")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("/forgot-password")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("/reset-password")).toBeNull();
  });

  it("rejects Dashboard auth callback subtree", async () => {
    const { authRedirect } = await load();
    expect(authRedirect.getSafeCallbackURL("/callback")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("/callback/magic-link")).toBeNull();
  });
});

describe("getSafeCallbackURL — external origins (allowlist flavor)", () => {
  it("rejects external URLs when the allowlist is unset", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: undefined,
    })();
    expect(authRedirect.getSafeCallbackURL("https://app1.example.com")).toBeNull();
  });

  it("accepts an allowlisted external origin and echoes the URL", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    expect(authRedirect.getSafeCallbackURL("https://app1.example.com")).toBe(
      "https://app1.example.com/"
    );
    expect(authRedirect.getSafeCallbackURL("https://app1.example.com/inbox")).toBe(
      "https://app1.example.com/inbox"
    );
  });

  it("rejects an external URL whose origin is not allowlisted", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    expect(authRedirect.getSafeCallbackURL("https://evil.example")).toBeNull();
    expect(
      // Near-miss: different scheme
      authRedirect.getSafeCallbackURL("http://app1.example.com")
    ).toBeNull();
    expect(
      // Near-miss: different port
      authRedirect.getSafeCallbackURL("https://app1.example.com:8080")
    ).toBeNull();
  });

  it("rejects malformed absolute URLs", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    expect(authRedirect.getSafeCallbackURL("http://")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("https:// space.example")).toBeNull();
  });

  it("rejects non-http(s) schemes even if they parse", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    expect(authRedirect.getSafeCallbackURL("javascript:alert(1)")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("data:text/html,hi")).toBeNull();
    expect(authRedirect.getSafeCallbackURL("file:///etc/passwd")).toBeNull();
  });

  it("accepts allowlisted origin paths that happen to match Dashboard auth routes", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    // External origins are fully trusted for whatever path they declare.
    // Dashboard auth-path rules only gate Dashboard's own relative paths.
    expect(authRedirect.getSafeCallbackURL("https://app1.example.com/login")).toBe(
      "https://app1.example.com/login"
    );
    expect(authRedirect.getSafeCallbackURL("https://app1.example.com/callback/x")).toBe(
      "https://app1.example.com/callback/x"
    );
  });
});

describe("resolveCallbackURL", () => {
  it("returns the default path when input is unsafe", async () => {
    const { authRedirect } = await setEnv({})();
    expect(authRedirect.resolveCallbackURL("//evil")).toBe(authRedirect.defaultPath);
    expect(authRedirect.resolveCallbackURL("https://not-allowlisted.example")).toBe(
      authRedirect.defaultPath
    );
  });

  it("returns the safe path/URL when input is safe", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    expect(authRedirect.resolveCallbackURL("/usage")).toBe("/usage");
    expect(authRedirect.resolveCallbackURL("https://app1.example.com/inbox")).toBe(
      "https://app1.example.com/inbox"
    );
  });
});

describe("buildAuthPagePath", () => {
  it("includes a sanitized relative callbackURL when provided", async () => {
    const { authRedirect } = await setEnv({})();
    expect(authRedirect.buildAuthPagePath("/login", { callbackURL: "/usage" })).toBe(
      "/login?callbackURL=%2Fusage"
    );
  });

  it("drops an unsafe callbackURL silently", async () => {
    const { authRedirect } = await setEnv({})();
    expect(authRedirect.buildAuthPagePath("/login", { callbackURL: "//evil.example" })).toBe(
      "/login"
    );
  });

  it("includes an allowlisted external callbackURL", async () => {
    const { authRedirect } = await setEnv({
      NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: "https://app1.example.com",
    })();
    expect(
      authRedirect.buildAuthPagePath("/login", {
        callbackURL: "https://app1.example.com/inbox",
      })
    ).toBe("/login?callbackURL=https%3A%2F%2Fapp1.example.com%2Finbox");
  });
});

describe("isProtectedPath", () => {
  it("matches protected prefixes", async () => {
    const { authRedirect } = await setEnv({})();
    expect(authRedirect.isProtectedPath("/dashboard")).toBe(true);
    expect(authRedirect.isProtectedPath("/dashboard/api-keys")).toBe(true);
    expect(authRedirect.isProtectedPath("/usage")).toBe(true);
    expect(authRedirect.isProtectedPath("/settings/billing")).toBe(true);
  });

  it("rejects auth pages and unrelated paths", async () => {
    const { authRedirect } = await setEnv({})();
    expect(authRedirect.isProtectedPath("/login")).toBe(false);
    expect(authRedirect.isProtectedPath("/")).toBe(false);
    expect(authRedirect.isProtectedPath("/public/marketing")).toBe(false);
  });
});
