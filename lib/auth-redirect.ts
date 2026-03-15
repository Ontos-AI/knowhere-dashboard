const DEFAULT_AUTH_REDIRECT_PATH = "/usage" as const;
const AUTH_PAGE_PATHS = ["/login", "/register"] as const;
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

function getSafeCallbackURL(callbackURL: string | null | undefined): string | null {
  if (!callbackURL?.startsWith("/") || callbackURL.startsWith("//")) {
    return null;
  }

  const url = new URL(callbackURL, "http://localhost");
  const pathname = url.pathname || "/";
  const isAuthPage = AUTH_PAGE_PATHS.some((authPath) => pathname === authPath);
  const isAuthCallbackPath =
    pathname === AUTH_CALLBACK_PATH_PREFIX || pathname.startsWith(`${AUTH_CALLBACK_PATH_PREFIX}/`);

  if (isAuthPage || isAuthCallbackPath) {
    return null;
  }

  return `${pathname}${url.search}`;
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
  buildAuthPagePath,
  buildMagicLinkErrorCallbackURL,
  isProtectedPath,
  resolveCallbackURL,
} as const;
