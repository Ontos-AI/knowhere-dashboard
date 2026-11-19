import crypto from "node:crypto";

export function isAuthorizedCronRequest(
  authorizationHeader: string | null,
  secret: string | undefined
): boolean {
  if (!secret) {
    return false;
  }

  const provided = Buffer.from(authorizationHeader ?? "");
  const expected = Buffer.from(`Bearer ${secret}`);
  if (provided.length !== expected.length) {
    return false;
  }

  return crypto.timingSafeEqual(provided, expected);
}
