import { completeSignedBlogUnsubscribe } from "@server/blog-email-service";
import { publicProcedure } from "@server/orpc";
import { z } from "zod";

export const blogEmailRouter = publicProcedure.router({
  unsubscribe: publicProcedure
    .input(
      z.object({
        token: z.string(),
      })
    )
    .handler(async ({ input }) => {
      const status = await completeSignedBlogUnsubscribe(input.token);
      return { status };
    }),
});
