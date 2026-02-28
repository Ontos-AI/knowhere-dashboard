import type { CheckoutSessionResponse } from "@server/external-api/request";
import { jwtRequest } from "@server/external-api/request";

// ============================================
// 类型定义
// ============================================

export type CreditsBalance = {
  credits_balance: number;
};

export type CreditPackage = {
  id: string;
  amount: number;
  expires_at: string;
  status: "active" | "expired";
  purchase_date: string;
};

// ============================================
// Credits 管理函数
// ============================================

export async function getCreditsBalance({ userId }: { userId: string }): Promise<CreditsBalance> {
  return jwtRequest({ method: "GET", path: "/v1/billing/credits", userId });
}

export async function buyCredits({
  userId,
  amount,
}: {
  userId: string;
  amount: number;
}): Promise<CheckoutSessionResponse> {
  return jwtRequest({
    method: "POST",
    path: "/v1/billing/buy-credits",
    userId,
    body: { credits_amount: amount },
  });
}

export async function getCreditPackages({ userId }: { userId: string }): Promise<CreditPackage[]> {
  return jwtRequest({ method: "GET", path: "/v1/billing/credit-packages", userId });
}

export async function buyCreditsPackage({
  userId,
  priceId,
  quantity,
}: {
  userId: string;
  priceId: string;
  quantity: number;
}): Promise<CheckoutSessionResponse> {
  return jwtRequest({
    method: "POST",
    path: "/v1/billing/buy-credits-package",
    userId,
    body: { price_id: priceId, quantity },
  });
}
