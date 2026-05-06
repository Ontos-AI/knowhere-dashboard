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

## Self-hosted Dashboard Flow

For the combined open-source stack, start the dashboard migration/bootstrap step before the API service runs its Alembic migrations. The dashboard owns the Better Auth user/auth schema and provides the normal first-user registration flow.

The default self-hosted flow is:

1. Start PostgreSQL, Redis, object storage, and other shared dependencies.
2. Start the dashboard migration/bootstrap step so Better Auth tables exist.
3. Start the API with standalone mode disabled, then run API migrations.
4. Register or sign in through the dashboard with email and password, or use Resend-backed magic-link login when email delivery is configured.
5. Create and manage API keys from the dashboard.
6. Process jobs through the API/worker with dashboard billing disabled.

Use `BILLING_ENABLED=false` for the open-source self-hosted dashboard unless the matching paid billing endpoints are deployed and configured.

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
| `BILLING_ENABLED` | Set to `true` only when the API billing endpoints and payment configuration are available. Defaults to disabled for open-source self-hosted deployments. |
| `PASSWORD_LOGIN_ENABLED` | Set to `true` to show the login page's password-login button. Defaults to hidden. |
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
docker build -t knowhere-dashboard .
```

Run the dashboard:

```bash
docker run --rm -p 3000:3000 --env-file .env.local knowhere-dashboard
```

The container runs `pnpm db:generate` and `pnpm db:migrate` before starting the Next.js server. If either command fails, the app server is not started.

The image runs the standard Next.js Node server with `pnpm start`. Runtime configuration is injected through environment variables; the Docker build does not create or bake `.env.production`.

## Public CI and Images

The public workflow runs lint, type-check, tests, and build on pull requests and pushes to `main` and `staging`.

This repository does not publish standalone public dashboard images. Public self-hosted image publishing is handled by the combined self-hosted release workflow.

The public boundary for this repository is documented in [docs/publication-scope.md](docs/publication-scope.md).

## Deployment

Merging a pull request into `staging` or `main` triggers `.github/workflows/deploy.yml` through the branch push created by the merge. The workflow builds the dashboard image, pushes it to the configured AWS image registry, and updates the configured Kubernetes deployment with `kubectl set image`.

DevOps must configure these GitHub repository secrets:

| Name | Purpose |
| --- | --- |
| `AWS_ACCESS_KEY_ID` | AWS principal allowed to push images and update the cluster. |
| `AWS_SECRET_ACCESS_KEY` | Secret key for the AWS principal. |
| `AWS_EKS_PROD_CLUSTER_NAME` | Kubernetes cluster name used by `aws eks update-kubeconfig`. |
| `AWS_EKS_PROD_REGION` | AWS region for the image registry and cluster. |
| `DASHBOARD_IMAGE_REGISTRY` | Registry host, for example an AWS account registry host. |
| `DASHBOARD_IMAGE_REPOSITORY` | Dashboard image repository path inside the registry. |
| `DASHBOARD_KUBE_CONTAINER` | Container name inside the dashboard Deployment. |
| `DASHBOARD_KUBE_DEPLOYMENT` | Dashboard Kubernetes Deployment name. |
| `DASHBOARD_KUBE_NAMESPACE_STAGING` | Namespace updated when `staging` is deployed. |
| `DASHBOARD_KUBE_NAMESPACE_PROD` | Namespace updated when `main` is deployed. |

The AWS principal must be able to authenticate to the image registry, push the dashboard image, call `eks:DescribeCluster`, and update the target deployment. The cluster must be able to pull the pushed image.

Runtime environment variables are still injected by the deployment platform, not by the Docker build. Because the container runs `pnpm db:generate` and `pnpm db:migrate` before `pnpm start`, the deployed pod must have `DATABASE_URL` and the required auth/app URL environment variables at startup. The container filesystem must allow writes to the app directory unless the migration generation step is moved out of container startup.
