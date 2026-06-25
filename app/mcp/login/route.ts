import { type ConsentSurface, handleConsentGet, handleConsentPost } from "@server/oauth-consent";

const MCP_CONSENT_SURFACE: ConsentSurface = {
  loginPath: "/mcp/login",
  title: "Authorize Knowhere",
  summary: "is requesting access to your Knowhere account.",
};

export async function GET(request: Request): Promise<Response> {
  return handleConsentGet(request, MCP_CONSENT_SURFACE);
}

export async function POST(request: Request): Promise<Response> {
  return handleConsentPost(request, MCP_CONSENT_SURFACE);
}
