import {
  confirmNewsletterSubscription,
  requestNewsletterSubscription,
  unsubscribeNewsletterSubscription,
} from "@server/newsletter-service";
import { publicProcedure } from "@server/orpc";
import { z } from "zod";

export const newsletterRouter = publicProcedure.router({
  confirm: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .handler(async ({ input }) => {
      return confirmNewsletterSubscription(input.token);
    }),
  subscribe: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email("Invalid email address").max(320),
      })
    )
    .handler(async ({ input }) => {
      return requestNewsletterSubscription(input.email);
    }),
  unsubscribe: publicProcedure
    .input(
      z.object({
        email: z.string().trim().email("Invalid email address").max(320),
      })
    )
    .handler(async ({ input }) => {
      return unsubscribeNewsletterSubscription(input.email);
    }),
});
