import { handleTokenRequest } from "@server/oauth-token-handlers";

/**
 * OAuth token endpoint (authorization_code + refresh_token grants). Shared by
 * all clients (CLI, MCP); the caller is identified by the client_name field.
 */
export async function POST(request: Request): Promise<Response> {
  return handleTokenRequest(request);
}
