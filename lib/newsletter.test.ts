import {
  createNewsletterConfirmationUrl,
  NEWSLETTER_RESEND_COOLDOWN_MS,
  normalizeNewsletterEmail,
  shouldThrottleNewsletterConfirmationEmail,
} from "@lib/newsletter";
import { describe, expect, it } from "vitest";

describe("newsletter helpers", () => {
  it("normalizes email addresses before persistence", () => {
    expect(normalizeNewsletterEmail("  User@Example.COM  ")).toBe("user@example.com");
  });

  it("creates auth-free confirmation links under the dashboard origin", () => {
    expect(createNewsletterConfirmationUrl("https://knowhereto.ai", "abc123")).toBe(
      "https://knowhereto.ai/newsletter/confirm?token=abc123"
    );
  });

  it("throttles repeated confirmation email sends inside the cooldown window", () => {
    const now = new Date("2026-06-26T01:00:00.000Z");
    const recentSend = new Date(now.getTime() - NEWSLETTER_RESEND_COOLDOWN_MS + 1);
    const oldSend = new Date(now.getTime() - NEWSLETTER_RESEND_COOLDOWN_MS - 1);

    expect(shouldThrottleNewsletterConfirmationEmail(recentSend, now)).toBe(true);
    expect(shouldThrottleNewsletterConfirmationEmail(oldSend, now)).toBe(false);
    expect(shouldThrottleNewsletterConfirmationEmail(null, now)).toBe(false);
  });
});
