import type { CheckoutSessionResponse } from "@server/external-api/request";
import { jwtRequest, publicRequest } from "@server/external-api/request";

// ============================================
// 类型定义
// ============================================

export type Subscription = {
  id: string;
  plan_type: "free" | "plus" | "pro";
  status: "active" | "canceled" | "past_due";
  start_date: string;
  end_date?: string;
  credits_limit: number;
  stripe_subscription_id?: string;
};

export type SubscriptionPlan = {
  id: string;
  plan_id: string;
  price_id?: string;
  name: string;
  price?: number;
  period?: string;
  credits?: number;
  features: string[];
  popular: boolean;
  stripe_price_id?: string;
  description?: string;
  amount_cents?: number;
  currency?: string;
  metadata?: Record<string, unknown>;
};

export type CreditsPackage = {
  id: string;
  plan_id: string;
  price_id: string;
  name: string;
  description?: string;
  credits_amount: number;
  amount_cents: number;
  currency: string;
  metadata?: Record<string, unknown>;
};

export type PriceConfigsResponse = {
  subscriptions: SubscriptionPlan[];
  credits_packages: CreditsPackage[];
};

// ============================================
// 订阅管理函数
// ============================================

export async function getPriceConfigs({
  productType,
}: {
  productType?: "subscription" | "credits_package";
} = {}): Promise<PriceConfigsResponse> {
  const params = productType ? `?product_type=${productType}` : "";
  return publicRequest({ method: "GET", path: `/v1/billing/price-configs${params}` });
}

export async function getCurrentSubscription({
  userId,
}: {
  userId: string;
}): Promise<Subscription> {
  return jwtRequest({ method: "GET", path: "/v1/billing/subscription", userId });
}

export async function subscribePlan({
  userId,
  planId,
}: {
  userId: string;
  planId: string;
}): Promise<CheckoutSessionResponse> {
  return jwtRequest({
    method: "POST",
    path: "/v1/billing/subscribe",
    userId,
    body: { plan_id: planId },
  });
}

export async function cancelSubscription({ userId }: { userId: string }): Promise<void> {
  return jwtRequest({ method: "POST", path: "/v1/billing/cancel-subscription", userId });
}
