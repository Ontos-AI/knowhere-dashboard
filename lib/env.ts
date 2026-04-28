import { createEnv } from "@t3-oss/env-nextjs";
import { z } from "zod";

export const env = createEnv({
  server: {
    BETTER_AUTH_SECRET: z.string().min(32),
    BETTER_AUTH_URL: z.url(),
    DATABASE_URL: z.url(),
    UNSAFE_DB_SSL_ENABLED: z.string().default("false"),
    GA_MEASUREMENT_ID: z
      .string()
      .regex(/^G-[A-Z0-9]+$/)
      .optional(),
    GITHUB_CLIENT_ID: z.string().optional(),
    GITHUB_CLIENT_SECRET: z.string().optional(),
    GOOGLE_CLIENT_ID: z.string().optional(),
    GOOGLE_CLIENT_SECRET: z.string().optional(),
    RESEND_API_KEY: z.string().optional(),
    RESEND_FROM: z.string().default("onboarding@resend.dev"),
    BILLING_ENABLED: z.string().default("false"),
    PASSWORD_LOGIN_ENABLED: z.string().default("false"),
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
  },
  runtimeEnv: {
    BETTER_AUTH_SECRET: process.env.BETTER_AUTH_SECRET,
    BETTER_AUTH_URL: process.env.BETTER_AUTH_URL,
    DATABASE_URL: process.env.DATABASE_URL,
    UNSAFE_DB_SSL_ENABLED: process.env.UNSAFE_DB_SSL_ENABLED,
    GA_MEASUREMENT_ID: process.env.GA_MEASUREMENT_ID,
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
    RESEND_API_KEY: process.env.RESEND_API_KEY,
    RESEND_FROM: process.env.RESEND_FROM,
    BILLING_ENABLED: process.env.BILLING_ENABLED,
    PASSWORD_LOGIN_ENABLED: process.env.PASSWORD_LOGIN_ENABLED,
    NODE_ENV: process.env.NODE_ENV,
    DEV_EXTERNAL_API_AUTHORIZATION: process.env.DEV_EXTERNAL_API_AUTHORIZATION,
    HTTPS_PROXY: process.env.HTTPS_PROXY,
    HTTP_PROXY: process.env.HTTP_PROXY,
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
    NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL,
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
    NEXT_PUBLIC_POSTHOG_KEY: process.env.NEXT_PUBLIC_POSTHOG_KEY,
    NEXT_PUBLIC_POSTHOG_HOST: process.env.NEXT_PUBLIC_POSTHOG_HOST,
  },
  skipValidation: !!process.env.SKIP_ENV_VALIDATION,
});
