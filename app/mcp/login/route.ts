import { auth } from "@lib/auth";
import { authRedirect } from "@lib/auth-redirect";
import {
  DEFAULT_PERMISSION,
  McpAuthRequestError,
  type McpLoginRequest,
  type Permission,
  parsePermission,
  validateMcpLoginSearchParams,
} from "@lib/mcp-auth-request";
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
    return redirectToDashboardLogin(requestUrl.origin, requestUrl.searchParams);
  }

  return renderConsentPage(loginRequest);
}

export async function POST(request: Request): Promise<Response> {
  const requestUrl = new URL(request.url);
  const formData = await request.formData();
  const searchParams = buildLoginSearchParams(formData);
  const loginRequest = validateLoginRequest(searchParams);
  if (loginRequest instanceof Response) {
    return loginRequest;
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return redirectToDashboardLogin(requestUrl.origin, searchParams);
  }

  const intent = formData.get("intent");
  if (intent === "deny") {
    return redirectWithDeniedAuthorization(loginRequest);
  }
  if (intent !== "approve") {
    return NextResponse.json({ message: "Invalid MCP login action" }, { status: 400 });
  }

  const permission = validatePermission(formData.get("permission") ?? DEFAULT_PERMISSION);
  if (permission instanceof Response) {
    return permission;
  }

  const code = await createMcpAuthorizationCode({
    userId: session.user.id,
    request: loginRequest,
    permission,
  });
  return redirectWithAuthorizationCode(loginRequest, code);
}

function redirectToDashboardLogin(origin: string, searchParams: URLSearchParams): Response {
  const callbackURL = `/mcp/login?${searchParams.toString()}`;
  const loginPath = authRedirect.buildAuthPagePath("/login", { callbackURL });
  return NextResponse.redirect(new URL(loginPath, origin));
}

function redirectWithAuthorizationCode(loginRequest: McpLoginRequest, code: string): Response {
  const redirectUrl = new URL(loginRequest.redirectUri);
  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", loginRequest.state);

  return NextResponse.redirect(redirectUrl);
}

function redirectWithDeniedAuthorization(loginRequest: McpLoginRequest): Response {
  const redirectUrl = new URL(loginRequest.redirectUri);
  redirectUrl.searchParams.set("error", "access_denied");
  redirectUrl.searchParams.set("state", loginRequest.state);
  return NextResponse.redirect(redirectUrl);
}

function validateLoginRequest(searchParams: URLSearchParams): McpLoginRequest | Response {
  try {
    return validateMcpLoginSearchParams(searchParams);
  } catch (error: unknown) {
    if (error instanceof McpAuthRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    throw error;
  }
}

function validatePermission(value: FormDataEntryValue | string | null): Permission | Response {
  try {
    return parsePermission(value);
  } catch (error: unknown) {
    if (error instanceof McpAuthRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }

    throw error;
  }
}

function buildLoginSearchParams(formData: FormData): URLSearchParams {
  const searchParams = new URLSearchParams();
  for (const key of [
    "redirect_uri",
    "state",
    "code_challenge",
    "code_challenge_method",
    "client_name",
  ]) {
    const value = formData.get(key);
    if (typeof value === "string") {
      searchParams.set(key, value);
    }
  }
  return searchParams;
}

function renderConsentPage(loginRequest: McpLoginRequest): Response {
  const hiddenInputs = [
    ["redirect_uri", loginRequest.redirectUri],
    ["state", loginRequest.state],
    ["code_challenge", loginRequest.codeChallenge],
    ["code_challenge_method", "S256"],
    ["client_name", loginRequest.clientName],
  ]
    .map(
      ([name, value]) =>
        `<input type="hidden" name="${escapeHtml(name)}" value="${escapeHtml(value)}">`
    )
    .join("");

  return new Response(
    `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Authorize Knowhere</title>
    <style>
      :root {
        color-scheme: light;
        font-family: Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        color: #101828;
        background: #f6f7f9;
      }
      * {
        box-sizing: border-box;
      }
      body {
        margin: 0;
        min-height: 100vh;
        display: grid;
        place-items: center;
        padding: 32px 16px;
      }
      main {
        width: min(100%, 560px);
        background: #ffffff;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        box-shadow: 0 18px 48px rgb(16 24 40 / 12%);
        padding: 32px;
      }
      h1 {
        margin: 0;
        font-size: 24px;
        line-height: 1.25;
        letter-spacing: 0;
      }
      .summary {
        margin: 10px 0 24px;
        color: #475467;
        line-height: 1.5;
      }
      .client {
        display: grid;
        gap: 6px;
        margin: 0 0 24px;
        padding: 16px;
        background: #f9fafb;
        border: 1px solid #eaecf0;
        border-radius: 8px;
      }
      .label {
        color: #667085;
        font-size: 13px;
      }
      .value {
        overflow-wrap: anywhere;
        font-weight: 600;
      }
      fieldset {
        border: 0;
        margin: 0;
        padding: 0;
      }
      legend {
        margin-bottom: 10px;
        font-weight: 700;
      }
      .option {
        display: grid;
        grid-template-columns: 20px 1fr;
        gap: 12px;
        align-items: start;
        padding: 16px;
        border: 1px solid #d0d5dd;
        border-radius: 8px;
        margin-bottom: 12px;
        cursor: pointer;
      }
      .option:has(input:checked) {
        border-color: #1570ef;
        background: #eff8ff;
      }
      input[type="radio"] {
        margin-top: 2px;
      }
      .option-title {
        display: block;
        font-weight: 700;
      }
      .option-description {
        display: block;
        margin-top: 4px;
        color: #475467;
        line-height: 1.45;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 12px;
        margin-top: 24px;
      }
      button {
        min-height: 40px;
        border-radius: 8px;
        padding: 0 16px;
        font: inherit;
        font-weight: 700;
        cursor: pointer;
      }
      .deny {
        color: #344054;
        background: #ffffff;
        border: 1px solid #d0d5dd;
      }
      .approve {
        color: #ffffff;
        background: #1570ef;
        border: 1px solid #1570ef;
      }
      @media (max-width: 520px) {
        main {
          padding: 24px;
        }
        .actions {
          flex-direction: column-reverse;
        }
        button {
          width: 100%;
        }
      }
    </style>
  </head>
  <body>
    <main>
      <h1>Authorize Knowhere</h1>
      <p class="summary">${escapeHtml(loginRequest.clientName)} is requesting access to your Knowhere account.</p>
      <dl class="client">
        <div>
          <dt class="label">Client</dt>
          <dd class="value">${escapeHtml(loginRequest.clientName)}</dd>
        </div>
        <div>
          <dt class="label">Redirect URI</dt>
          <dd class="value">${escapeHtml(loginRequest.redirectUri)}</dd>
        </div>
      </dl>
      <form method="post">
        ${hiddenInputs}
        <fieldset>
          <legend>Permission</legend>
          <label class="option" for="permission-read-only">
            <input id="permission-read-only" type="radio" name="permission" value="read_only" checked>
            <span>
              <span class="option-title">Read only</span>
              <span class="option-description">Search and read existing parsed documents. Parse and delete tools are hidden.</span>
            </span>
          </label>
          <label class="option" for="permission-full-access">
            <input id="permission-full-access" type="radio" name="permission" value="full_access">
            <span>
              <span class="option-title">Full access</span>
              <span class="option-description">Search, read, parse URLs and files, and archive documents.</span>
            </span>
          </label>
        </fieldset>
        <div class="actions">
          <button class="deny" type="submit" name="intent" value="deny">Deny</button>
          <button class="approve" type="submit" name="intent" value="approve">Authorize</button>
        </div>
      </form>
    </main>
  </body>
</html>`,
    {
      headers: {
        "Content-Type": "text/html; charset=utf-8",
      },
    }
  );
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}
