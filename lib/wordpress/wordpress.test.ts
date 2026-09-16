import { mapWordpressPost } from "@lib/wordpress/map-post";
import {
  articlePermalinkPath,
  articlePermalinkUrl,
  formatArticleDate,
  permalinkDateMatches,
  shareIntentUrl,
} from "@lib/wordpress/permalink";
import { readingTimeMinutesFromHtml } from "@lib/wordpress/reading-time";
import { decodeWpText, sanitizeWpHtml } from "@lib/wordpress/sanitize";
import { afterEach, describe, expect, it, vi } from "vitest";

const REQUIRED_ENV = {
  BETTER_AUTH_SECRET: "test-auth-secret-with-at-least-32-chars",
  BETTER_AUTH_URL: "https://knowhereto.ai",
  DATABASE_URL: "postgres://user:pass@example.com:5432/dashboard",
  NEXT_PUBLIC_API_URL: "https://api.knowhereto.ai/api",
  NEXT_PUBLIC_AUTH_BASE_URL: "/api/auth",
  NEXT_PUBLIC_APP_URL: "https://knowhereto.ai",
  WORDPRESS_SITE: "knowheretoai.wordpress.com",
} as const;

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
  vi.unstubAllGlobals();
});

describe("wordpress sanitize", () => {
  it("strips scripts and event handlers from article HTML", () => {
    const html = `<p>Hello</p><script>alert(1)</script><img src="x" onerror="alert(2)" /><a href="javascript:alert(3)">x</a>`;
    const sanitized = sanitizeWpHtml(html);

    expect(sanitized).toContain("<p>Hello</p>");
    expect(sanitized).not.toContain("<script");
    expect(sanitized).not.toContain("onerror");
    expect(sanitized).not.toContain("javascript:");
  });

  it("decodes WordPress rendered titles", () => {
    expect(decodeWpText("How to Choose a PDF Parser API for AI&nbsp;Agents")).toBe(
      "How to Choose a PDF Parser API for AI Agents"
    );
  });
});

describe("wordpress permalinks", () => {
  it("builds canonical date paths on knowhereto.ai", () => {
    expect(
      articlePermalinkPath("2026-08-10T13:45:26", "how-to-choose-a-pdf-parser-api-for-ai-agents")
    ).toBe("/blog/2026/08/10/how-to-choose-a-pdf-parser-api-for-ai-agents");
    expect(
      articlePermalinkUrl("2026-08-10T13:45:26", "how-to-choose-a-pdf-parser-api-for-ai-agents")
    ).toBe("https://knowhereto.ai/blog/2026/08/10/how-to-choose-a-pdf-parser-api-for-ai-agents/");
    expect(permalinkDateMatches("2026-08-10T13:45:26", "2026", "08", "10")).toBe(true);
    expect(permalinkDateMatches("2026-08-10T13:45:26", "2026", "08", "11")).toBe(false);
  });

  it("formats dates with Site Language locales", () => {
    expect(formatArticleDate("2026-08-10T13:45:26", "en")).toBe("August 10, 2026");
    expect(formatArticleDate("2026-08-10T13:45:26", "zh")).toBe("2026年8月10日");
  });

  it("builds share intents from the live permalink instead of WordPress share queries", () => {
    const permalink =
      "https://knowhereto.ai/blog/2026/08/10/how-to-choose-a-pdf-parser-api-for-ai-agents/";
    const linkedIn = shareIntentUrl("linkedin", permalink, "Title");

    expect(linkedIn).toContain("linkedin.com");
    expect(linkedIn).toContain(encodeURIComponent(permalink));
    expect(linkedIn).not.toContain("?share=");
    expect(shareIntentUrl("twitter", permalink, "Title")).toContain("twitter.com/intent/tweet");
  });
});

describe("wordpress reading time", () => {
  it("derives minutes from stripped word count", () => {
    const html = `<p>${"word ".repeat(400)}</p><script>ignore me</script>`;
    expect(readingTimeMinutesFromHtml(html)).toBe(2);
  });
});

describe("wordpress map post", () => {
  it("maps public REST fields, cover, and author without a bio when absent", () => {
    const post = mapWordpressPost(
      {
        id: 113,
        slug: "how-to-choose-a-pdf-parser-api-for-ai-agents",
        date: "2026-08-10T13:45:26",
        modified: "2026-08-11T01:00:00",
        status: "publish",
        sticky: true,
        title: { rendered: "How to Choose a PDF Parser API for AI&nbsp;Agents" },
        excerpt: { rendered: "<p>Accuracy and layout.</p>" },
        content: { rendered: "<p>Body</p><script>bad()</script>" },
        categories: [668],
        jetpack_featured_media_url:
          "https://knowheretoai.wordpress.com/wp-content/uploads/2026/08/image-2.png",
        _embedded: {
          author: [
            {
              name: "OntosAI",
              description: "",
              avatar_urls: { "96": "https://secure.gravatar.com/avatar/x" },
            },
          ],
          "wp:featuredmedia": [
            {
              source_url:
                "https://knowheretoai.wordpress.com/wp-content/uploads/2026/08/image-2.png",
              alt_text: "Diagram",
            },
          ],
          "wp:term": [
            [{ id: 668, name: "Research", slug: "research", taxonomy: "category", count: 5 }],
          ],
        },
      },
      { includeContent: true }
    );

    expect(post).toMatchObject({
      title: "How to Choose a PDF Parser API for AI Agents",
      excerpt: "Accuracy and layout.",
      sticky: true,
      author: { name: "OntosAI", bio: null },
      cover: { alt: "Diagram" },
      permalinkPath: "/blog/2026/08/10/how-to-choose-a-pdf-parser-api-for-ai-agents",
    });
    expect(post?.content).toContain("<p>Body</p>");
    expect(post?.content).not.toContain("<script");
    expect(post?.categories[0]?.name).toBe("Research");
  });

  it("rejects unpublished posts even if they appear in a payload", () => {
    expect(
      mapWordpressPost({
        id: 1,
        slug: "draft",
        date: "2026-08-10T00:00:00",
        status: "draft",
        title: { rendered: "Draft" },
      })
    ).toBeNull();
  });
});

describe("wordpress client", () => {
  it("requests published list, featured sticky, and category-filtered posts", async () => {
    for (const [key, value] of Object.entries(REQUIRED_ENV)) {
      vi.stubEnv(key, value);
    }

    const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url.includes("/categories?")) {
        return new Response(
          JSON.stringify([{ id: 668, name: "Research", slug: "research", count: 5 }]),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      if (url.includes("sticky=true")) {
        return new Response(
          JSON.stringify([
            {
              id: 113,
              slug: "how-to-choose-a-pdf-parser-api-for-ai-agents",
              date: "2026-08-10T13:45:26",
              status: "publish",
              sticky: true,
              title: { rendered: "Lead" },
              excerpt: { rendered: "<p>Lead excerpt</p>" },
              categories: [668],
            },
          ]),
          {
            status: 200,
            headers: {
              "Content-Type": "application/json",
              "X-WP-Total": "1",
              "X-WP-TotalPages": "1",
            },
          }
        );
      }

      return new Response(
        JSON.stringify([
          {
            id: 23,
            slug: "knowhere-can-now-plug-into-your-agent",
            date: "2026-07-09T15:19:42",
            status: "publish",
            sticky: false,
            title: { rendered: "Plug" },
            excerpt: { rendered: "<p>Plug excerpt</p>" },
            categories: [668],
          },
        ]),
        {
          status: 200,
          headers: {
            "Content-Type": "application/json",
            "X-WP-Total": "9",
            "X-WP-TotalPages": "2",
          },
        }
      );
    });
    vi.stubGlobal("fetch", fetchMock);

    vi.resetModules();
    const { getWordpressBlogIndex } = await import("@lib/wordpress/client");
    const index = await getWordpressBlogIndex({ page: 2, categorySlug: "research" });

    expect(index.page).toBe(2);
    expect(index.categorySlug).toBe("research");
    expect(index.featured[0]?.slug).toBe("how-to-choose-a-pdf-parser-api-for-ai-agents");
    expect(index.posts[0]?.slug).toBe("knowhere-can-now-plug-into-your-agent");
    expect(index.totalPages).toBe(2);

    const urls = fetchMock.mock.calls.map((call) => String(call[0]));
    expect(
      urls.some((url) => url.includes("status=publish") && url.includes("categories=668"))
    ).toBe(true);
    expect(urls.some((url) => url.includes("sticky=true") && url.includes("status=publish"))).toBe(
      true
    );
    expect(urls.every((url) => url.includes("knowheretoai.wordpress.com"))).toBe(true);
  });

  it("returns null for a published slug whose date path does not match", async () => {
    for (const [key, value] of Object.entries(REQUIRED_ENV)) {
      vi.stubEnv(key, value);
    }

    vi.stubGlobal(
      "fetch",
      vi.fn(async () => {
        return new Response(
          JSON.stringify([
            {
              id: 113,
              slug: "how-to-choose-a-pdf-parser-api-for-ai-agents",
              date: "2026-08-10T13:45:26",
              status: "publish",
              title: { rendered: "Lead" },
              content: { rendered: "<p>Body</p>" },
            },
          ]),
          { status: 200, headers: { "Content-Type": "application/json" } }
        );
      })
    );

    vi.resetModules();
    const { getWordpressPostByPermalink } = await import("@lib/wordpress/client");
    const miss = await getWordpressPostByPermalink({
      year: "2020",
      month: "01",
      day: "01",
      slug: "how-to-choose-a-pdf-parser-api-for-ai-agents",
    });
    const hit = await getWordpressPostByPermalink({
      year: "2026",
      month: "08",
      day: "10",
      slug: "how-to-choose-a-pdf-parser-api-for-ai-agents",
    });

    expect(miss).toBeNull();
    expect(hit?.slug).toBe("how-to-choose-a-pdf-parser-api-for-ai-agents");
  });
});
