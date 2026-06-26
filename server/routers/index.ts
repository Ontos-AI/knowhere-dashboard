import { base } from "@server/context";
import { apiKeysRouter } from "@server/routers/api-keys";
import { creditsRouter } from "@server/routers/credits";
import { jobsRouter } from "@server/routers/jobs";
import { newsletterRouter } from "@server/routers/newsletter";
import { subscriptionsRouter } from "@server/routers/subscriptions";
import { usageRouter } from "@server/routers/usage";
import { usersRouter } from "@server/routers/users";
import { webhookSecretsRouter } from "@server/routers/webhook-secrets";

// Main application router — combines all sub-routers into a single oRPC router
export const appRouter = base.router({
  apiKeys: apiKeysRouter,
  users: usersRouter,
  credits: creditsRouter,
  subscriptions: subscriptionsRouter,
  newsletter: newsletterRouter,
  usage: usageRouter,
  jobs: jobsRouter,
  webhookSecrets: webhookSecretsRouter,
});

// Export the router type for client-side type inference
export type AppRouter = typeof appRouter;
