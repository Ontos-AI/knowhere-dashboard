import { base } from "@server/context";
import { apiKeysRouter } from "@server/routers/api-keys";
import { creditsRouter } from "@server/routers/credits";
import { jobsRouter } from "@server/routers/jobs";
import { subscriptionsRouter } from "@server/routers/subscriptions";
import { usageRouter } from "@server/routers/usage";
import { usersRouter } from "@server/routers/users";

// Main application router — combines all sub-routers into a single oRPC router
export const appRouter = base.router({
  apiKeys: apiKeysRouter,
  users: usersRouter,
  credits: creditsRouter,
  subscriptions: subscriptionsRouter,
  usage: usageRouter,
  jobs: jobsRouter,
});

// Export the router type for client-side type inference
export type AppRouter = typeof appRouter;
