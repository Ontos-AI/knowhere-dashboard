"use client";

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
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">Taking you to GitHub…</h1>
      <p className="max-w-md text-sm text-muted-foreground">
        Knowhere is fully open source. Explore the code, contribute, or build on top of it.
      </p>
      <Link
        href={GITHUB_REPO_URL}
        className="text-sm font-medium underline underline-offset-4"
        rel="noopener noreferrer"
      >
        Continue to github.com/Ontos-AI/knowhere
      </Link>
    </main>
  );
}
