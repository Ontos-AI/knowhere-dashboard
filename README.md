# Knowhere API Dashboard

Knowhere API Dashboard is the Next.js web application for managing Knowhere API usage, API keys, optional billing, webhooks, and document-processing jobs.

- Product: https://knowhereto.ai/
- Docs: https://docs.knowhereto.ai/
- License: Apache-2.0

## Requirements

- Node.js 22
- pnpm 10
- PostgreSQL for the dashboard auth and account database
- A reachable Knowhere API backend

## Local Development

Install dependencies and create your local environment file:

```bash
pnpm install
cp .env.example .env.local
```

Fill in the required values in `.env.local`. For most local work, the important values are:

- `DATABASE_URL`: PostgreSQL database used by the dashboard.
- `NEWSLETTER_DATABASE_URL`: optional PostgreSQL database used by newsletter subscriptions. Defaults to `DATABASE_URL` when unset.
- `NEXT_PUBLIC_API_URL`: Knowhere API backend URL.
- `NEXT_PUBLIC_APP_URL` and `BETTER_AUTH_URL`: usually `http://localhost:3000`.
- `BETTER_AUTH_SECRET`: any random secret with at least 32 characters.

Start the development server:

```bash
pnpm dev
```

The app runs on `http://localhost:3000` by default.

## Self-hosted

For self-hosted deployment, use the combined stack in the dedicated repository:
https://github.com/Ontos-AI/knowhere-self-hosted

This dashboard repository is useful when developing the web app directly. The self-hosted repository owns the end-to-end local stack and deployment instructions.

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
| `NEWSLETTER_DATABASE_URL` | Optional PostgreSQL connection URL for newsletter subscription data. Falls back to `DATABASE_URL` when unset. |
| `UNSAFE_DB_SSL_ENABLED` | Optional escape hatch for local/self-hosted PostgreSQL without SSL. Set to `true` only when the database does not support SSL. Defaults to `false`, so hosted SaaS keeps SSL enabled without extra config. |

Email/password registration is enabled for self-hosted deployments. The login page defaults to SSO plus Resend-backed email links; set `PASSWORD_LOGIN_ENABLED=true` only when you want to expose the password-login entry point. OAuth and Resend-backed magic-link login are optional add-ons. Password reset emails also use Resend; signed-in OAuth users can set a password from dashboard settings.

Required for specific features:

| Variable | Feature |
| --- | --- |
| `RESEND_API_KEY`, `RESEND_FROM` | Magic-link email login and password reset emails. |
| `GITHUB_CLIENT_ID`, `GITHUB_CLIENT_SECRET` | GitHub OAuth login. |
| `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET` | Google OAuth login. |

Optional:

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_HOST` | PostHog analytics. |
| `GA_MEASUREMENT_ID` | Google Analytics measurement ID. |
| `OPENAI_ADS_PIXEL_ID` | OpenAI Ads Measurement Pixel ID. Set to `JDvSf6KLL8Y3e8QJhCmFF3` for the current pixel. |
| `OPENAI_ADS_CONVERSIONS_API_KEY` | Optional OpenAI Ads Conversions API key for server-side conversion delivery. |
| `BILLING_ENABLED` | Set to `true` only when the API billing endpoints and payment configuration are available. Defaults to disabled for open-source self-hosted deployments. |
| `PASSWORD_LOGIN_ENABLED` | Set to `true` to show the login page's password-login button. Defaults to hidden. |
| `AUTH_COOKIE_DOMAIN` | Optional Better Auth parent cookie domain for cross-subdomain sessions. Leave unset for host-only cookies. |
| `AUTH_COOKIE_PREFIX` | Optional Better Auth cookie prefix. Defaults to `better-auth`; staging should use a distinct prefix such as `better-auth-staging`. |
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

## Database Migrations

Dashboard auth/account data and newsletter subscription data have separate Drizzle migration configs:

```bash
pnpm db:migrate
pnpm newsletter-db:migrate
```

Production newsletter storage reads `NEWSLETTER_DATABASE_URL` from the optional Kubernetes Secret key `knowhere-secrets/newsletter-database-url` when it exists. If it is unset, newsletter storage falls back to `DATABASE_URL`.

## Docker

Build the image:

```bash
docker build -t knowhere-dashboard .
```

Run the dashboard:

```bash
docker run --rm -p 3000:3000 --env-file .env.local knowhere-dashboard
```

The container runs `pnpm db:migrate` and `pnpm newsletter-db:migrate` before starting the Next.js server. If either command fails, the app server is not started.

The image runs the standard Next.js Node server with `pnpm start`. Runtime configuration is injected through environment variables; the Docker build does not create or bake `.env.production`.

## Public CI and Images

The public workflow runs lint, type-check, tests, and build on pull requests and repository pushes.

This repository does not publish standalone public dashboard images. Public self-hosted image publishing is handled by the combined self-hosted repository.
