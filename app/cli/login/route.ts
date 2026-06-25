import { type ConsentSurface, handleConsentGet, handleConsentPost } from "@server/oauth-consent";

const CLI_CONSENT_SURFACE: ConsentSurface = {
  loginPath: "/cli/login",
  title: "Authorize Knowhere CLI",
  summary: "is requesting access to your Knowhere account from the command line.",
};

export async function GET(request: Request): Promise<Response> {
  return handleConsentGet(request, CLI_CONSENT_SURFACE);
}

export async function POST(request: Request): Promise<Response> {
  return handleConsentPost(request, CLI_CONSENT_SURFACE);
}
