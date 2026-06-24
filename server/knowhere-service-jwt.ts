import { auth } from "@lib/auth";
import { ORPCError } from "@orpc/server";

export const KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS = 60 * 60;
const KNOWHERE_SERVICE_JWT_EXPIRATION = "1h";

export async function issueKnowhereServiceJwt(userId: string): Promise<string> {
  const { token } = await auth.api.signJWT({
    body: {
      payload: { id: userId },
      overrideOptions: { jwt: { expirationTime: KNOWHERE_SERVICE_JWT_EXPIRATION } },
    },
  });

  if (!token || token.length === 0) {
    throw new ORPCError("INTERNAL_SERVER_ERROR", {
      message: "JWT signing returned an empty token.",
    });
  }

  return token;
}
