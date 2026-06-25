import crypto from "node:crypto";

const LOOPBACK_HOSTNAMES = new Set(["127.0.0.1", "localhost", "::1"]);
const BASE64URL_PATTERN = /^[A-Za-z0-9_-]+$/;
const STATE_MIN_LENGTH = 24;
const STATE_MAX_LENGTH = 256;
const CODE_CHALLENGE_LENGTH = 43;
const CLIENT_NAME_MAX_LENGTH = 120;
const PERMISSION_VALUES = ["read_only", "full_access"] as const;

export type OAuthLoginRequest = {
  readonly redirectUri: string;
  readonly state: string;
  readonly codeChallenge: string;
  readonly clientName: string;
};

export type Permission = (typeof PERMISSION_VALUES)[number];

export const DEFAULT_PERMISSION: Permission = "read_only";

export class OAuthAuthRequestError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OAuthAuthRequestError";
  }
}

export function validateOAuthLoginSearchParams(searchParams: URLSearchParams): OAuthLoginRequest {
  const redirectUri = validateLoopbackRedirectUri(searchParams.get("redirect_uri"));
  const state = validateBase64UrlParam(searchParams.get("state"), {
    name: "state",
    minLength: STATE_MIN_LENGTH,
    maxLength: STATE_MAX_LENGTH,
  });
  const codeChallenge = validateBase64UrlParam(searchParams.get("code_challenge"), {
    name: "code_challenge",
    minLength: CODE_CHALLENGE_LENGTH,
    maxLength: CODE_CHALLENGE_LENGTH,
  });
  const codeChallengeMethod = searchParams.get("code_challenge_method") ?? "S256";
  if (codeChallengeMethod !== "S256") {
    throw new OAuthAuthRequestError("code_challenge_method must be S256");
  }

  return {
    redirectUri,
    state,
    codeChallenge,
    clientName: normalizeOAuthClientName(searchParams.get("client_name")),
  };
}

export function buildPkceChallenge(codeVerifier: string): string {
  return crypto.createHash("sha256").update(codeVerifier).digest("base64url");
}

export function validatePkceVerifier({
  codeChallenge,
  codeVerifier,
}: {
  readonly codeChallenge: string;
  readonly codeVerifier: string;
}): boolean {
  const actualChallenge = buildPkceChallenge(codeVerifier);
  const actualBuffer = Buffer.from(actualChallenge);
  const expectedBuffer = Buffer.from(codeChallenge);
  return (
    actualBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(actualBuffer, expectedBuffer)
  );
}

export function parsePermission(value: FormDataEntryValue | string | null | undefined): Permission {
  if (typeof value === "string" && PERMISSION_VALUES.includes(value as Permission)) {
    return value as Permission;
  }

  throw new OAuthAuthRequestError("permission is invalid");
}

function validateLoopbackRedirectUri(value: string | null): string {
  if (!value) {
    throw new OAuthAuthRequestError("redirect_uri is required");
  }

  let parsed: URL;
  try {
    parsed = new URL(value);
  } catch {
    throw new OAuthAuthRequestError("redirect_uri must be a valid URL");
  }

  if (parsed.protocol !== "http:") {
    throw new OAuthAuthRequestError("redirect_uri must use http");
  }
  if (!LOOPBACK_HOSTNAMES.has(parsed.hostname)) {
    throw new OAuthAuthRequestError("redirect_uri must use a loopback host");
  }
  if (!parsed.port) {
    throw new OAuthAuthRequestError("redirect_uri must include a port");
  }
  if (parsed.username || parsed.password || parsed.hash) {
    throw new OAuthAuthRequestError("redirect_uri cannot include credentials or a fragment");
  }
  if (parsed.pathname !== "/callback") {
    throw new OAuthAuthRequestError("redirect_uri path must be /callback");
  }

  return parsed.toString();
}

function validateBase64UrlParam(
  value: string | null,
  {
    name,
    minLength,
    maxLength,
  }: {
    readonly name: string;
    readonly minLength: number;
    readonly maxLength: number;
  }
): string {
  if (!value) {
    throw new OAuthAuthRequestError(`${name} is required`);
  }
  if (value.length < minLength || value.length > maxLength || !BASE64URL_PATTERN.test(value)) {
    throw new OAuthAuthRequestError(`${name} is invalid`);
  }
  return value;
}

function normalizeOAuthClientName(value: string | null): string {
  const trimmedValue = value?.trim();
  if (!trimmedValue) {
    return "Knowhere MCP";
  }
  return trimmedValue.slice(0, CLIENT_NAME_MAX_LENGTH);
}
