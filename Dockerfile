FROM node:22-alpine AS base

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml* ./
RUN npm install -g pnpm && pnpm i --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# 通过构建参数注入环境变量
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_AUTH_BASE_URL
ARG BETTER_AUTH_URL
ARG BETTER_AUTH_SECRET
ARG GITHUB_CLIENT_ID
ARG GITHUB_CLIENT_SECRET
ARG GOOGLE_CLIENT_ID
ARG GOOGLE_CLIENT_SECRET
ARG RESEND_API_KEY
ARG RESEND_FROM

# 设置环境变量
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_AUTH_BASE_URL=$NEXT_PUBLIC_AUTH_BASE_URL
ENV BETTER_AUTH_URL=$BETTER_AUTH_URL
ENV BETTER_AUTH_SECRET=$BETTER_AUTH_SECRET
ENV GITHUB_CLIENT_ID=$GITHUB_CLIENT_ID
ENV GITHUB_CLIENT_SECRET=$GITHUB_CLIENT_SECRET
ENV GOOGLE_CLIENT_ID=$GOOGLE_CLIENT_ID
ENV GOOGLE_CLIENT_SECRET=$GOOGLE_CLIENT_SECRET
ENV RESEND_API_KEY=$RESEND_API_KEY
ENV RESEND_FROM=$RESEND_FROM

RUN npm install -g pnpm && pnpm build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs


# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
CMD ["node", "server.js"]
