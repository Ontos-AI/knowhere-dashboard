import { NewsletterConfirmClient } from "@app/newsletter/confirm/newsletter-confirm-client";

type NewsletterConfirmPageProps = {
  readonly searchParams: Promise<{
    readonly token?: string | string[];
  }>;
};

export default async function NewsletterConfirmPage({ searchParams }: NewsletterConfirmPageProps) {
  const { token } = await searchParams;
  const normalizedToken = typeof token === "string" ? token : "";

  return <NewsletterConfirmClient token={normalizedToken} />;
}
