import {
  exchangeMcpAuthorizationCode,
  McpAuthError,
  refreshMcpAccessToken,
} from "@server/mcp-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

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

export async function POST(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = tokenRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid MCP token request" }, { status: 400 });
  }

  try {
    if (parsedRequest.data.grant_type === "authorization_code") {
      const tokenResponse = await exchangeMcpAuthorizationCode({
        code: parsedRequest.data.code,
        codeVerifier: parsedRequest.data.code_verifier,
        clientName: parsedRequest.data.client_name,
      });
      return NextResponse.json(tokenResponse);
    }

    const tokenResponse = await refreshMcpAccessToken(parsedRequest.data.refresh_token);
    return NextResponse.json(tokenResponse);
  } catch (error: unknown) {
    if (error instanceof McpAuthError) {
      return NextResponse.json({ message: error.message }, { status: error.status });
    }

    throw error;
  }
}
