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
 * Parse `AUTH_ALLOWED_CALLBACK_ORIGINS` into a normalized allowlist of
 * origins.
 *
 * Each entry is `new URL(value).origin`, so `https://notebook.knowhereto.ai/`,
 * `https://notebook.knowhereto.ai`, and `https://NOTEBOOK.KNOWHERETO.AI` all
 * normalize to the same allowlisted origin. Invalid entries are dropped.
 */
function parseAllowedExternalOrigins(): readonly string[] {
  const raw = env.AUTH_ALLOWED_CALLBACK_ORIGINS;
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
 * Cached once per module load. If the env changes (e.g. a new Vercel
 * deploy) the serverless function is a new process anyway.
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
 *      `AUTH_ALLOWED_CALLBACK_ORIGINS` (typically the Notebook public URL).
 *      Arbitrary external URLs are still rejected, so this is not an
 *      open redirect.
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
    const isAuthPage = AUTH_PAGE_PATHS.some((authPath) => pathname === authPath);
    const isAuthCallbackPath =
      pathname === AUTH_CALLBACK_PATH_PREFIX ||
      pathname.startsWith(`${AUTH_CALLBACK_PATH_PREFIX}/`);
    if (isAuthPage || isAuthCallbackPath) return null;
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
  // Do not allow the external callback to aim back at a Dashboard auth
  // page (defense-in-depth; in practice the origin check already rejects
  // Dashboard itself unless someone misconfigures the env).
  const pathname = parsed.pathname || "/";
  const isAuthPage = AUTH_PAGE_PATHS.some((authPath) => pathname === authPath);
  const isAuthCallbackPath =
    pathname === AUTH_CALLBACK_PATH_PREFIX || pathname.startsWith(`${AUTH_CALLBACK_PATH_PREFIX}/`);
  if (isAuthPage || isAuthCallbackPath) return null;
  return parsed.toString();
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
