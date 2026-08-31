import { createRemoteJWKSet, type JWTPayload, jwtVerify } from "jose";

/**
 * Dashboard service JWTs last one hour. QStash workflows may keep a snapshot
 * for much longer, so refresh accepts recently expired tokens whose signature
 * still verifies. Seven days is the outer bound for that replay window.
 */
export const SERVICE_JWT_REFRESH_CLOCK_TOLERANCE_SECONDS = 7 * 24 * 60 * 60;

export function readServiceJwtUserId(payload: JWTPayload): string | null {
  const userId = payload.id;
  return typeof userId === "string" && userId.length > 0 ? userId : null;
}

export async function verifyServiceJwtForRefresh(token: string, jwksUrl: string): Promise<string> {
  const jwks = createRemoteJWKSet(new URL(jwksUrl));
  const { payload } = await jwtVerify(token, jwks, {
    clockTolerance: SERVICE_JWT_REFRESH_CLOCK_TOLERANCE_SECONDS,
  });
  const userId = readServiceJwtUserId(payload);
  if (!userId) {
    throw new Error("Service JWT is missing a user id.");
  }
  return userId;
}
