import crypto from "node:crypto";
import { db } from "@lib/db";
import { mcpAuthorizationCode, mcpRefreshToken } from "@lib/db/schema";
import { type McpLoginRequest, type Permission, validatePkceVerifier } from "@lib/mcp-auth-request";
import {
  issueKnowhereServiceJwt,
  KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
} from "@server/knowhere-service-jwt";
import { and, eq, gt, isNull } from "drizzle-orm";

const MCP_AUTH_CODE_TTL_MS = 5 * 60 * 1000;
const MCP_REFRESH_TOKEN_TTL_MS = 30 * 24 * 60 * 60 * 1000;
const TOKEN_BYTE_LENGTH = 32;

export type McpTokenResponse = {
  readonly accessToken: string;
  readonly expiresInSeconds: number;
  readonly permission: Permission;
  readonly refreshToken?: string;
  readonly refreshTokenExpiresAt?: string;
  readonly tokenType: "Bearer";
};

export class McpAuthError extends Error {
  readonly status: number;

  constructor(message: string, status = 400) {
    super(message);
    this.name = "McpAuthError";
    this.status = status;
  }
}

export async function createMcpAuthorizationCode({
  userId,
  request,
  permission,
}: {
  readonly userId: string;
  readonly request: McpLoginRequest;
  readonly permission: Permission;
}): Promise<string> {
  const code = createSecretToken();
  const expiresAt = new Date(Date.now() + MCP_AUTH_CODE_TTL_MS);

  await db.insert(mcpAuthorizationCode).values({
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

export async function exchangeMcpAuthorizationCode({
  code,
  codeVerifier,
  clientName,
}: {
  readonly code: string;
  readonly codeVerifier: string;
  readonly clientName?: string;
}): Promise<McpTokenResponse> {
  const now = new Date();
  const [authorizationCode] = await db
    .update(mcpAuthorizationCode)
    .set({ consumedAt: now })
    .where(
      and(
        eq(mcpAuthorizationCode.codeHash, hashSecretToken(code)),
        isNull(mcpAuthorizationCode.consumedAt),
        gt(mcpAuthorizationCode.expiresAt, now)
      )
    )
    .returning();

  if (!authorizationCode) {
    throw new McpAuthError("Invalid or expired authorization code", 401);
  }

  const isVerifierValid = validatePkceVerifier({
    codeChallenge: authorizationCode.codeChallenge,
    codeVerifier,
  });
  if (!isVerifierValid) {
    throw new McpAuthError("Invalid authorization verifier", 401);
  }

  return issueMcpTokenPair({
    userId: authorizationCode.userId,
    clientName: clientName?.trim() || authorizationCode.clientName,
    permission: normalizeStoredPermission(authorizationCode.permission),
  });
}

export async function refreshMcpAccessToken(refreshToken: string): Promise<McpTokenResponse> {
  const now = new Date();
  const storedRefreshToken = await db.query.mcpRefreshToken.findFirst({
    where: and(
      eq(mcpRefreshToken.tokenHash, hashSecretToken(refreshToken)),
      isNull(mcpRefreshToken.revokedAt),
      gt(mcpRefreshToken.expiresAt, now)
    ),
  });

  if (!storedRefreshToken) {
    throw new McpAuthError("Invalid or expired refresh token", 401);
  }

  await db
    .update(mcpRefreshToken)
    .set({ lastUsedAt: now })
    .where(eq(mcpRefreshToken.id, storedRefreshToken.id));

  const permission = normalizeStoredPermission(storedRefreshToken.permission);

  return {
    accessToken: await issueKnowhereServiceJwt(storedRefreshToken.userId, { permission }),
    expiresInSeconds: KNOWHERE_SERVICE_JWT_EXPIRY_SECONDS,
    permission,
    tokenType: "Bearer",
  };
}

export async function revokeMcpRefreshToken(refreshToken: string): Promise<void> {
  await db
    .update(mcpRefreshToken)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(mcpRefreshToken.tokenHash, hashSecretToken(refreshToken)),
        isNull(mcpRefreshToken.revokedAt)
      )
    );
}

async function issueMcpTokenPair({
  userId,
  clientName,
  permission,
}: {
  readonly userId: string;
  readonly clientName: string;
  readonly permission: Permission;
}): Promise<McpTokenResponse> {
  const refreshToken = createSecretToken();
  const refreshTokenExpiresAt = new Date(Date.now() + MCP_REFRESH_TOKEN_TTL_MS);

  await db.insert(mcpRefreshToken).values({
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
