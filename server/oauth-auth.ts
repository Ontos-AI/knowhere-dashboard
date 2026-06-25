import crypto from "node:crypto";
import { db } from "@lib/db";
import { oauthAuthorizationCode, oauthRefreshToken } from "@lib/db/schema";
import { type OAuthLoginRequest, type Permission, validatePkceVerifier } from "@lib/oauth-request";
import {
  issueKnowhereServiceJwt,
  KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
} from "@server/knowhere-service-jwt";
import { and, eq, gt, isNull } from "drizzle-orm";

const OAUTH_AUTH_CODE_TTL_MS = 5 * 60 * 1000;
const OAUTH_REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TOKEN_BYTE_LENGTH = 32;

export type OAuthTokenResponse = {
  readonly accessToken: string;
  readonly expiresInSeconds: number;
  readonly permission: Permission;
  readonly refreshToken?: string;
  readonly refreshTokenExpiresAt?: string;
  readonly tokenType: "Bearer";
};

export class OAuthAuthError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "OAuthAuthError";
    this.status = status;
  }
}

export async function createOAuthAuthorizationCode({
  userId,
  request,
  permission,
}: {
  readonly userId: string;
  readonly request: OAuthLoginRequest;
  readonly permission: Permission;
}): Promise<string> {
  const code = createSecretToken();
  const expiresAt = new Date(Date.now() + OAUTH_AUTH_CODE_TTL_MS);

  await db.insert(oauthAuthorizationCode).values({
    userId,
    codeHash: hashSecretToken(code),
    redirectUri: request.redirectUri,
    codeChallenge: request.codeChallenge,
    clientName: request.clientName,
    permission,
    expiresAt,
  });

  return code;
}

export async function exchangeOAuthAuthorizationCode({
  code,
  codeVerifier,
  clientName,
}: {
  readonly code: string;
  readonly codeVerifier: string;
  readonly clientName?: string;
}): Promise<OAuthTokenResponse> {
  const now = new Date();
  const [authorizationCode] = await db
    .update(oauthAuthorizationCode)
    .set({ consumedAt: now })
    .where(
      and(
        eq(oauthAuthorizationCode.codeHash, hashSecretToken(code)),
        isNull(oauthAuthorizationCode.consumedAt),
        gt(oauthAuthorizationCode.expiresAt, now)
      )
    )
    .returning();

  if (!authorizationCode) {
    throw new OAuthAuthError("Invalid or expired authorization code", 401);
  }

  const isVerifierValid = validatePkceVerifier({
    codeChallenge: authorizationCode.codeChallenge,
    codeVerifier,
  });
  if (!isVerifierValid) {
    throw new OAuthAuthError("Invalid authorization verifier", 401);
  }

  return issueOAuthTokenPair({
    userId: authorizationCode.userId,
    clientName: clientName?.trim() || authorizationCode.clientName,
    permission: normalizeStoredPermission(authorizationCode.permission),
  });
}

export async function refreshOAuthAccessToken(refreshToken: string): Promise<OAuthTokenResponse> {
  const now = new Date();
  const storedRefreshToken = await db.query.oauthRefreshToken.findFirst({
    where: and(
      eq(oauthRefreshToken.tokenHash, hashSecretToken(refreshToken)),
      isNull(oauthRefreshToken.revokedAt),
      gt(oauthRefreshToken.expiresAt, now)
    ),
  });

  if (!storedRefreshToken) {
    throw new OAuthAuthError("Invalid or expired refresh token", 401);
  }

  await db
    .update(oauthRefreshToken)
    .set({ lastUsedAt: now })
    .where(eq(oauthRefreshToken.id, storedRefreshToken.id));

  const permission = normalizeStoredPermission(storedRefreshToken.permission);

  return {
    accessToken: await issueKnowhereServiceJwt(storedRefreshToken.userId, { permission }),
    expiresInSeconds: KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
    permission,
    tokenType: "Bearer",
  };
}

export async function revokeOAuthRefreshToken(refreshToken: string): Promise<void> {
  await db
    .update(oauthRefreshToken)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(oauthRefreshToken.tokenHash, hashSecretToken(refreshToken)),
        isNull(oauthRefreshToken.revokedAt)
      )
    );
}

async function issueOAuthTokenPair({
  userId,
  clientName,
  permission,
}: {
  readonly userId: string;
  readonly clientName: string;
  readonly permission: Permission;
}): Promise<OAuthTokenResponse> {
  const refreshToken = createSecretToken();
  const refreshTokenExpiresAt = new Date(Date.now() + OAUTH_REFRESH_TOKEN_TTL_MS);

  await db.insert(oauthRefreshToken).values({
    userId,
    tokenHash: hashSecretToken(refreshToken),
    name: clientName,
    permission,
    expiresAt: refreshTokenExpiresAt,
  });

  return {
    accessToken: await issueKnowhereServiceJwt(userId, { permission }),
    expiresInSeconds: KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
    permission,
    refreshToken,
    refreshTokenExpiresAt: refreshTokenExpiresAt.toISOString(),
    tokenType: "Bearer",
  };
}

function normalizeStoredPermission(permission: string): Permission {
  return permission === "read_only" ? "read_only" : "full_access";
}

function createSecretToken(): string {
  return crypto.randomBytes(TOKEN_BYTE_LENGTH).toString("base64url");
}

function hashSecretToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}
