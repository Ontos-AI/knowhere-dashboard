import { suppressBlogEmail } from "@lib/blog-email/suppression";
import { unsubscribeWithSignedToken } from "@lib/blog-email/token";
import { env } from "@lib/env";

export async function completeSignedBlogUnsubscribe(
  token: string
): Promise<"invalid" | "unsubscribed"> {
  return unsubscribeWithSignedToken(token, env.BETTER_AUTH_SECRET, (email) =>
    suppressBlogEmail(email)
  );
}
