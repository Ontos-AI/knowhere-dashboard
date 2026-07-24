import { trackAnalyticsEvent } from "@/lib/analytics";
import { consumePendingCheckout } from "@/lib/analytics/client-state";
import type { CheckoutType } from "@/lib/analytics/types";

export type PaymentRedirectResult = {
  readonly handled: boolean;
  readonly kind?: "canceled" | "success";
};

type SearchParamsLike = {
  readonly get: (name: string) => string | null;
};

const PAYMENT_REDIRECT_DEDUPE_KEY = "ph_tracked_payment_redirects";
const MAX_TRACKED_PAYMENT_REDIRECTS = 50;

const createTimestamp = (): string => new Date().toISOString();

const isTrackedPaymentRedirectList = (value: unknown): value is readonly string[] => {
  return (
    Array.isArray(value) && value.every((entry: unknown): boolean => typeof entry === "string")
  );
};

const loadTrackedPaymentRedirects = (): Set<string> => {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const raw = localStorage.getItem(PAYMENT_REDIRECT_DEDUPE_KEY);
    if (!raw) {
      return new Set();
    }

    const parsedRedirects: unknown = JSON.parse(raw);
    return new Set(isTrackedPaymentRedirectList(parsedRedirects) ? parsedRedirects : []);
  } catch {
    return new Set();
  }
};

const persistTrackedPaymentRedirects = (trackedRedirects: Set<string>): void => {
  if (typeof window === "undefined") {
    return;
  }

  const entries = Array.from(trackedRedirects).slice(-MAX_TRACKED_PAYMENT_REDIRECTS);
  localStorage.setItem(PAYMENT_REDIRECT_DEDUPE_KEY, JSON.stringify(entries));
};

const markPaymentRedirectTracked = (
  kind: "canceled" | "success",
  transactionId: string
): boolean => {
  if (!transactionId) {
    return true;
  }

  const dedupeId = `${kind}:${transactionId}`;
  const trackedRedirects = loadTrackedPaymentRedirects();
  if (trackedRedirects.has(dedupeId)) {
    return false;
  }

  trackedRedirects.add(dedupeId);
  persistTrackedPaymentRedirects(trackedRedirects);
  return true;
};

const getCheckoutTypeFromParam = (checkoutTypeParam: string | null): CheckoutType | undefined => {
  if (checkoutTypeParam === "credits_package" || checkoutTypeParam === "subscription") {
    return checkoutTypeParam;
  }

  return undefined;
};

const trackSuccessfulPaymentRedirect = (searchParams: SearchParamsLike): PaymentRedirectResult => {
  const pendingCheckout = consumePendingCheckout();
  const checkoutType =
    getCheckoutTypeFromParam(searchParams.get("type")) ?? pendingCheckout?.checkout_type;
  const transactionId = searchParams.get("session_id") || pendingCheckout?.session_id || "";
  const planId = searchParams.get("plan_id") ?? pendingCheckout?.plan_id;
  const rawAmount = searchParams.get("amount");
  const amountParam = rawAmount ? Number.parseFloat(rawAmount) : Number.NaN;
  const amountFallback = typeof pendingCheckout?.amount === "number" ? pendingCheckout.amount : 0;
  const amount = Number.isFinite(amountParam) ? amountParam : amountFallback;

  if (!markPaymentRedirectTracked("success", transactionId)) {
    return { handled: true, kind: "success" };
  }

  if (checkoutType === "credits_package") {
    trackAnalyticsEvent({
      amount,
      name: "billing.credits_purchased",
      planType: checkoutType,
      timestamp: createTimestamp(),
      transactionId,
    });
  } else if (checkoutType === "subscription") {
    trackAnalyticsEvent({
      name: "billing.subscription_purchased",
      planId: planId ?? "unknown",
      timestamp: createTimestamp(),
      transactionId,
    });
  } else if (planId) {
    trackAnalyticsEvent({
      name: "billing.subscription_purchased",
      planId,
      timestamp: createTimestamp(),
      transactionId,
    });
  } else if (amount > 0) {
    trackAnalyticsEvent({
      amount,
      name: "billing.credits_purchased",
      planType: "unknown",
      timestamp: createTimestamp(),
      transactionId,
    });
  } else {
    trackAnalyticsEvent({
      amount,
      name: "billing.checkout_purchase_unknown",
      planId,
      properties: { amount, plan_id: planId },
      timestamp: createTimestamp(),
      transactionId,
    });
  }

  return { handled: true, kind: "success" };
};

const trackCanceledPaymentRedirect = (searchParams: SearchParamsLike): PaymentRedirectResult => {
  const pendingCheckout = consumePendingCheckout();
  const checkoutType =
    getCheckoutTypeFromParam(searchParams.get("type")) ?? pendingCheckout?.checkout_type;
  const transactionId = searchParams.get("session_id") || pendingCheckout?.session_id || "";

  if (!markPaymentRedirectTracked("canceled", transactionId)) {
    return { handled: true, kind: "canceled" };
  }

  trackAnalyticsEvent({
    checkoutType: checkoutType ?? "unknown",
    name: "billing.checkout_canceled",
    timestamp: createTimestamp(),
  });

  return { handled: true, kind: "canceled" };
};

export function trackPaymentRedirectFromSearchParams(
  searchParams: SearchParamsLike
): PaymentRedirectResult {
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  if (!isSuccess && !isCanceled) {
    return { handled: false };
  }

  if (isSuccess) {
    return trackSuccessfulPaymentRedirect(searchParams);
  }

  return trackCanceledPaymentRedirect(searchParams);
}
