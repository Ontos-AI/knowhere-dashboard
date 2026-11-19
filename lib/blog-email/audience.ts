import { normalizeNewsletterEmail } from "@lib/blog-email/email";
import type { BlogEmailSubscriptionRow, BlogEmailUserRow } from "@lib/blog-email/types";

export function emailsForLiveAudience(input: {
  readonly alreadySentEmails: readonly string[];
  readonly subscriptions: readonly BlogEmailSubscriptionRow[];
  readonly suppressedEmails: readonly string[];
  readonly users: readonly BlogEmailUserRow[];
}): string[] {
  const suppressed = new Set(
    input.suppressedEmails.map((email) => normalizeNewsletterEmail(email))
  );
  const alreadySent = new Set(
    input.alreadySentEmails.map((email) => normalizeNewsletterEmail(email))
  );
  const recipients = new Set<string>();

  const addRecipient = (email: string): void => {
    const normalized = normalizeNewsletterEmail(email);
    if (!normalized.includes("@")) {
      return;
    }
    if (suppressed.has(normalized) || alreadySent.has(normalized)) {
      return;
    }
    recipients.add(normalized);
  };

  for (const subscription of input.subscriptions) {
    if (subscription.status === "confirmed") {
      addRecipient(subscription.email);
    }
  }

  for (const user of input.users) {
    if (user.emailVerified) {
      addRecipient(user.email);
    }
  }

  return Array.from(recipients).sort((left, right) => left.localeCompare(right));
}
