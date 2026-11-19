import { newsletterDb } from "@lib/db/newsletter";
import { blogEmailSuppression } from "@lib/db/newsletter-schema";
import { normalizeNewsletterEmail } from "@lib/newsletter";
import { eq } from "drizzle-orm";

export async function suppressBlogEmail(emailInput: string): Promise<void> {
  const email = normalizeNewsletterEmail(emailInput);
  if (!email.includes("@")) {
    return;
  }

  await newsletterDb
    .insert(blogEmailSuppression)
    .values({
      createdAt: new Date(),
      email,
    })
    .onConflictDoNothing();
}

export async function clearBlogEmailSuppression(emailInput: string): Promise<void> {
  const email = normalizeNewsletterEmail(emailInput);
  if (!email.includes("@")) {
    return;
  }

  await newsletterDb.delete(blogEmailSuppression).where(eq(blogEmailSuppression.email, email));
}
