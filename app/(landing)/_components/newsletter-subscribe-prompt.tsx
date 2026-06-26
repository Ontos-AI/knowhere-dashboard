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
        "fixed z-50 overflow-hidden rounded-lg border border-[#3f3f46] bg-[#18181b] text-[#fafafa] shadow-[0_24px_70px_-36px_rgba(0,0,0,0.85)]",
        "left-3 right-3 top-3 p-4",
        "min-[768px]:left-auto min-[768px]:right-6 min-[768px]:top-auto min-[768px]:bottom-6 min-[768px]:w-[448px] min-[768px]:p-5"
      )}
    >
      <div className="absolute inset-x-0 top-0 h-1 bg-[#8e51ff]" />
      <div className="absolute inset-0 opacity-10 [background-image:linear-gradient(rgba(142,81,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(142,81,255,0.18)_1px,transparent_1px)] [background-size:18px_18px]" />
      <div className="relative flex gap-3">
        <div className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-md border border-[#7f22fe]/55 bg-[#8e51ff]/15 text-[#c4b5fd]">
          <Mail className="size-4" aria-hidden="true" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-mono-display)] text-[12px] uppercase leading-4 tracking-[0.08em] text-[#c4b5fd]">
                {t("eyebrow")}
              </p>
              <h2 className="mt-1 text-base font-semibold leading-6 text-[#fafafa]">
                {isSent ? t("sentTitle") : t("title")}
              </h2>
            </div>
            <button
              type="button"
              aria-label={t("close")}
              className="flex size-7 shrink-0 items-center justify-center rounded-md border border-[#3f3f46] text-[#a1a1aa] transition-colors hover:border-[#52525b] hover:bg-[#27272a] hover:text-[#fafafa]"
              onClick={dismissPrompt}
            >
              <X className="size-4" aria-hidden="true" />
            </button>
          </div>

          <p className="mt-2 text-sm leading-5 text-[#d4d4d8]">
            {isSent ? t("sentDescription") : t("description")}
          </p>

          {isSent ? null : (
            <form
              className="mt-4 grid grid-cols-1 gap-2 min-[768px]:grid-cols-[minmax(0,1fr)_132px]"
              onSubmit={handleSubmit}
            >
              <Input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("placeholder")}
                autoComplete="email"
                disabled={isSubmitting}
                className="h-11 min-w-0 rounded-md border-[#52525b] bg-[#09090b] px-3 text-sm text-[#fafafa] placeholder:text-[#71717a] hover:border-[#71717a] focus-visible:border-[#8e51ff] disabled:border-[#27272a] disabled:bg-[#18181b] disabled:text-[#a1a1aa]"
              />
              <Button
                type="submit"
                disabled={isSubmitting}
                className="h-11 w-full shrink-0 rounded-md border-[#7008e7] border-b-4 bg-[#8e51ff] px-3 pb-1 font-[family-name:var(--font-mono-display)] text-sm font-semibold text-[#f5f3ff] transition-[background-color,border-color,border-width,transform] hover:border-[#7008e7] hover:border-b-[6px] hover:bg-[#7f22fe] active:translate-y-0.5 active:border-b-4 active:bg-[#7008e7] disabled:border-[#3f3f46] disabled:bg-[#52525b] disabled:text-[#a1a1aa]"
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
