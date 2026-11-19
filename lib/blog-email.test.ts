import {
  createBlogUnsubscribeUrl,
  readBlogUnsubscribeToken,
  signBlogUnsubscribeToken,
  unsubscribeWithSignedToken,
} from "@lib/blog-email/token";
import { describe, expect, it } from "vitest";

const SECRET = "test-auth-secret-with-at-least-32-chars";

describe("blog email unsubscribe token", () => {
  it("signs an unsubscribe token that does not require a session", async () => {
    const token = signBlogUnsubscribeToken(" User@Example.com ", SECRET);
    expect(readBlogUnsubscribeToken(token, SECRET)).toBe("user@example.com");
    expect(readBlogUnsubscribeToken(`${token}x`, SECRET)).toBeNull();
    const seen: string[] = [];
    await expect(
      unsubscribeWithSignedToken(token, SECRET, async (email) => {
        seen.push(email);
      })
    ).resolves.toBe("unsubscribed");
    await expect(
      unsubscribeWithSignedToken("not-a-token", SECRET, async () => {
        throw new Error("should not unsubscribe");
      })
    ).resolves.toBe("invalid");
    expect(seen).toEqual(["user@example.com"]);
    expect(createBlogUnsubscribeUrl("https://knowhereto.ai", token)).toContain(token);
  });
});
