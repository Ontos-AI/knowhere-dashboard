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
  trackCheckoutCanceled(checkoutType);

  return { handled: true, kind: "canceled" };
};
