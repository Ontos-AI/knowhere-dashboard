"use client";

import { BlogFetchError } from "@app/blog/_components/blog-fetch-error";

export default function BlogError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="kb kb-standard">
      <main className="kb-classic kb-hybrid" id="blog-main">
        <BlogFetchError onRetry={reset} />
      </main>
    </div>
  );
}
