import {
  cancelSubscription,
  getCurrentSubscription,
  getPriceConfigs,
  subscribePlan,
} from "@server/external-api/subscriptions";
import { protectedProcedure, publicProcedure } from "@server/orpc";
import { z } from "zod";

// Subscriptions router
// Manages user subscription plans and pricing
export const subscriptionsRouter = publicProcedure.router({
  // Get price configurations - Public endpoint
  // Returns available subscription plans and pricing
  // Allows unauthenticated users to view pricing information
  getPriceConfigs: publicProcedure
    .input(
      z.object({
        productType: z.enum(["subscription", "credits_package"]).optional(),
      })
    )
    .handler(async ({ input }) => {
      return getPriceConfigs({ productType: input.productType });
    }),

  // Get current subscription - Protected endpoint
  // Returns the authenticated user's current subscription information
  getCurrent: protectedProcedure.handler(async ({ context }) => {
    return getCurrentSubscription({ userId: context.user.id });
  }),

  // Subscribe to a plan - Protected endpoint
  // Creates a checkout session for subscribing to a plan
  subscribe: protectedProcedure
    .input(
      z.object({
        planId: z.string().min(1, "Plan ID is required"),
      })
    )
    .handler(async ({ input, context }) => {
      return subscribePlan({ userId: context.user.id, planId: input.planId });
    }),

  // Cancel subscription - Protected endpoint
  // Cancels the user's current subscription
  cancel: protectedProcedure.handler(async ({ context }) => {
    return cancelSubscription({ userId: context.user.id });
  }),
});
