import { BlogEmailUnsubscribeClient } from "@app/blog-email/unsubscribe/blog-email-unsubscribe-client";
import { NewsletterShell } from "@app/newsletter/_components/newsletter-shell";

type BlogEmailUnsubscribePageProps = {
  readonly searchParams: Promise<{
    readonly token?: string | string[];
  }>;
};

export default async function BlogEmailUnsubscribePage({
  searchParams,
}: BlogEmailUnsubscribePageProps) {
  const { token } = await searchParams;
  const normalizedToken = typeof token === "string" ? token : "";

  return (
    <NewsletterShell>
      <BlogEmailUnsubscribeClient token={normalizedToken} />
    </NewsletterShell>
  );
}
