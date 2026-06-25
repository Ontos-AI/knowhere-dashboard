import {
  exchangeOAuthAuthorizationCode,
  OAuthAuthError,
  refreshOAuthAccessToken,
  revokeOAuthRefreshToken,
} from "@server/oauth-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

/**
 * Shared OAuth token + revoke handlers. These power the canonical
 * /api/oauth/* routes and the legacy /api/mcp/* aliases, which are identical
 * in behavior — the calling client is identified by the `client_name` field,
 * not the route path.
 */

const tokenRequestSchema = z.discriminatedUnion("grant_type", [
  z.object({
    grant_type: z.literal("authorization_code"),
    code: z.string().min(1),
    code_verifier: z.string().min(1),
    client_name: z.string().min(1).max(120).optional(),
  }),
  z.object({
    grant_type: z.literal("refresh_token"),
    refresh_token: z.string().min(1),
  }),
]);

const revokeRequestSchema = z.object({
  refresh_token: z.string().min(1),
});

export async function handleTokenRequest(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = tokenRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid token request" }, { status: 400 });
  }

  try {
    if (parsedRequest.data.grant_type === "authorization_code") {
      const tokenResponse = await exchangeOAuthAuthorizationCode({
        code: parsedRequest.data.code,
        codeVerifier: parsedRequest.data.code_verifier,
        clientName: parsedRequest.data.client_name,
      });
      return NextResponse.json(tokenResponse);
    }

    const tokenResponse = await refreshOAuthAccessToken(parsedRequest.data.refresh_token);
    return NextResponse.json(tokenResponse);
  } catch (error: unknown) {
    if (error instanceof OAuthAuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    throw error;
  }
}

export async function handleRevokeRequest(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = revokeRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid revoke request" }, { status: 400 });
  }

  try {
    await revokeOAuthRefreshToken(parsedRequest.data.refresh_token);
    return NextResponse.json({ revoked: true });
  } catch (error: unknown) {
    if (error instanceof OAuthAuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    throw error;
  }
}
