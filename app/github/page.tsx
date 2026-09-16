"use client";

import { KnowhereBrand } from "@components/brand/knowhere-brand";
import Link from "next/link";
import { useEffect } from "react";

const GITHUB_REPO_URL = "https://github.com/Ontos-AI/knowhere";
const REDIRECT_DELAY_MS = 400;

export default function GithubRedirectPage() {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      window.location.replace(GITHUB_REPO_URL);
    }, REDIRECT_DELAY_MS);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-5 bg-[#f0f2e6] px-6 text-center font-sans text-[#083b3a] dark:bg-[#083b3a] dark:text-[#f0f2e6]">
      <KnowhereBrand className="w-[160px]" priority tone="auto" />
      <h1 className="text-2xl font-medium tracking-[-0.02em]">Taking you to GitHub…</h1>
      <p className="max-w-md text-sm leading-relaxed text-[#156462] dark:text-[#bbbcb3]">
        Knowhere is fully open source. Explore the code, contribute, or build on top of it.
      </p>
      <Link
        href={GITHUB_REPO_URL}
        className="text-sm font-medium text-[#19a88b] underline underline-offset-4 hover:text-[#12846c]"
        rel="noopener noreferrer"
      >
        Continue to github.com/Ontos-AI/knowhere
      </Link>
    </main>
  );
}
