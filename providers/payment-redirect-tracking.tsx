"use client";

import { usePaymentRedirectTracking } from "@hooks/use-payment-redirect-tracking";

export function PaymentRedirectTracking() {
  usePaymentRedirectTracking();
  return null;
}
