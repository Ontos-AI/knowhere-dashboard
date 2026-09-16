"use client";

import { orpcClient } from "@lib/orpc/client";
import { CheckCircle2, MailMinus } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export default function NewsletterUnsubscribePage() {
  const t = useTranslations("Newsletter");
  const [email, setEmail] = useState("");
  const [submissionState, setSubmissionState] = useState<SubmissionState>("idle");

  const isSubmitting = submissionState === "submitting";
  const isSuccess = submissionState === "success";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>): Promise<void> => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setSubmissionState("submitting");

    try {
      await orpcClient.newsletter.unsubscribe({ email });
      setSubmissionState("success");
    } catch (error) {
      console.error("[Newsletter] Unsubscribe request failed:", error);
      setSubmissionState("error");
    }
  };

  return (
    <section className="newsletter-card">
      {isSuccess ? (
        <CheckCircle2
          className="newsletter-status-icon newsletter-status-icon--ok"
          aria-hidden="true"
        />
      ) : (
        <MailMinus
          className="newsletter-status-icon newsletter-status-icon--ok"
          aria-hidden="true"
        />
      )}

      <h1>{isSuccess ? t("unsubscribedTitle") : t("unsubscribeTitle")}</h1>
      <p>{isSuccess ? t("unsubscribedDescription") : t("unsubscribeDescription")}</p>

      {isSuccess ? null : (
        <form className="newsletter-form" onSubmit={handleSubmit}>
          <div className="newsletter-field">
            <label htmlFor="newsletter-unsubscribe-email">{t("email")}</label>
            <input
              id="newsletter-unsubscribe-email"
              className="control-input"
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              disabled={isSubmitting}
              aria-invalid={submissionState === "error" ? "true" : "false"}
            />
          </div>
          <button
            className="control-button"
            type="submit"
            disabled={isSubmitting}
            aria-busy={isSubmitting}
          >
            {isSubmitting ? <span className="control-spinner" aria-hidden="true" /> : null}
            <span className="control-button-content">
              {isSubmitting ? t("unsubscribing") : t("unsubscribeSubmit")}
            </span>
          </button>
        </form>
      )}

      {submissionState === "error" ? (
        <p className="newsletter-feedback" role="alert">
          {t("unsubscribeError")}
        </p>
      ) : null}

      <p className="newsletter-aux">
        <Link href="/">{t("backToKnowhere")}</Link>
      </p>
    </section>
  );
}
