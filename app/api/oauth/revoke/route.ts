import { handleRevokeRequest } from "@server/oauth-token-handlers";

/** OAuth refresh-token revoke endpoint. Shared by all clients (CLI, MCP). */
export async function POST(request: Request): Promise<Response> {
  return handleRevokeRequest(request);
}
