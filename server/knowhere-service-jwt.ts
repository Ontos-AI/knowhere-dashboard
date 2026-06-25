import { auth } from "@lib/auth";
import type { Permission } from "@lib/oauth-request";
import { ORPCError } from "@orpc/server";

export const KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS = 60 * 60;
const KNOWHERE_SERVICE_JWT_EXPIRATION = "1h";

export async function issueKnowhereServiceJwt(
  userId: string,
  options: { readonly permission?: Permission } = {}
): Promise<string> {
  const payload =
    options.permission === undefined
      ? { id: userId }
      : { id: userId, permission: options.permission };
  const { token } = await auth.api.signJWT({
    body: {
      payload,
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
