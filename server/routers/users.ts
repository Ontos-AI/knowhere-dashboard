import { z } from 'zod'
import { protectedProcedure } from '@server/orpc'
import { api } from '@server/external-api/client'

// Users router
// All user operations require authentication
export const usersRouter = protectedProcedure.router({
  // Get current user information - Protected endpoint
  // Returns complete profile of the authenticated user
  getCurrentUser: protectedProcedure.handler(async () => {
    return api.getUserProfile()
  }),

  // Update user profile - Protected endpoint
  // Allows partial updates to user information
  updateProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        avatar_url: z.string().url('Invalid URL format').optional(),
      })
    )
    .handler(async ({ input }) => {
      return api.updateUserProfile(input)
    }),
})
