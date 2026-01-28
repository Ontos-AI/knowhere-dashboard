import { base } from '@server/context'
import { authRouter } from '@server/routers/auth'
import { apiKeysRouter } from '@server/routers/api-keys'
import { usersRouter } from '@server/routers/users'
import { creditsRouter } from '@server/routers/credits'
import { subscriptionsRouter } from '@server/routers/subscriptions'
import { usageRouter } from '@server/routers/usage'

// Main application router
// Combines all sub-routers into a single oRPC router
// This router provides type-safe, end-to-end API access
export const appRouter = base.router({
  auth: authRouter,
  apiKeys: apiKeysRouter,
  users: usersRouter,
  credits: creditsRouter,
  subscriptions: subscriptionsRouter,
  usage: usageRouter,
})

// Export the router type for client-side type inference
export type AppRouter = typeof appRouter
