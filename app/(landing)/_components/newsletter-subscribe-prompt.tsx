"use client";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { NEWSLETTER_DISMISS_DURATION_MS, NEWSLETTER_DISMISS_STORAGE_KEY } from "@lib/newsletter";
import { orpcClient } from "@lib/orpc/client";
import { cn } from "@lib/utils";
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
    <aside
      aria-live="polite"
      className={cn(
        "fixed z-50 border border-[#3f3f46] bg-[#09090b] text-[#fafafa] shadow-[0_18px_70px_-38px_rgba(0,0,0,0.85)]",
        "left-3 right-3 top-3 p-4",
        "min-[768px]:left-auto min-[768px]:right-6 min-[768px]:top-auto min-[768px]:bottom-6 min-[768px]:w-[360px] min-[768px]:p-5"
      )}
    >
      <div className="absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(10,221,248,0.18)_1px,transparent_1px),linear-gradient(90deg,rgba(10,221,248,0.14)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative flex gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center border border-[#0addf8]/45 bg-[#0addf8]/10 text-[#0addf8]">
          <Mail className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-mono-display)] text-[12px] uppercase leading-4 tracking-[0.08em] text-[#0addf8]">
                {t("eyebrow")}
              </p>
              <h2 className="mt-1 text-base font-semibold leading-6 text-[#fafafa]">
                {isSent ? t("sentTitle") : t("title")}
              </h2>
            </div>
            <button
              type="button"
              aria-label={t("close")}
              className="flex size-7 shrink-0 items-center justify-center border border-[#3f3f46] text-[#a1a1aa] transition-colors hover:border-[#52525b] hover:text-[#fafafa]"
              onClick={dismissPrompt}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-2 text-sm leading-5 text-[#d4d4d8]">
            {isSent ? t("sentDescription") : t("description")}
          </p>

          {isSent ? null : (
            <form className="mt-4 flex gap-2 max-[767px]:flex-col" onSubmit={handleSubmit}>
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("placeholder")}
                autoComplete="email"
                disabled={isSubmitting}
                className="h-10 border-[#3f3f46] bg-[#18181b] text-[#fafafa] placeholder:text-[#71717a] hover:border-[#52525b] focus-visible:border-[#0addf8] disabled:border-[#27272a] disabled:bg-[#18181b] disabled:text-[#a1a1aa]"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-10 shrink-0 rounded-none border-[#0bbad1] border-b-2 bg-[#0addf8] px-4 pb-0 font-[family-name:var(--font-mono-readable)] text-sm font-semibold text-[#09090b] hover:border-[#08a8bd] hover:bg-[#47e7fb] active:border-[#087f91] active:bg-[#08b7d0]"
              >
                {isSubmitting ? t("submitting") : t("submit")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Button>
            </form>
          )}

          {submissionState === "error" ? (
            <p className="mt-2 text-sm leading-5 text-[#fda4af]">{t("error")}</p>
          ) : null}
        </div>
      </div>
    </aside>
  );
}
