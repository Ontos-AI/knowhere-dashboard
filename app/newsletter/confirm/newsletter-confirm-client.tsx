"use client";

import { Button } from "@components/ui/button";
import type { NewsletterConfirmationStatus } from "@lib/newsletter";
import { orpcClient } from "@lib/orpc/client";
import { CheckCircle2, Loader2, MailWarning, XCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

type NewsletterConfirmClientProps = {
  readonly token: string;
};

type NewsletterConfirmViewStatus = NewsletterConfirmationStatus | "confirming";

const statusContent = {
  confirmed: {
    icon: CheckCircle2,
    title: "Newsletter subscription confirmed",
    description: "Thanks for subscribing. You will receive Knowhere product updates at this email.",
    toneClassName: "text-emerald-500",
  },
  expired: {
    icon: MailWarning,
    title: "Confirmation link expired",
    description: "Please subscribe again from the Knowhere landing page to receive a new link.",
    toneClassName: "text-amber-500",
  },
  invalid: {
    icon: XCircle,
    title: "Confirmation link is invalid",
    description:
      "This link is no longer valid. Please subscribe again from the Knowhere landing page.",
    toneClassName: "text-red-500",
  },
} as const;

export function NewsletterConfirmClient({ token }: NewsletterConfirmClientProps) {
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

  if (status !== "confirming") {
    const content = statusContent[status];
    const Icon = content.icon;

    return (
      <main className="landing-tone flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
        <section className="w-full max-w-[520px] rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-[0_20px_80px_-60px_rgba(9,9,11,0.45)] dark:border-[#3f3f46] dark:bg-[#18181b]">
          <Icon className={`mx-auto size-14 ${content.toneClassName}`} />
          <h1 className="mt-5 text-2xl font-bold leading-8 text-zinc-950 dark:text-[#fafafa]">
            {content.title}
          </h1>
          <p className="mt-3 text-base leading-6 text-zinc-600 dark:text-[#a1a1aa]">
            {content.description}
          </p>
          <Button asChild className="mt-7">
            <Link href="/">Back to Knowhere</Link>
          </Button>
        </section>
      </main>
    );
  }

  return (
    <main className="landing-tone flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <section className="w-full max-w-[520px] rounded-lg border border-zinc-200 bg-white p-8 text-center shadow-[0_20px_80px_-60px_rgba(9,9,11,0.45)] dark:border-[#3f3f46] dark:bg-[#18181b]">
        <Loader2
          className="mx-auto size-12 animate-spin text-[#8e51ff] dark:text-[#c4b5fd]"
          aria-hidden="true"
        />
        <h1 className="mt-5 text-2xl font-bold leading-8 text-zinc-950 dark:text-[#fafafa]">
          Confirming newsletter subscription
        </h1>
        <p className="mt-3 text-base leading-6 text-zinc-600 dark:text-[#a1a1aa]">
          Please keep this page open while we confirm your email address.
        </p>
      </section>
    </main>
  );
}
