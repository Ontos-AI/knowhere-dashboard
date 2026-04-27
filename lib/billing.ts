import { env } from "@lib/env";

const BILLING_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

export function isBillingEnabled(): boolean {
  return BILLING_ENABLED_VALUES.has(env.BILLING_ENABLED.trim().toLowerCase());
}
