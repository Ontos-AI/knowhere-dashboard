import {
  createApiKey,
  deleteApiKey,
  listApiKeys,
  revokeApiKey,
  toggleApiKey,
  updateApiKey,
} from "@server/external-api/api-keys";
import { protectedProcedure } from "@server/orpc";
import { z } from "zod";

// API Keys router
// All API Keys operations require authentication
export const apiKeysRouter = protectedProcedure.router({
  // Get API Keys list - Protected endpoint
  // Returns all API keys for the current user
  list: protectedProcedure.handler(async ({ context }) => {
    return listApiKeys({ userId: context.user.id });
  }),

  // Create API Key - Protected endpoint
  // Creates a new API key with specified name and modules
  create: protectedProcedure
    .input(
      z.object({
        name: z.string().min(1, "API key name is required"),
        enabled_modules: z.array(z.string()).optional(),
        expires_at: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      return createApiKey({ userId: context.user.id, data: input });
    }),

  // Delete API Key - Protected endpoint
  // Revokes and removes the specified API key
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "API key ID is required"),
      })
    )
    .handler(async ({ input, context }) => {
      return deleteApiKey({ userId: context.user.id, id: input.id });
    }),

  // Revoke API Key - Protected endpoint
  // Alternative endpoint to delete/revoke an API key
  revoke: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "API key ID is required"),
      })
    )
    .handler(async ({ input, context }) => {
      return revokeApiKey({ userId: context.user.id, id: input.id });
    }),

  // Update API Key - Protected endpoint
  // Updates API key status or name
  update: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "API key ID is required"),
        is_active: z.boolean().optional(),
        name: z.string().optional(),
      })
    )
    .handler(async ({ input, context }) => {
      const { id, ...data } = input;
      return updateApiKey({ userId: context.user.id, id, data });
    }),

  // Toggle API Key status - Protected endpoint
  // Toggles the active/inactive status of an API key
  toggle: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "API key ID is required"),
      })
    )
    .handler(async ({ input, context }) => {
      return toggleApiKey({ userId: context.user.id, id: input.id });
    }),
});
