"use client";

import type { NewsletterConfirmationStatus } from "@lib/newsletter";
import { orpcClient } from "@lib/orpc/client";
import { CheckCircle2, MailWarning, XCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type NewsletterConfirmClientProps = {
  readonly token: string;
};

type NewsletterConfirmViewStatus = NewsletterConfirmationStatus | "confirming";

const statusContent = {
  confirmed: {
    icon: CheckCircle2,
    iconClassName: "newsletter-status-icon newsletter-status-icon--ok",
    titleKey: "confirmedTitle",
    descriptionKey: "confirmedDescription",
  },
  expired: {
    icon: MailWarning,
    iconClassName: "newsletter-status-icon newsletter-status-icon--warn",
    titleKey: "expiredTitle",
    descriptionKey: "expiredDescription",
  },
  invalid: {
    icon: XCircle,
    iconClassName: "newsletter-status-icon newsletter-status-icon--error",
    titleKey: "invalidTitle",
    descriptionKey: "invalidDescription",
  },
} as const;

export function NewsletterConfirmClient({ token }: NewsletterConfirmClientProps) {
  const t = useTranslations("Newsletter");
  const hasConfirmed = useRef(false);
  const [status, setStatus] = useState<NewsletterConfirmViewStatus>("confirming");

  useEffect(() => {
    if (hasConfirmed.current) {
      return;
    }

    hasConfirmed.current = true;

    if (!token) {
      setStatus("invalid");
      return;
    }

    void orpcClient.newsletter.confirm({ token }).then(
      (result) => {
        setStatus(result.status);
      },
      (error) => {
        console.error("[Newsletter] Confirmation request failed:", error);
        setStatus("invalid");
      }
    );
  }, [token]);

  if (status === "confirming") {
    return (
      <section className="newsletter-card" aria-busy="true">
        <span className="control-spinner newsletter-status-spinner" aria-hidden="true" />
        <h1>{t("confirmingTitle")}</h1>
        <p>{t("confirmingDescription")}</p>
      </section>
    );
  }

  const content = statusContent[status];
  const Icon = content.icon;

  return (
    <section className="newsletter-card">
      <Icon className={content.iconClassName} aria-hidden="true" />
      <h1>{t(content.titleKey)}</h1>
      <p>{t(content.descriptionKey)}</p>
      <p className="newsletter-aux">
        <Link href="/">{t("backToKnowhere")}</Link>
      </p>
    </section>
  );
}
