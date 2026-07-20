import { env } from "@/lib/env";

const DEFAULT_AUTH_COOKIE_PREFIX = "better-auth" as const;
const SECURE_COOKIE_PREFIX = "__Secure-" as const;
const SESSION_TOKEN_COOKIE_NAME = "session_token" as const;

type CookieLookup = {
  readonly has: (name: string) => boolean;
};

function getCookiePrefix(prefix: string = env.AUTH_COOKIE_PREFIX): string {
  return prefix;
}

function getSessionCookieNames(prefix: string = getCookiePrefix()): readonly string[] {
  return [
    `${prefix}.${SESSION_TOKEN_COOKIE_NAME}`,
    `${SECURE_COOKIE_PREFIX}${prefix}.${SESSION_TOKEN_COOKIE_NAME}`,
  ];
}

function hasSessionCookie(cookies: CookieLookup, prefix: string = getCookiePrefix()): boolean {
  return getSessionCookieNames(prefix).some((cookieName) => cookies.has(cookieName));
}

function getCookieCacheVersion(): string {
  return `${env.NEXT_PUBLIC_APP_URL}:${getCookiePrefix()}`;
}

export const authCookies = {
  defaultCookiePrefix: DEFAULT_AUTH_COOKIE_PREFIX,
  getCookiePrefix,
  getSessionCookieNames,
  hasSessionCookie,
  getCookieCacheVersion,
} as const;
