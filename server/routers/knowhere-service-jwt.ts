import { env } from "@lib/env";
import { ORPCError } from "@orpc/server";
import {
  issueKnowhereServiceJwt,
  KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
} from "@server/knowhere-service-jwt";
import { publicProcedure } from "@server/orpc";
import { z } from "zod";
import { verifyServiceJwtForRefresh } from "@/lib/knowhere-service-jwt-refresh";

export const knowhereServiceJwtRouter = publicProcedure.router({
  /**
   * Re-issue a one-hour Knowhere service JWT from a still-signed snapshot.
   *
   * Notebook QStash workflows cannot send the Dashboard session cookie, so they
   * POST the stored JWT here when it is near expiry. Signature is required;
   * expiration may be up to seven days in the past.
   */
  refresh: publicProcedure
    .input(z.object({ token: z.string().min(1) }))
    .handler(async ({ input }) => {
      let userId: string;
      try {
        userId = await verifyServiceJwtForRefresh(
          input.token,
          `${env.BETTER_AUTH_URL}/api/auth/jwks`
        );
      } catch {
        throw new ORPCError("UNAUTHORIZED", {
          status: 401,
          message: "Authentication required",
        });
      }

      return {
        token: await issueKnowhereServiceJwt(userId),
        expiresInSeconds: KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
      };
    }),
});
