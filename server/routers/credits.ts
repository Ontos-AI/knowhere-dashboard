import { isBillingEnabled } from "@lib/billing";
import { ORPCError } from "@orpc/server";
import {
  buyCredits,
  buyCreditsPackage,
  getCreditPackages,
  getCreditsBalance,
} from "@server/external-api/credits";
import { protectedProcedure } from "@server/orpc";
import { z } from "zod";

// Credits router
// All credits operations require authentication
export const creditsRouter = protectedProcedure.router({
  // Get credits balance - Protected endpoint
  // Returns current credits balance for the authenticated user
  getBalance: protectedProcedure.handler(async ({ context }) => {
    if (!isBillingEnabled()) {
      return { credits_balance: 0 };
    }

    return getCreditsBalance({ userId: context.user.id });
  }),

  // Purchase credits - Protected endpoint
  // Creates a checkout session for buying credits
  purchase: protectedProcedure
    .input(
      z.object({
        amount: z.number().min(1, "Amount must be at least 1"),
      })
    )
    .handler(async ({ input, context }) => {
      if (!isBillingEnabled()) {
        throw new ORPCError("FORBIDDEN", { message: "Billing is disabled" });
      }

      return buyCredits({ userId: context.user.id, amount: input.amount });
    }),

  // Get credit packages - Protected endpoint
  // Returns available credit packages for purchase
  getPackages: protectedProcedure.handler(async ({ context }) => {
    if (!isBillingEnabled()) {
      return [];
    }

    return getCreditPackages({ userId: context.user.id });
  }),

  // Buy credits package - Protected endpoint
  // Creates checkout session for purchasing a specific credits package
  buyPackage: protectedProcedure
    .input(
      z.object({
        priceId: z.string().min(1, "Price ID is required"),
        quantity: z.number().min(1, "Quantity must be at least 1"),
      })
    )
    .handler(async ({ input, context }) => {
      if (!isBillingEnabled()) {
        throw new ORPCError("FORBIDDEN", { message: "Billing is disabled" });
      }

      return buyCreditsPackage({
        userId: context.user.id,
        priceId: input.priceId,
        quantity: input.quantity,
      });
    }),
});
