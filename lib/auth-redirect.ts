import { env } from "@/lib/env";

const DEFAULT_AUTH_REDIRECT_PATH = "/usage" as const;
const AUTH_PAGE_PATHS = ["/login", "/register", "/forgot-password", "/reset-password"] as const;
const AUTH_CALLBACK_PATH_PREFIX = "/callback" as const;
const PROTECTED_PATH_PREFIXES = [
  "/dashboard",
  "/api-keys",
  "/settings",
  "/usage",
  "/billing",
  "/webhooks",
] as const;

type AuthPagePath = (typeof AUTH_PAGE_PATHS)[number];
type BuildAuthPagePathOptions = {
  readonly callbackURL?: string | null;
  readonly error?: string | null;
};

/**
 * Parse `NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS` into a normalized
 * allowlist of origins.
 *
 * The allowlist is exposed as a `NEXT_PUBLIC_` variable so both server
 * code (Better Auth's `trustedOrigins`) and client code (the login
 * action's `router.push(callbackURL)`) read the exact same list. The
 * values are not secrets — they declare which sibling-app hostnames
 * Dashboard trusts as post-login targets.
 *
 * Each entry is `new URL(value).origin`, so `https://app.example.com/`,
 * `https://app.example.com`, and `https://APP.EXAMPLE.COM` all normalize
 * to the same allowlisted origin. Invalid entries are dropped.
 */
function parseAllowedExternalOrigins(): readonly string[] {
  const raw = env.NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS;
  if (!raw) return [];
  return raw
    .split(",")
    .map((candidate) => candidate.trim())
    .filter(Boolean)
    .map((candidate) => {
      try {
        return new URL(candidate).origin;
      } catch {
        return null;
      }
    })
    .filter((origin): origin is string => origin !== null);
}

/**
 * Cached once per module load. If the env changes the serverless
 * function / browser session is a new process anyway.
 */
const ALLOWED_EXTERNAL_ORIGINS = parseAllowedExternalOrigins();

export function isAllowedExternalOrigin(origin: string): boolean {
  return ALLOWED_EXTERNAL_ORIGINS.includes(origin);
}

/**
 * Returns a safe callback target, or `null` if the candidate should be
 * ignored.
 *
 * Safe callbacks come in two flavors:
 *
 *   1. Internal paths. `/usage`, `/settings`, etc. The legacy behavior.
 *      Preserved for every existing Dashboard-same-origin flow. Strings
 *      like `//evil.com` and `/callback/...` are still rejected.
 *
 *   2. Allowlisted external origins. Full URLs whose `origin` appears in
 *      `NEXT_PUBLIC_AUTH_ALLOWED_CALLBACK_ORIGINS` (typically a sibling
 *      app's public URL). Arbitrary external URLs are still rejected,
 *      so this is not an open redirect.
 *
 * The returned value is the sanitized string the caller should hand to
 * Better Auth / `router.push`: a relative path for flavor 1, a full URL
 * (re-serialized via `URL.toString`) for flavor 2.
 */
function getSafeCallbackURL(callbackURL: string | null | undefined): string | null {
  if (!callbackURL) return null;

  // Flavor 1: relative paths. `//...` is protocol-relative → reject.
  if (callbackURL.startsWith("/") && !callbackURL.startsWith("//")) {
    const url = new URL(callbackURL, "http://localhost");
    const pathname = url.pathname || "/";
    if (isDashboardAuthPath(pathname)) return null;
    return `${pathname}${url.search}`;
  }

  // Flavor 2: allowlisted absolute URLs.
  if (!callbackURL.startsWith("http://") && !callbackURL.startsWith("https://")) {
    return null;
  }
  let parsed: URL;
  try {
    parsed = new URL(callbackURL);
  } catch {
    return null;
  }
  if (!isAllowedExternalOrigin(parsed.origin)) return null;
  // External callbacks are fully trusted for whatever path the sibling
  // app declares — the allowlist already gates which origins can reach
  // this point. Dashboard auth-path rules (rejecting /login,
  // /callback/*, etc.) only apply to Dashboard's own relative-path
  // callbacks (flavor 1 above), not to external origins.
  return parsed.toString();
}

function isDashboardAuthPath(pathname: string): boolean {
  if (AUTH_PAGE_PATHS.some((authPath) => pathname === authPath)) return true;
  return (
    pathname === AUTH_CALLBACK_PATH_PREFIX || pathname.startsWith(`${AUTH_CALLBACK_PATH_PREFIX}/`)
  );
}

function buildAuthPagePath(pathname: AuthPagePath, options?: BuildAuthPagePathOptions): string {
  const params = new URLSearchParams();
  const safeCallbackURL = getSafeCallbackURL(options?.callbackURL);

  if (safeCallbackURL) {
    params.set("callbackURL", safeCallbackURL);
  }

  if (options?.error) {
    params.set("error", options.error);
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

function buildMagicLinkErrorCallbackURL(
  pathname: AuthPagePath,
  options?: BuildAuthPagePathOptions
): string {
  const params = new URLSearchParams();
  const safeCallbackURL = getSafeCallbackURL(options?.callbackURL);

  if (safeCallbackURL) {
    // Better Auth decodes errorCallbackURL once during magic-link verification.
    // Encode the nested callback target ahead of time so it remains a valid query value.
    params.set("callbackURL", encodeURIComponent(safeCallbackURL));
  }

  if (options?.error) {
    params.set("error", options.error);
  }

  const queryString = params.toString();

  return queryString ? `${pathname}?${queryString}` : pathname;
}

function isProtectedPath(pathname: string): boolean {
  return PROTECTED_PATH_PREFIXES.some(
    (protectedPath) => pathname === protectedPath || pathname.startsWith(`${protectedPath}/`)
  );
}

function resolveCallbackURL(callbackURL: string | null | undefined): string {
  return getSafeCallbackURL(callbackURL) ?? DEFAULT_AUTH_REDIRECT_PATH;
}

export const authRedirect = {
  defaultPath: DEFAULT_AUTH_REDIRECT_PATH,
  allowedExternalOrigins: ALLOWED_EXTERNAL_ORIGINS,
  buildAuthPagePath,
  buildMagicLinkErrorCallbackURL,
  isProtectedPath,
  resolveCallbackURL,
  getSafeCallbackURL,
} as const;
