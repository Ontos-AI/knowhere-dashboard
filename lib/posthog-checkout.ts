import {
  type CheckoutType,
  consumePendingCheckout,
  trackCheckoutCanceled,
  trackCheckoutPurchaseUnknown,
  trackCreditsPurchased,
  trackSubscriptionPurchased,
} from "@lib/posthog";

export type PaymentRedirectResult = {
  handled: boolean;
  kind?: "success" | "canceled";
};

type SearchParamsLike = {
  get(name: string): string | null;
};

const PAYMENT_REDIRECT_DEDUPE_KEY = "ph_tracked_payment_redirects";
const MAX_TRACKED_PAYMENT_REDIRECTS = 50;

const loadTrackedPaymentRedirects = (): Set<string> => {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const raw = localStorage.getItem(PAYMENT_REDIRECT_DEDUPE_KEY);
    if (!raw) {
      return new Set();
    }

    const parsed = JSON.parse(raw) as string[];
    return new Set(Array.isArray(parsed) ? parsed : []);
  } catch {
    return new Set();
  }
};

const persistTrackedPaymentRedirects = (trackedRedirects: Set<string>) => {
  if (typeof window === "undefined") {
    return;
  }

  const entries = Array.from(trackedRedirects).slice(-MAX_TRACKED_PAYMENT_REDIRECTS);
  localStorage.setItem(PAYMENT_REDIRECT_DEDUPE_KEY, JSON.stringify(entries));
};

const markPaymentRedirectTracked = (kind: "success" | "canceled", transactionId: string) => {
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

export const trackPaymentRedirectFromSearchParams = (
  searchParams: SearchParamsLike
): PaymentRedirectResult => {
  const isSuccess = searchParams.get("success") === "true";
  const isCanceled = searchParams.get("canceled") === "true";

  if (!isSuccess && !isCanceled) {
    return { handled: false };
  }

  const checkoutTypeParam = searchParams.get("type");
  const sessionId = searchParams.get("session_id") ?? "";

  if (isSuccess) {
    const pendingCheckout = consumePendingCheckout();
    const checkoutType =
      checkoutTypeParam === "credits_package" || checkoutTypeParam === "subscription"
        ? checkoutTypeParam
        : pendingCheckout?.checkout_type;
    const transactionId = sessionId || pendingCheckout?.session_id || "";
    const planId = searchParams.get("plan_id") ?? pendingCheckout?.plan_id;
    const rawAmount = searchParams.get("amount");
    const amountParam = rawAmount ? Number.parseFloat(rawAmount) : Number.NaN;
    const amountFallback = typeof pendingCheckout?.amount === "number" ? pendingCheckout.amount : 0;
    const amount = Number.isFinite(amountParam) ? amountParam : amountFallback;

    if (!markPaymentRedirectTracked("success", transactionId)) {
      return { handled: true, kind: "success" };
    }

    if (checkoutType === "credits_package") {
      trackCreditsPurchased(amount, checkoutType, transactionId);
    } else if (checkoutType === "subscription") {
      trackSubscriptionPurchased(planId ?? "unknown", transactionId);
    } else if (planId) {
      trackSubscriptionPurchased(planId, transactionId);
    } else if (amount > 0) {
      trackCreditsPurchased(amount, "unknown", transactionId);
    } else {
      trackCheckoutPurchaseUnknown(transactionId, { amount, plan_id: planId });
    }

    return { handled: true, kind: "success" };
  }

  const pendingCheckout = consumePendingCheckout();
  const checkoutType: CheckoutType | undefined =
    checkoutTypeParam === "subscription" || checkoutTypeParam === "credits_package"
      ? checkoutTypeParam
      : pendingCheckout?.checkout_type;
  const transactionId = sessionId || pendingCheckout?.session_id || "";
  if (!markPaymentRedirectTracked("canceled", transactionId)) {
    return { handled: true, kind: "canceled" };
  }

  trackCheckoutCanceled(checkoutType);

  return { handled: true, kind: "canceled" };
};
