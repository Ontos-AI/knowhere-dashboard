import { OAuthAuthError, revokeOAuthRefreshToken } from "@server/oauth-auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const revokeRequestSchema = z.object({
  refresh_token: z.string().min(1),
});

export async function POST(request: Request): Promise<Response> {
  const requestBody = await request.json().catch(() => null);
  const parsedRequest = revokeRequestSchema.safeParse(requestBody);

  if (!parsedRequest.success) {
    return NextResponse.json({ message: "Invalid MCP revoke request" }, { status: 400 });
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
