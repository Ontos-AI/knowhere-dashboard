import { z } from 'zod'
import { protectedProcedure } from '@server/orpc'
import { api } from '@server/external-api/client'

// Usage statistics router
// All usage stats operations require authentication
export const usageRouter = protectedProcedure.router({
  // Get usage statistics - Protected endpoint
  // Returns usage stats for the specified period
  getStats: protectedProcedure
    .input(
      z.object({
        period: z.enum(['day', 'week', 'month', 'year']).default('month'),
      })
    )
    .handler(async ({ input }) => {
      return api.getUsageStats(input.period)
    }),

  // Get parse usage - Protected endpoint
  // Returns parsing service usage statistics
  getParseUsage: protectedProcedure.handler(async () => {
    return api.getParseUsage()
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
    .handler(async ({ input }) => {
      return api.getTransactionHistory(input.limit, input.offset)
    }),
})
