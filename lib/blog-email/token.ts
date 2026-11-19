import crypto from "node:crypto";
import { normalizeNewsletterEmail } from "@lib/newsletter";

export function signBlogUnsubscribeToken(email: string, secret: string): string {
  const payload = Buffer.from(normalizeNewsletterEmail(email), "utf8").toString("base64url");
  const signature = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

export function readBlogUnsubscribeToken(token: string, secret: string): string | null {
  const parts = token.split(".");
  if (parts.length !== 2) {
    return null;
  }

  const [payload, signature] = parts;
  if (!payload || !signature) {
    return null;
  }

  const expected = crypto.createHmac("sha256", secret).update(payload).digest("base64url");
  const providedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  if (providedBuffer.length !== expectedBuffer.length) {
    return null;
  }
  if (!crypto.timingSafeEqual(providedBuffer, expectedBuffer)) {
    return null;
  }

  const email = normalizeNewsletterEmail(Buffer.from(payload, "base64url").toString("utf8"));
  if (!email.includes("@") || /\s/.test(email)) {
    return null;
  }

  return email;
}

export function createBlogUnsubscribeUrl(appUrl: string, token: string): string {
  const url = new URL("/blog-email/unsubscribe", appUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export function createBlogUnsubscribeOneClickUrl(appUrl: string, token: string): string {
  const url = new URL("/api/blog-email/unsubscribe", appUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

export async function unsubscribeWithSignedToken(
  token: string,
  secret: string,
  unsubscribe: (email: string) => Promise<unknown>
): Promise<"invalid" | "unsubscribed"> {
  const email = readBlogUnsubscribeToken(token, secret);
  if (!email) {
    return "invalid";
  }

  await unsubscribe(email);
  return "unsubscribed";
}
