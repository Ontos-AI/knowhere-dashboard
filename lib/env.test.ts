import { afterEach, describe, expect, it, vi } from "vitest";

type EnvModule = typeof import("@/lib/env");

const REQUIRED_ENV = {
  BETTER_AUTH_SECRET: "test-auth-secret-with-at-least-32-chars",
  BETTER_AUTH_URL: "https://knowhereto.ai",
  DATABASE_URL: "postgres://user:pass@example.com:5432/dashboard",
  NEXT_PUBLIC_API_URL: "https://api.knowhereto.ai/api",
  NEXT_PUBLIC_AUTH_BASE_URL: "/api/auth",
  NEXT_PUBLIC_APP_URL: "https://knowhereto.ai",
} as const;

async function loadEnv(overrides: Record<string, string | undefined> = {}): Promise<EnvModule> {
  vi.resetModules();

  for (const [key, value] of Object.entries(REQUIRED_ENV)) {
    vi.stubEnv(key, value);
  }

  for (const [key, value] of Object.entries(overrides)) {
    vi.stubEnv(key, value);
  }

  return import("@/lib/env");
}

afterEach(() => {
  vi.resetModules();
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("env.AUTH_COOKIE_PREFIX", () => {
  it("defaults to the Better Auth production cookie prefix when unset", async () => {
    const { env } = await loadEnv({
      AUTH_COOKIE_PREFIX: undefined,
    });

    expect(env.AUTH_COOKIE_PREFIX).toBe("better-auth");
  });

  it("rejects cookie prefixes that are unsafe for generated cookie names", async () => {
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    await expect(
      loadEnv({
        AUTH_COOKIE_PREFIX: "better.auth",
      })
    ).rejects.toThrow("Invalid environment variables");
    expect(consoleError).toHaveBeenCalled();
  });
});

describe("env.OPENAI_ADS", () => {
  it("normalizes blank OpenAI Ads values to undefined", async () => {
    const { env } = await loadEnv({
      OPENAI_ADS_CONVERSIONS_API_KEY: " ",
      OPENAI_ADS_PIXEL_ID: "",
    });

    expect(env.OPENAI_ADS_PIXEL_ID).toBeUndefined();
    expect(env.OPENAI_ADS_CONVERSIONS_API_KEY).toBeUndefined();
  });

  it("loads configured OpenAI Ads values", async () => {
    const { env } = await loadEnv({
      OPENAI_ADS_CONVERSIONS_API_KEY: "conversions_key",
      OPENAI_ADS_PIXEL_ID: "JDvSf6KLL8Y3e8QJhCmFF3",
    });

    expect(env.OPENAI_ADS_PIXEL_ID).toBe("JDvSf6KLL8Y3e8QJhCmFF3");
    expect(env.OPENAI_ADS_CONVERSIONS_API_KEY).toBe("conversions_key");
  });
});
