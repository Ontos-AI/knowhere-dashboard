"use client";

import "@app/(landing)/_components/newsletter-subscribe-prompt.css";
import { NEWSLETTER_DISMISS_DURATION_MS, NEWSLETTER_DISMISS_STORAGE_KEY } from "@lib/newsletter";
import { orpcClient } from "@lib/orpc/client";
import { ArrowRight, Mail, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { type FormEvent, useEffect, useState } from "react";

type SubmissionState = "idle" | "submitting" | "sent" | "error";

function getDismissedUntil(): number {
  if (typeof window === "undefined") {
    return 0;
  }

  let storedValue: string | null = null;

  try {
    storedValue = window.localStorage.getItem(NEWSLETTER_DISMISS_STORAGE_KEY);
  } catch {
    return 0;
  }

  const parsedValue = Number.parseInt(storedValue ?? "", 10);
  return Number.isFinite(parsedValue) ? parsedValue : 0;
}

function setDismissedUntil(timestamp: number): void {
  try {
    window.localStorage.setItem(NEWSLETTER_DISMISS_STORAGE_KEY, String(timestamp));
  } catch {
    return;
  }
}

export function NewsletterSubscribePrompt() {
  const t = useTranslations("Landing.newsletter");
  const [email, setEmail] = useState("");
  const [isVisible, setIsVisible] = useState(false);
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  useEffect(() => {
    if (Date.now() >= getDismissedUntil()) {
      setIsVisible(true);
    }
  }, []);

  const dismissPrompt = (): void => {
    setDismissedUntil(Date.now() + NEWSLETTER_DISMISS_DURATION_MS);
    setIsVisible(false);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (submissionState === "submitting") {
      return;
    }

    setSubmissionState("submitting");

    try {
      await orpcClient.newsletter.subscribe({ email });
      setSubmissionState("sent");
      setDismissedUntil(Date.now() + NEWSLETTER_DISMISS_DURATION_MS);
    } catch (error) {
      console.error("[Newsletter] Subscription request failed:", error);
      setSubmissionState("error");
    }
  };

  if (!isVisible) {
    return null;
  }

  const isSubmitting = submissionState === "submitting";
  const isSent = submissionState === "sent";

  return (
    <aside aria-live="polite" className="newsletter-prompt">
      <div className="newsletter-prompt-body">
        <span className="newsletter-prompt-icon" aria-hidden="true">
          <Mail />
        </span>
        <div className="newsletter-prompt-copy">
          <div className="newsletter-prompt-head">
            <div>
              <p className="newsletter-prompt-eyebrow">{t("eyebrow")}</p>
              <h2 className="newsletter-prompt-title">{isSent ? t("sentTitle") : t("title")}</h2>
            </div>
            <button
              type="button"
              aria-label={t("close")}
              className="newsletter-prompt-close"
              onClick={dismissPrompt}
            >
              <X aria-hidden="true" />
            </button>
          </div>

          <p className="newsletter-prompt-description">
            {isSent ? t("sentDescription") : t("description")}
          </p>

          {isSent ? null : (
            <form className="newsletter-prompt-form" onSubmit={handleSubmit}>
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("placeholder")}
                autoComplete="email"
                disabled={isSubmitting}
                className="newsletter-prompt-input"
                aria-label={t("placeholder")}
              />
              <button type="submit" disabled={isSubmitting} className="newsletter-prompt-submit">
                {isSubmitting ? t("submitting") : t("submit")}
                <ArrowRight aria-hidden="true" />
              </button>
            </form>
          )}

          {submissionState === "error" ? (
            <p className="newsletter-prompt-error">{t("error")}</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
