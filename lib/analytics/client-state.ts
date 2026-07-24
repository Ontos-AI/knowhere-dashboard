import type { PendingCheckout } from "@/lib/analytics/types";
import { authRedirect } from "@/lib/auth-redirect";

const AUTH_EVENT_TRACKED_KEY = "ph_auth_event_tracked";
const PENDING_AUTH_LOGIN_KEY = "ph_pending_auth_login";
const PENDING_MAGIC_LINK_AUTH_KEY = "ph_pending_magic_link_auth";
const ANALYTICS_AUTH_CALLBACK_URL_KEY = "ph_auth_callback_url";
const ANALYTICS_AUTH_FLAG_KEY = "ph_auth";
const PENDING_CHECKOUT_KEY = "ph_pending_checkout";
const BUY_CREDITS_ENTRY_TS_KEY = "ph_buy_credits_entry_ts";
const PENDING_OAUTH_TTL_MS = 30 * 60 * 1000;
const PENDING_MAGIC_LINK_TTL_MS = 30 * 60 * 1000;

export const BUY_CREDITS_DEDUPE_MS = 5000;
export const NEW_USER_WINDOW_MS = 5 * 60 * 1000;

type SearchParamsLike = {
  readonly get: (name: string) => string | null;
  readonly toString: () => string;
};

function isCheckoutType(value: unknown): value is PendingCheckout["checkout_type"] {
  return value === "credits_package" || value === "subscription";
}

function isOptionalNumber(value: unknown): value is number | undefined {
  return value === undefined || (typeof value === "number" && Number.isFinite(value));
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isPendingCheckout(value: unknown): value is PendingCheckout {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }

  const record = value as Record<string, unknown>;
  return (
    isCheckoutType(record.checkout_type) &&
    typeof record.session_id === "string" &&
    isOptionalNumber(record.amount) &&
    isOptionalString(record.plan_id) &&
    isOptionalString(record.price_id)
  );
}

export function markAuthEventTracked(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(AUTH_EVENT_TRACKED_KEY, "1");
}

export function isAuthEventTracked(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  return sessionStorage.getItem(AUTH_EVENT_TRACKED_KEY) === "1";
}

export function markPendingAuthLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.setItem(PENDING_AUTH_LOGIN_KEY, String(Date.now()));
}

export function hasPendingAuthLogin(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = sessionStorage.getItem(PENDING_AUTH_LOGIN_KEY);
  if (!raw) {
    return false;
  }

  const storedAt = Number(raw);
  if (Number.isNaN(storedAt) || Date.now() - storedAt > PENDING_OAUTH_TTL_MS) {
    sessionStorage.removeItem(PENDING_AUTH_LOGIN_KEY);
    return false;
  }

  return true;
}

export function clearPendingAuthLogin(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(PENDING_AUTH_LOGIN_KEY);
}

export function markPendingMagicLinkAuth(): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PENDING_MAGIC_LINK_AUTH_KEY, String(Date.now()));
}

export function consumePendingMagicLinkAuth(): boolean {
  if (typeof window === "undefined") {
    return false;
  }

  const raw = localStorage.getItem(PENDING_MAGIC_LINK_AUTH_KEY);
  if (!raw) {
    return false;
  }

  localStorage.removeItem(PENDING_MAGIC_LINK_AUTH_KEY);
  const storedAt = Number(raw);
  if (Number.isNaN(storedAt) || Date.now() - storedAt > PENDING_MAGIC_LINK_TTL_MS) {
    return false;
  }

  return true;
}

export function buildAnalyticsAuthCallbackURL(callbackURL: string, flag?: string): string {
  if (typeof window === "undefined") {
    return callbackURL;
  }

  const parsed = new URL(authRedirect.defaultPath, window.location.origin);
  parsed.searchParams.set(ANALYTICS_AUTH_CALLBACK_URL_KEY, callbackURL);

  if (flag) {
    parsed.searchParams.set(ANALYTICS_AUTH_FLAG_KEY, flag);
  }

  return `${parsed.pathname}${parsed.search}`;
}

export function getAnalyticsAuthCallbackURL(
  searchParams: Pick<SearchParamsLike, "get">
): string | null {
  const callbackURL = searchParams.get(ANALYTICS_AUTH_CALLBACK_URL_KEY);
  return authRedirect.getSafeCallbackURL(callbackURL);
}

export function buildAnalyticsAuthCleanupPath(
  pathname: string,
  searchParams: SearchParamsLike
): string {
  const params = new URLSearchParams(searchParams.toString());
  params.delete(ANALYTICS_AUTH_FLAG_KEY);
  params.delete(ANALYTICS_AUTH_CALLBACK_URL_KEY);

  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
}

export function storePendingCheckout(data: PendingCheckout): void {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(PENDING_CHECKOUT_KEY, JSON.stringify(data));
}

export function peekPendingCheckout(): PendingCheckout | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(PENDING_CHECKOUT_KEY);
  if (!raw) {
    return null;
  }

  try {
    const parsedCheckout: unknown = JSON.parse(raw);
    return isPendingCheckout(parsedCheckout) ? parsedCheckout : null;
  } catch {
    return null;
  }
}

export function consumePendingCheckout(): PendingCheckout | null {
  const data = peekPendingCheckout();
  if (typeof window !== "undefined") {
    localStorage.removeItem(PENDING_CHECKOUT_KEY);
  }

  return data;
}

export function isLikelyNewUser(createdAt?: Date | string): boolean {
  if (!createdAt) {
    return false;
  }

  const created = new Date(createdAt).getTime();
  if (Number.isNaN(created)) {
    return false;
  }

  return Date.now() - created < NEW_USER_WINDOW_MS;
}

export function clearAnalyticsAuthAndCheckoutState(): void {
  if (typeof window === "undefined") {
    return;
  }

  sessionStorage.removeItem(AUTH_EVENT_TRACKED_KEY);
  sessionStorage.removeItem(PENDING_AUTH_LOGIN_KEY);
  sessionStorage.removeItem(BUY_CREDITS_ENTRY_TS_KEY);
  localStorage.removeItem(PENDING_MAGIC_LINK_AUTH_KEY);
  localStorage.removeItem(PENDING_CHECKOUT_KEY);

  for (const key of Object.keys(localStorage)) {
    if (key.startsWith("ph_welcome_api_key_tracked_")) {
      localStorage.removeItem(key);
    }
  }
}

export function shouldTrackBuyCreditsClick(source: string): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  if (source === "deep_link") {
    const lastEntry = sessionStorage.getItem(BUY_CREDITS_ENTRY_TS_KEY);
    if (lastEntry && Date.now() - Number(lastEntry) < BUY_CREDITS_DEDUPE_MS) {
      return false;
    }

    return true;
  }

  sessionStorage.setItem(BUY_CREDITS_ENTRY_TS_KEY, String(Date.now()));
  return true;
}
