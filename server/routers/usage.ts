import { isBillingEnabled } from "@lib/billing";
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
      if (!isBillingEnabled()) {
        return {};
      }

      return getUsageStats({ userId: context.user.id, period: input.period });
    }),

  // Get parse usage - Protected endpoint
  // Returns parsing service usage statistics
  getParseUsage: protectedProcedure.handler(async ({ context }) => {
    if (!isBillingEnabled()) {
      return {
        request_total: 0,
        mom_growth: 0,
        credits_used: 0,
        estimated_amount: 0,
        success_rate: 0,
        avg_processing_time: 0,
      };
    }

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
      if (!isBillingEnabled()) {
        return { transactions: [], total: 0 };
      }

      return getTransactionHistory({
        userId: context.user.id,
        limit: input.limit,
        offset: input.offset,
      });
    }),
});
