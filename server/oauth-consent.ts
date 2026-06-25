import { auth } from "@lib/auth";
import { authRedirect } from "@lib/auth-redirect";
import {
  DEFAULT_PERMISSION,
  OAuthAuthRequestError,
  type OAuthLoginRequest,
  type Permission,
  parsePermission,
  validateOAuthLoginSearchParams,
} from "@lib/oauth-request";
import { createOAuthAuthorizationCode } from "@server/oauth-auth";
import { NextResponse } from "next/server";

/**
 * Branding and routing for an OAuth consent surface. The authorization-code +
 * PKCE machinery is shared across clients (MCP, CLI); only the self path used
 * for the sign-in round-trip and the page copy differ.
 */
export interface ConsentSurface {
  /** Path of this consent route, used to bounce back after dashboard sign-in. */
  readonly loginPath: string;
  /** Page heading, e.g. "Authorize Knowhere CLI". */
  readonly title: string;
  /** Sentence describing the access request; the client name is appended. */
  readonly summary: string;
}

/** Handle the GET (render consent) half of an OAuth consent route. */
export async function handleConsentGet(
  request: Request,
  surface: ConsentSurface
): Promise<Response> {
  const requestUrl = new URL(request.url);
  const loginRequest = validateLoginRequest(requestUrl.searchParams);
  if (loginRequest instanceof Response) {
    return loginRequest;
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return redirectToDashboardLogin(requestUrl.searchParams, surface);
  }

  return renderConsentPage(loginRequest, surface);
}

/** Handle the POST (approve/deny) half of an OAuth consent route. */
export async function handleConsentPost(
  request: Request,
  surface: ConsentSurface
): Promise<Response> {
  const formData = await request.formData();
  const searchParams = buildLoginSearchParams(formData);
  const loginRequest = validateLoginRequest(searchParams);
  if (loginRequest instanceof Response) {
    return loginRequest;
  }

  const session = await auth.api.getSession({ headers: request.headers });
  if (!session?.user) {
    return redirectToDashboardLogin(searchParams, surface);
  }

  const intent = formData.get("intent");
  if (intent === "deny") {
    return redirectWithDeniedAuthorization(loginRequest);
  }
  if (intent !== "approve") {
    return NextResponse.json({ message: "Invalid login action" }, { status: 400 });
  }

  const permission = validatePermission(formData.get("permission") ?? DEFAULT_PERMISSION);
  if (permission instanceof Response) {
    return permission;
  }

  const code = await createOAuthAuthorizationCode({
    userId: session.user.id,
    request: loginRequest,
    permission,
  });
  return redirectWithAuthorizationCode(loginRequest, code);
}

function redirectToDashboardLogin(
  searchParams: URLSearchParams,
  surface: ConsentSurface
): Response {
  const callbackURL = `${surface.loginPath}?${searchParams.toString()}`;
  const loginPath = authRedirect.buildAuthPagePath("/login", { callbackURL });
  // Emit a relative Location so the browser resolves it against the public URL
  // it is actually on. Using the server-derived request origin breaks behind a
  // reverse proxy, where it can resolve to an internal host (e.g. localhost).
  return new Response(null, {
    status: 307,
    headers: { Location: loginPath },
  });
}

function redirectWithAuthorizationCode(loginRequest: OAuthLoginRequest, code: string): Response {
  const redirectUrl = new URL(loginRequest.redirectUri);
  redirectUrl.searchParams.set("code", code);
  redirectUrl.searchParams.set("state", loginRequest.state);
  return NextResponse.redirect(redirectUrl);
}

function redirectWithDeniedAuthorization(loginRequest: OAuthLoginRequest): Response {
  const redirectUrl = new URL(loginRequest.redirectUri);
  redirectUrl.searchParams.set("error", "access_denied");
  redirectUrl.searchParams.set("state", loginRequest.state);
  return NextResponse.redirect(redirectUrl);
}

function validateLoginRequest(searchParams: URLSearchParams): OAuthLoginRequest | Response {
  try {
    return validateOAuthLoginSearchParams(searchParams);
  } catch (error: unknown) {
    if (error instanceof OAuthAuthRequestError) {
      return NextResponse.json({ message: error.message }, { status: 400 });
    }
    throw error;
  }
}

function validatePermission(value: FormDataEntryValue | string | null): Permission | Response {
  try {
    return parsePermission(value);
  } catch (error: unknown) {
    if (error instanceof OAuthAuthRequestError) {
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

function renderConsentPage(loginRequest: OAuthLoginRequest, surface: ConsentSurface): Response {
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
    <title>${escapeHtml(surface.title)}</title>
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
        grid-template-columns: max-content minmax(0, 1fr);
        column-gap: 16px;
        row-gap: 10px;
        align-items: baseline;
        margin: 0 0 24px;
        padding: 16px;
        background: #f9fafb;
        border: 1px solid #eaecf0;
        border-radius: 8px;
      }
      .client dt,
      .client dd {
        margin: 0;
        min-width: 0;
        line-height: 1.5;
      }
      .label {
        color: #667085;
        font-size: 13px;
        white-space: nowrap;
      }
      .value {
        font-weight: 600;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
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
      <h1>${escapeHtml(surface.title)}</h1>
      <p class="summary">${escapeHtml(loginRequest.clientName)} ${escapeHtml(surface.summary)}</p>
      <dl class="client">
        <dt class="label">Client</dt>
        <dd class="value" title="${escapeHtml(loginRequest.clientName)}">${escapeHtml(loginRequest.clientName)}</dd>
        <dt class="label">Redirect URI</dt>
        <dd class="value" title="${escapeHtml(loginRequest.redirectUri)}">${escapeHtml(loginRequest.redirectUri)}</dd>
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
