import { jwtRequest } from "@server/external-api/request";

// ============================================
// 类型定义
// ============================================

export type UsageStats = {
  [key: string]: unknown;
};

export type ParseUsageResponse = {
  request_total: number;
  mom_growth: number;
  credits_used: number;
  estimated_amount: number;
  success_rate: number;
  avg_processing_time: number;
};

export type Transaction = {
  [key: string]: unknown;
};

// ============================================
// 使用统计函数
// ============================================

export async function getUsageStats({
  userId,
  period = "month",
}: {
  userId: string;
  period?: string;
}): Promise<UsageStats> {
  return jwtRequest({ method: "GET", path: `/v1/billing/usage?period=${period}`, userId });
}

export async function getParseUsage({ userId }: { userId: string }): Promise<ParseUsageResponse> {
  return jwtRequest({ method: "GET", path: "/v1/billing/parse-usage", userId });
}

export async function getTransactionHistory({
  userId,
  limit = 50,
  offset = 0,
}: {
  userId: string;
  limit?: number;
  offset?: number;
}): Promise<{ transactions: Transaction[]; total: number }> {
  return jwtRequest({
    method: "GET",
    path: `/v1/user/credits/transactions?limit=${limit}&offset=${offset}`,
    userId,
  });
}
