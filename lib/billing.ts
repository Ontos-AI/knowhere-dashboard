import { env } from "@lib/env";

const BILLING_ENABLED_VALUES = new Set(["1", "true", "yes", "on"]);

export function isBillingEnabled(): boolean {
  const value = env.BILLING_ENABLED?.trim().toLowerCase() ?? "false";
  return BILLING_ENABLED_VALUES.has(value);
}
