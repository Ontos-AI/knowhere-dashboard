import { z } from 'zod'
import { publicProcedure, protectedProcedure } from '@server/orpc'
import { api } from '@server/external-api/client'

// Subscriptions router
// Manages user subscription plans and pricing
export const subscriptionsRouter = publicProcedure.router({
  // Get price configurations - Public endpoint
  // Returns available subscription plans and pricing
  // Allows unauthenticated users to view pricing information
  getPriceConfigs: publicProcedure
    .input(
      z.object({
        productType: z.enum(['subscription', 'credits_package']).optional(),
      })
    )
    .handler(async ({ input }) => {
      return api.getPriceConfigs(input.productType)
    }),

  // Get current subscription - Protected endpoint
  // Returns the authenticated user's current subscription information
  getCurrent: protectedProcedure.handler(async () => {
    return api.getCurrentSubscription()
  }),

  // Subscribe to a plan - Protected endpoint
  // Creates a checkout session for subscribing to a plan
  subscribe: protectedProcedure
    .input(
      z.object({
        planId: z.string().min(1, 'Plan ID is required'),
      })
    )
    .handler(async ({ input }) => {
      return api.subscribePlan(input.planId)
    }),

  // Cancel subscription - Protected endpoint
  // Cancels the user's current subscription
  cancel: protectedProcedure.handler(async () => {
    return api.cancelSubscription()
  }),
})
