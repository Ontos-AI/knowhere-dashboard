import { getParseUsage, getTransactionHistory, getUsageStats } from "@server/external-api/usage";
import { protectedProcedure } from "@server/orpc";
import { z } from "zod";

// Usage statistics router
// All usage stats operations require authentication
export const usageRouter = protectedProcedure.router({
  // Get usage statistics - Protected endpoint
  // Returns usage stats for the specified period
  getStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(["day", "week", "month", "year"]).default("month"),
      })
    )
    .handler(async ({ input, context }) => {
      return getUsageStats({ userId: context.user.id, period: input.period });
    }),

  // Get parse usage - Protected endpoint
  // Returns parsing service usage statistics
  getParseUsage: protectedProcedure.handler(async ({ context }) => {
    return getParseUsage({ userId: context.user.id });
  }),

  // Get transaction history - Protected endpoint
  // Returns credit transaction history with pagination
  getTransactionHistory: protectedProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100).default(50),
        offset: z.number().min(0).default(0),
      })
    )
    .handler(async ({ input, context }) => {
      return getTransactionHistory({
        userId: context.user.id,
        limit: input.limit,
        offset: input.offset,
      });
    }),
});
