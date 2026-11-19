"use client";

import { orpcClient } from "@lib/orpc/client";
import { CheckCircle2, XCircle } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";

type BlogEmailUnsubscribeClientProps = {
  readonly token: string;
};

type BlogEmailUnsubscribeViewStatus = "unsubscribing" | "unsubscribed" | "invalid";

export function BlogEmailUnsubscribeClient({ token }: BlogEmailUnsubscribeClientProps) {
  const t = useTranslations("Newsletter");
  const hasRequested = useRef(false);
  const [status, setStatus] = useState<BlogEmailUnsubscribeViewStatus>("unsubscribing");

  useEffect(() => {
    if (hasRequested.current) {
      return;
    }

    hasRequested.current = true;

    if (!token) {
      setStatus("invalid");
      return;
    }

    void orpcClient.blogEmail.unsubscribe({ token }).then(
      (result) => {
        setStatus(result.status === "unsubscribed" ? "unsubscribed" : "invalid");
      },
      (error: unknown) => {
        console.error("[BlogEmail] Unsubscribe request failed:", error);
        setStatus("invalid");
      }
    );
  }, [token]);

  if (status === "unsubscribing") {
    return (
      <section className="newsletter-card" aria-busy="true">
        <span className="control-spinner newsletter-status-spinner" aria-hidden="true" />
        <h1>{t("blogUnsubscribingTitle")}</h1>
        <p>{t("blogUnsubscribingDescription")}</p>
      </section>
    );
  }

  const Icon = status === "unsubscribed" ? CheckCircle2 : XCircle;
  const title =
    status === "unsubscribed" ? t("blogUnsubscribedTitle") : t("blogUnsubscribeInvalidTitle");
  const description =
    status === "unsubscribed"
      ? t("blogUnsubscribedDescription")
      : t("blogUnsubscribeInvalidDescription");

  return (
    <section className="newsletter-card">
      <Icon
        className={
          status === "unsubscribed"
            ? "newsletter-status-icon newsletter-status-icon--ok"
            : "newsletter-status-icon newsletter-status-icon--error"
        }
        aria-hidden="true"
      />
      <h1>{title}</h1>
      <p>{description}</p>
      <p className="newsletter-aux">
        <Link href="/">{t("backToKnowhere")}</Link>
      </p>
    </section>
  );
}
