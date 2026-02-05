import { env } from "@lib/env";
import { auth } from "@/lib/auth";

// ============================================
// 共享类型
// ============================================

export type CheckoutSessionResponse = {
  checkout_url: string;
  session_id: string;
};

// ============================================
// 错误类
// ============================================

export class ApiError extends Error {
  code: number;
  status?: number;

  constructor(message: string, code: number, status?: number) {
    super(message);
    this.name = "ApiError";
    this.code = code;
    this.status = status;
  }
}

// ============================================
// 核心请求函数
// ============================================

export async function jwtRequest<T = unknown>({
  method,
  path,
  userId,
  body,
}: {
  method: string;
  path: string;
  userId: string;
  body?: unknown;
}): Promise<T> {
  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;

  // Generate JWT token using Better Auth
  // Call the internal signJWT endpoint
  const { token } = await auth.api.signJWT({
    body: {
      payload: { id: userId },
    },
  });

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.detail || result.msg || `HTTP Error: ${response.status}`,
      result.code || response.status,
      response.status
    );
  }

  return result;
}

export async function publicRequest<T = unknown>({
  method,
  path,
  body,
}: {
  method: string;
  path: string;
  body?: unknown;
}): Promise<T> {
  const url = `${env.NEXT_PUBLIC_API_URL}${path}`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  const result = await response.json();

  if (!response.ok) {
    throw new ApiError(
      result.detail || result.msg || `HTTP错误: ${response.status}`,
      result.code || response.status,
      response.status
    );
  }

  return result;
}
