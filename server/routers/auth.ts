import { z } from 'zod'
import { publicProcedure, protectedProcedure } from '@server/orpc'

// Authentication router
// Handles user login, registration, profile management, and password changes
export const authRouter = publicProcedure.router({
  // User login - Public endpoint
  // Returns access token and user information
  login: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().optional(),
        provider: z.string().optional(),
        id_token: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      return context.api.login(input)
    }),

  // User registration - Public endpoint
  // Creates a new user account
  register: publicProcedure
    .input(
      z.object({
        email: z.string().email('Invalid email format'),
        password: z.string().optional(),
        username: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      return context.api.register(input)
    }),

  // Get current user profile - Protected endpoint
  // Requires authentication
  getUserProfile: protectedProcedure.handler(async ({ context }) => {
    return context.api.getUserProfile()
  }),

  // Update user profile - Protected endpoint
  // Allows partial updates to user information
  updateUserProfile: protectedProcedure
    .input(
      z.object({
        username: z.string().optional(),
        avatar_url: z.string().url().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      return context.api.updateUserProfile(input)
    }),

  // Change password - Protected endpoint
  // Updates user's password
  changePassword: protectedProcedure
    .input(
      z.object({
        old_password: z.string().min(6, 'Password must be at least 6 characters'),
        new_password: z.string().min(6, 'Password must be at least 6 characters'),
      })
    )
    .handler(async ({ input, context }) => {
      return context.api.changePassword(input)
    }),
})
