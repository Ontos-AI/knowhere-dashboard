import { NewsletterShell } from "@app/newsletter/_components/newsletter-shell";
import type { ReactNode } from "react";

export default function NewsletterLayout({ children }: { children: ReactNode }) {
  return <NewsletterShell>{children}</NewsletterShell>;
}
