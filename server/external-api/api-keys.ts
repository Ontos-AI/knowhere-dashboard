import { jwtRequest } from "@server/external-api/request";

// ============================================
// 类型定义
// ============================================

export type APIKey = {
  id: string;
  name: string;
  key_prefix: string;
  api_key?: string; // 只在创建时返回
  enabled_modules: string[];
  expires_at?: string;
  last_used_at?: string;
  created_at: string;
  is_active: boolean;
};

export type CreateAPIKeyRequest = {
  name: string;
  enabled_modules?: string[];
  expires_at?: string;
};

export type ListAPIKeysResponse = {
  api_keys: APIKey[];
  total: number;
};

// ============================================
// API Keys 管理函数
// ============================================

export async function listApiKeys({ userId }: { userId: string }): Promise<ListAPIKeysResponse> {
  return jwtRequest({ method: "GET", path: "/v1/auth/list", userId });
}

export async function createApiKey({
  userId,
  data,
}: {
  userId: string;
  data: CreateAPIKeyRequest;
}): Promise<APIKey> {
  return jwtRequest<APIKey>({
    method: "POST",
    path: "/v1/auth/create",
    userId,
    body: data,
  });
}

export async function deleteApiKey({ userId, id }: { userId: string; id: string }): Promise<void> {
  return jwtRequest({
    method: "POST",
    path: "/v1/auth/revoke",
    userId,
    body: { api_key_id: id },
  });
}

export async function revokeApiKey({ userId, id }: { userId: string; id: string }): Promise<void> {
  return deleteApiKey({ userId, id });
}

export async function updateApiKey({
  userId,
  id,
  data,
}: {
  userId: string;
  id: string;
  data: { is_active?: boolean; name?: string };
}): Promise<APIKey> {
  return jwtRequest<APIKey>({
    method: "POST",
    path: "/v1/auth/update",
    userId,
    body: { api_key_id: id, ...data },
  });
}

export async function toggleApiKey({
  userId,
  id,
}: {
  userId: string;
  id: string;
}): Promise<APIKey> {
  return jwtRequest<APIKey>({
    method: "PUT",
    path: `/v1/auth/${id}/toggle`,
    userId,
  });
}
