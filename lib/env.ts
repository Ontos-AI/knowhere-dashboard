import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

function normalizeOptionalString(value: unknown): unknown {
  if (typeof value !== "string") {
    return value;
  }

  const trimmedValue = value.trim();

  return trimmedValue === "" ? undefined : trimmedValue;
}

function normalizeOptionalUrl(value: unknown): unknown {
  return normalizeOptionalString(value);
}

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.url(),
    NEWSLETTER_DATABASE_URL: z.preprocess(normalizeOptionalUrl, z.url().optional()),
    UNSAFE_DB_SSL_ENABLED: z.string().default("false"),
    GA_MEASUREMENT_ID: z
      .string()
      .regex(/^G-[A-Z0-9]+$/)
      .optional(),
    OPENAI_ADS_PIXEL_ID: z.preprocess(normalizeOptionalString, z.string().optional()),
    OPENAI_ADS_CONVERSIONS_API_KEY: z.preprocess(normalizeOptionalString, z.string().optional()),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM: z.string().default("Knowhere <team@knowhereto.ai>"),
    BILLING_ENABLED: z.string().default("false"),
    PASSWORD_LOGIN_ENABLED: z.string().default("false"),
    /**
     * Parent domain for the Better Auth session cookie. When set, Dashboard
     * enables `advanced.crossSubDomainCookies` with this value so the cookie
     * is shared across subdomains.
     *
     * Examples:
     *   - prod:  `example.com`
     *   - local: `local.example.com`
     *   - test/CI: unset — keeps host-only cookies
     *
     * Leave unset to preserve the host-only cookie behavior.
     */
    AUTH_COOKIE_DOMAIN: z.string().optional(),
    AUTH_COOKIE_PREFIX: z
      .preprocess(
        normalizeOptionalString,
        z
          .string()
          .regex(/^[A-Za-z0-9_-]+$/, "AUTH_COOKIE_PREFIX must be a cookie-safe prefix")
          .default("better-auth")
      )
      .describe("Better Auth cookie prefix. Staging uses a distinct prefix to isolate cookies."),
    NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
    DEV_EXTERNAL_API_AUTHORIZATION: z.string().optional(),
    HTTPS_PROXY: z.string().optional(),
    HTTP_PROXY: z.string().optional(),
  },
  client: {
    NEXT_PUBLIC_API_URL: z.url(),
    NEXT_PUBLIC_AUTH_BASE_URL: z.string(),
    NEXT_PUBLIC_APP_URL: z.url(),
    NEXT_PUBLIC_POSTHOG_KEY: z.string().optional(),
    NEXT_PUBLIC_POSTHOG_HOST: z.url().default("https://app.posthog.com"),
    /**
     * Comma-separated list of external origins (scheme + host + optional
     * port, no trailing slash) that Dashboard is allowed to redirect to
     * post-login. The allowlist is not a secret — it simply declares
     * which sibling-app hostnames Dashboard trusts as post-login targets.
     * Same value is read from client code (for the login action's
     * `router.push`) and server code (for Better Auth's trustedOrigins),
     * so it's a NEXT_PUBLIC variable.
     *
     * Example:
     *   `https://app1.example.com,http://app1.local.example.com:3001`
     *
     * Arbitrary external callback URLs are rejected. Leave unset to
     * disable all external callbacks.
     */
    NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS: z.string().optional(),
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    NEWSLETTER_DATABASE_URL: process.env.NEWSLETTER_DATABASE_URL,
    UNSAFE_DB_SSL_ENABLED: process.env.UNSAFE_DB_SSL_ENABLED,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    OPENAI_ADS_PIXEL_ID: process.env.OPENAI_ADS_PIXEL_ID,
    OPENAI_ADS_CONVERSIONS_API_KEY: process.env.OPENAI_ADS_CONVERSIONS_API_KEY,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    BILLING_ENABLED: process.env.BILLING_ENABLED,
    PASSWORD_LOGIN_ENABLED: process.env.PASSWORD_LOGIN_ENABLED,
    AUTH_COOKIE_DOMAIN: process.env.AUTH_COOKIE_DOMAIN,
    AUTH_COOKIE_PREFIX: process.env.AUTH_COOKIE_PREFIX,
    NODE_ENV: process.env.NODE_ENV,
    DEV_EXTERNAL_API_AUTHORIZATION: process.env.DEV_EXTERNAL_API_AUTHORIZATION,
    HTTPS_PROXY: process.env.HTTPS_PROXY,
    HTTP_PROXY: process.env.HTTP_PROXY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS:
      process.env.NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
