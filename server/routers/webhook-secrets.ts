import {
  createWebhookSecret,
  listWebhookSecrets,
  revokeWebhookSecret,
} from "@server/external-api/webhook-secrets";
import { protectedProcedure } from "@server/orpc";
import { z } from "zod";

// Webhook Secrets router
// All webhook secrets operations require authentication
export const webhookSecretsRouter = protectedProcedure.router({
  // List all webhook secrets - Protected endpoint
  // Returns all webhook secrets for the current user
  list: protectedProcedure.handler(async ({ context }) => {
    return listWebhookSecrets({ userId: context.user.id });
  }),

  // Create webhook secret - Protected endpoint
  // Creates a new webhook secret with optional endpoint URL
  create: protectedProcedure
    .input(
      z.object({
        endpoint: z
          .string()
          .url("Invalid URL format")
          .optional()
          .nullable()
          .transform((val) => val || null),
      })
    )
    .handler(async ({ input, context }) => {
      return createWebhookSecret({ userId: context.user.id, data: input });
    }),

  // Revoke webhook secret - Protected endpoint
  // Marks the specified webhook secret as revoked
  revoke: protectedProcedure
    .input(
      z.object({
        id: z.string().min(1, "Secret ID is required"),
      })
    )
    .handler(async ({ input, context }) => {
      return revokeWebhookSecret({ userId: context.user.id, id: input.id });
    }),
});
