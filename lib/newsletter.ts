export const NEWSLETTER_DISMISS_STORAGE_KEY = "knowhere.newsletter.dismissedUntil";
export const NEWSLETTER_DISMISS_DURATION_MS = 7 * 24 * 60 * 60 * 1000;
export const NEWSLETTER_CONFIRMATION_TOKEN_TTL_MS = 7 * 24 * 60 * 60 * 1000;
export const NEWSLETTER_RESEND_COOLDOWN_MS = 5 * 60 * 1000;

export type NewsletterConfirmationStatus = "confirmed" | "expired" | "invalid";

export function normalizeNewsletterEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function createNewsletterConfirmationUrl(appUrl: string, token: string): string {
  const url = new URL("/newsletter/confirm", appUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export function shouldThrottleNewsletterConfirmationEmail(
  confirmationSentAt: Date | null,
  now: Date
): boolean {
  if (!confirmationSentAt) {
    return false;
  }

  return now.getTime() - confirmationSentAt.getTime() < NEWSLETTER_RESEND_COOLDOWN_MS;
}
