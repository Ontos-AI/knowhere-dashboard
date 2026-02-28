import { jwtRequest } from "@server/external-api/request";

// ============================================
// Type definitions
// ============================================

export type WebhookSecret = {
  id: string;
  endpoint: string | null;
  secret_masked: string;
  status: "active" | "revoked";
  created_at: string;
};

export type WebhookSecretFull = WebhookSecret & {
  secret: string; // Only returned on creation
};

export type SecretListResponse = {
  secrets: WebhookSecret[];
  total: number;
};

export type SecretCreateRequest = {
  endpoint?: string | null;
};

// ============================================
// Webhook Secrets Management Functions
// ============================================

export async function listWebhookSecrets({
  userId,
}: {
  userId: string;
}): Promise<SecretListResponse> {
  return jwtRequest({ method: "GET", path: "/v1/webhooks/secrets", userId });
}

export async function createWebhookSecret({
  userId,
  data,
}: {
  userId: string;
  data: SecretCreateRequest;
}): Promise<WebhookSecretFull> {
  return jwtRequest({ method: "POST", path: "/v1/webhooks/secrets", userId, body: data });
}

export async function revokeWebhookSecret({
  userId,
  id,
}: {
  userId: string;
  id: string;
}): Promise<void> {
  return jwtRequest({ method: "DELETE", path: `/v1/webhooks/secrets/${id}`, userId });
}
