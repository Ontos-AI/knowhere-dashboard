import { mapWordpressPost } from "@lib/blog-email/map-post";
import type { BlogEmailPost, BlogEmailPostSummary } from "@lib/blog-email/types";
import { WordpressFetchError } from "@lib/blog-email/wordpress-error";

const WP_API_ORIGIN = "https://public-api.wordpress.com/wp/v2/sites";
const PER_PAGE = 100;
const MAX_PAGES = 500;

type WordpressFetch = typeof fetch;

function postsCollectionUrl(site: string, search: URLSearchParams): string {
  return `${WP_API_ORIGIN}/${site}/posts?${search.toString()}`;
}

function asJsonArray(value: unknown): unknown[] {
  if (!Array.isArray(value)) {
    throw new WordpressFetchError("WordPress posts response was not a list", 502);
  }

  return value;
}

function requireTotalPages(response: Response): number {
  const value = Number.parseInt(response.headers.get("X-WP-TotalPages") ?? "", 10);
  if (!Number.isFinite(value) || value < 0) {
    throw new WordpressFetchError("WordPress did not return X-WP-TotalPages", 502);
  }

  return value;
}

async function wordpressGet(fetchImpl: WordpressFetch, url: string): Promise<Response> {
  let response: Response;
  try {
    response = await fetchImpl(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof WordpressFetchError) {
      throw error;
    }

    throw new WordpressFetchError("WordPress request failed", 504);
  }

  if (!response.ok) {
    throw new WordpressFetchError(`WordPress request failed (${response.status})`, response.status);
  }

  return response;
}

function publishedAtFromIso(date: string): Date {
  const publishedAt = new Date(date);
  if (Number.isNaN(publishedAt.getTime())) {
    throw new WordpressFetchError("WordPress post is missing a publish date", 502);
  }

  return publishedAt;
}

function mapSummary(value: unknown): BlogEmailPostSummary {
  const post = mapWordpressPost(value, { includeContent: false });
  if (!post) {
    throw new WordpressFetchError("WordPress returned a post that could not be mapped", 502);
  }

  return {
    permalinkUrl: post.permalinkUrl,
    publishedAt: publishedAtFromIso(post.date),
    title: post.title,
    wordpressPostId: String(post.id),
  };
}

function mapFullPost(value: unknown): BlogEmailPost {
  const post = mapWordpressPost(value, { includeContent: true });
  if (!post) {
    throw new WordpressFetchError("WordPress post could not be mapped", 502);
  }

  return {
    contentHtml: post.content ?? "",
    coverAlt: post.cover.alt,
    coverUrl: post.cover.url,
    excerpt: post.excerpt,
    permalinkUrl: post.permalinkUrl,
    publishedAt: publishedAtFromIso(post.date),
    title: post.title,
    wordpressPostId: String(post.id),
  };
}

export function wordpressOriginFromSite(site: string): string {
  const host = site.replace(/^https?:\/\//, "").replace(/\/.*$/, "");
  return `https://${host}`;
}

export async function listPublishedWordpressPostSummaries(options: {
  readonly fetchImpl?: WordpressFetch;
  readonly site: string;
}): Promise<BlogEmailPostSummary[]> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const posts: BlogEmailPostSummary[] = [];
  let page = 1;
  let totalPages = 1;

  while (page <= totalPages) {
    const search = new URLSearchParams({
      _fields: "id,date,slug,status,title,excerpt",
      order: "desc",
      orderby: "date",
      page: String(page),
      per_page: String(PER_PAGE),
      status: "publish",
    });
    const response = await wordpressGet(fetchImpl, postsCollectionUrl(options.site, search));
    if (page === 1) {
      totalPages = requireTotalPages(response);
      if (totalPages === 0) {
        return [];
      }
      if (totalPages > MAX_PAGES) {
        throw new WordpressFetchError("WordPress published post count is too large to poll", 502);
      }
    }

    const payload: unknown = await response.json();
    posts.push(...asJsonArray(payload).map((item) => mapSummary(item)));
    page += 1;
  }

  return posts;
}

export async function getLatestPublishedWordpressPost(options: {
  readonly fetchImpl?: WordpressFetch;
  readonly site: string;
}): Promise<BlogEmailPost | null> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const search = new URLSearchParams({
    _embed: "1",
    order: "desc",
    orderby: "date",
    page: "1",
    per_page: "1",
    status: "publish",
  });
  const response = await wordpressGet(fetchImpl, postsCollectionUrl(options.site, search));
  const payload: unknown = await response.json();
  const raw = asJsonArray(payload)[0];
  if (!raw) {
    return null;
  }

  return mapFullPost(raw);
}

export async function getPublishedWordpressPost(options: {
  readonly fetchImpl?: WordpressFetch;
  readonly site: string;
  readonly wordpressPostId: string;
}): Promise<BlogEmailPost | null> {
  const fetchImpl = options.fetchImpl ?? fetch;
  const search = new URLSearchParams({
    _embed: "1",
    status: "publish",
  });
  const url = `${WP_API_ORIGIN}/${options.site}/posts/${encodeURIComponent(options.wordpressPostId)}?${search.toString()}`;

  let response: Response;
  try {
    response = await fetchImpl(url, {
      cache: "no-store",
      headers: { Accept: "application/json" },
      signal: AbortSignal.timeout(10_000),
    });
  } catch (error) {
    if (error instanceof WordpressFetchError) {
      throw error;
    }

    throw new WordpressFetchError("WordPress request failed", 504);
  }

  if (response.status === 404) {
    return null;
  }
  if (!response.ok) {
    throw new WordpressFetchError(`WordPress request failed (${response.status})`, response.status);
  }

  const payload: unknown = await response.json();
  return mapFullPost(payload);
}
