import { auth } from "@lib/auth";
import { authRedirect } from "@lib/auth-redirect";
import { McpAuthRequestError, validateMcpLoginSearchParams } from "@lib/mcp-auth-request";
import { createMcpAuthorizationCode } from "@server/mcp-auth";
import { NextResponse } from "next/server";

export async function GET(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const loginRequest = validateLoginRequest(requestUrl.searchParams);
  if (loginRequest instanceof Response) {
    return loginRequest;
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    const callbackURL = `/mcp/login?${requestUrl.searchParams.toString()}`;
    const loginPath = authRedirect.buildAuthPagePath("/login", { callbackURL });
    return NextResponse.redirect(new URL(loginPath, requestUrl.origin));
  }

  const code = await createMcpAuthorizationCode({
    userId: session.user.id,
    request: loginRequest,
  });
  const redirectUrl = new URL(loginRequest.redirectUri);
  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", loginRequest.state);

  return NextResponse.redirect(redirectUrl);
}

function validateLoginRequest(searchParams: URLSearchParams) {
  try {
    return validateMcpLoginSearchParams(searchParams);
  } catch (error: unknown) {
    if (error instanceof McpAuthRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    throw error;
  }
}
