# Knowhere API Dashboard

Knowhere API Dashboard is the Next.js web application for managing Knowhere API usage, API keys, billing, webhooks, and document-processing jobs.

- Product: https://knowhereto.ai/
- Docs: https://docs.knowhereto.ai/
- License: Apache-2.0

## Requirements

- Node.js 22
- pnpm 10
- PostgreSQL for the dashboard auth and account database
- A reachable Knowhere API backend

## Local Setup

Install dependencies:

```bash
pnpm install
```

Create local environment configuration:

```bash
cp .env.example .env.local
```

Fill in the required values in `.env.local`, then start the development server:

```bash
pnpm dev
```

The app runs on `http://localhost:3000` by default.

## Environment Variables

Required for startup:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_APP_URL` | Public dashboard URL, for example `http://localhost:3000`. |
| `NEXT_PUBLIC_API_URL` | Knowhere API backend URL, for example `http://localhost:5005/api`. |
| `NEXT_PUBLIC_AUTH_BASE_URL` | Auth route base path. Use `/api/auth` for the built-in route. |
| `BETTER_AUTH_URL` | Base URL used by Better Auth callbacks. |
| `BETTER_AUTH_SECRET` | Random secret with at least 32 characters. |
| `DATABASE_URL` | PostgreSQL connection URL for dashboard auth/account data. |

Required for specific features:

| Variable | Feature |
| --- | --- |
| `RESEND_API_KEY`, `RESEND_FROM` | Magic-link email login. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth login. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth login. |

Optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | PostHog analytics. |
| `GA_MEASUREMENT_ID` | Google Analytics measurement ID. |
| `COMPANY_NAME`, `SIMPLE_COMPANY_NAME` | Runtime branding text. |
| `ICP_NUMBER`, `ICP_URL` | ICP footer metadata for deployments that need it. |
| `HTTPS_PROXY`, `HTTP_PROXY` | Development proxy for outbound auth/email calls. |

Do not commit `.env.local`, `.env.production`, or any other real environment file.

## Quality Commands

```bash
pnpm lint
pnpm type-check
pnpm test
pnpm build
```

`pnpm test` currently runs publication guardrails that check for private deployment markers and public credential defaults.

## Docker

Build the image:

```bash
docker build -t knowhere-api-dashboard .
```

Run the dashboard:

```bash
docker run --rm -p 3000:3000 --env-file .env.local knowhere-api-dashboard
```

The container runs `pnpm db:generate` and `pnpm db:migrate` before starting the Next.js server. If either command fails, the app server is not started.

The image runs the standard Next.js Node server with `pnpm start`. Runtime configuration is injected through environment variables; the Docker build does not create or bake `.env.production`.

## Public CI and Images

The public workflow runs lint, type-check, tests, and build on pull requests and pushes to `main`.

Docker images are published to GitHub Container Registry only for version tags such as `v1.0.0`, or when a maintainer runs the workflow manually with image publishing enabled. Private production deployment remains outside this public repository and should be owned by the private DevOps process.

Open DevOps decisions before public release:

- confirm the final GHCR image naming and tag policy
- confirm private production deployment remains outside the public repository
- confirm runtime environment injection and secret handling
- confirm whether migrations should remain a separate command or move to a platform-owned release step
