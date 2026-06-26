"use client";

import { Button } from "@components/ui/button";
import { Input } from "@components/ui/input";
import { orpcClient } from "@lib/orpc/client";
import { CheckCircle2, MailMinus } from "lucide-react";
import Link from "next/link";
import { type FormEvent, useState } from "react";

type SubmissionState = "idle" | "submitting" | "success" | "error";

export default function NewsletterUnsubscribePage() {
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
    <main className="landing-tone flex min-h-screen items-center justify-center bg-background px-5 text-foreground">
      <section className="w-full max-w-[520px] rounded-lg border border-zinc-200 bg-white p-8 shadow-[0_20px_80px_-60px_rgba(9,9,11,0.45)] dark:border-[#3f3f46] dark:bg-[#18181b]">
        <div className="flex size-12 items-center justify-center rounded-lg border border-[#ddd6ff] bg-[#ede9fe] text-[#7f22fe] dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#c4b5fd]">
          {isSuccess ? (
            <CheckCircle2 className="size-6" aria-hidden="true" />
          ) : (
            <MailMinus className="size-6" aria-hidden="true" />
          )}
        </div>

        <h1 className="mt-5 text-2xl font-bold leading-8 text-zinc-950 dark:text-[#fafafa]">
          {isSuccess ? "Newsletter unsubscribed" : "Unsubscribe from Knowhere newsletter"}
        </h1>
        <p className="mt-3 text-base leading-6 text-zinc-600 dark:text-[#a1a1aa]">
          {isSuccess
            ? "If this email was subscribed, it will no longer receive Knowhere newsletter emails."
            : "Enter your email address and we will remove it from future Knowhere newsletter emails."}
        </p>

        {isSuccess ? null : (
          <form className="mt-7 space-y-3" onSubmit={handleSubmit}>
            <Input
              type="email"
              required
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              disabled={isSubmitting}
              className="h-12 rounded-lg border-zinc-300 bg-white text-base text-zinc-950 placeholder:text-zinc-500 hover:border-zinc-400 focus-visible:border-[#8e51ff] dark:border-[#52525b] dark:bg-[#09090b] dark:text-[#fafafa] dark:placeholder:text-[#71717a] dark:hover:border-[#71717a]"
            />
            <Button
              type="submit"
              disabled={isSubmitting}
              className="h-12 w-full rounded-lg border-[#7008e7] border-b-4 bg-[#8e51ff] px-4 pb-1 font-[family-name:var(--font-mono-display)] text-sm font-semibold text-[#f5f3ff] transition-[background-color,border-color,border-width,transform] hover:border-[#7008e7] hover:border-b-[6px] hover:bg-[#7f22fe] active:translate-y-0.5 active:border-b-4 active:bg-[#7008e7] disabled:border-[#d6d3d1] disabled:bg-[#d6d3d1] disabled:text-[#a8a29e]"
            >
              {isSubmitting ? "Unsubscribing..." : "Unsubscribe"}
            </Button>
          </form>
        )}

        {submissionState === "error" ? (
          <p className="mt-3 text-sm leading-5 text-red-600 dark:text-red-400">
            We could not unsubscribe this email. Please try again.
          </p>
        ) : null}

        <Button asChild className="mt-7" variant="secondary">
          <Link href="/">Back to Knowhere</Link>
        </Button>
      </section>
    </main>
  );
}
