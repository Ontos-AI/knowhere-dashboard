import { normalizeNewsletterEmail } from "@lib/blog-email/email";
import type { BlogEmailConfig, BlogEmailSettingsRecord } from "@lib/blog-email/types";

const DISABLED_SETTINGS: BlogEmailConfig = {
  audienceLive: false,
  enabled: false,
  testRecipient: null,
};

export function readBlogEmailSettings(row: BlogEmailSettingsRecord | null): BlogEmailConfig {
  if (!row) {
    return DISABLED_SETTINGS;
  }

  const recipient = row.testRecipient ? normalizeNewsletterEmail(row.testRecipient) : "";

  return {
    audienceLive: row.audience === "live",
    enabled: row.enabled,
    testRecipient: recipient.includes("@") ? recipient : null,
  };
}
