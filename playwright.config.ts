import { defineConfig, devices } from "@playwright/test";

const appOrigin = process.env.APP_ORIGIN ?? "http://localhost:3000";
const isCi = Boolean(process.env.CI);

export default defineConfig({
  testDir: "./e2e",
  fullyParallel: false,
  forbidOnly: isCi,
  retries: isCi ? 1 : 0,
  workers: 1,
  reporter: isCi ? [["github"], ["list"]] : "list",
  use: {
    baseURL: appOrigin,
    trace: "on-first-retry",
    ...devices["Desktop Chrome"],
    viewport: { width: 1920, height: 1080 },
  },
  projects: [
    {
      name: "app",
      testMatch: "site-1-1.app.ts",
    },
    {
      name: "proto",
      testMatch: "site-1-1.proto.ts",
    },
  ],
  webServer:
    process.env.PLAYWRIGHT_SKIP_WEBSERVER === "1"
      ? undefined
      : {
          command: "pnpm start",
          url: appOrigin,
          reuseExistingServer: !isCi,
          timeout: 120_000,
          env: {
            ...process.env,
            SKIP_ENV_VALIDATION: "1",
            BETTER_AUTH_SECRET:
              process.env.BETTER_AUTH_SECRET ?? "build-validation-only-auth-secret-32-chars",
            BETTER_AUTH_URL: process.env.BETTER_AUTH_URL ?? appOrigin,
            NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5005/api",
            NEXT_PUBLIC_AUTH_BASE_URL: process.env.NEXT_PUBLIC_AUTH_BASE_URL ?? "/api/auth",
            NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? appOrigin,
            BILLING_ENABLED: process.env.BILLING_ENABLED ?? "false",
            RESEND_API_KEY: process.env.RESEND_API_KEY ?? "re_build_validation_placeholder",
          },
        },
});
