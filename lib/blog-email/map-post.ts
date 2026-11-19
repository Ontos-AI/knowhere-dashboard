import { decodeWpText, sanitizeWpHtml } from "@lib/blog-email/html";

const BLOG_SITE_ORIGIN = "https://knowhereto.ai";

type WpRendered = {
  readonly rendered?: unknown;
};

export type WordpressEmailRawPost = {
  readonly id?: unknown;
  readonly slug?: unknown;
  readonly date?: unknown;
  readonly status?: unknown;
  readonly title?: unknown;
  readonly excerpt?: unknown;
  readonly content?: unknown;
  readonly jetpack_featured_media_url?: unknown;
  readonly _embedded?: unknown;
};

type WpMedia = {
  readonly source_url?: unknown;
  readonly alt_text?: unknown;
};

type WpEmbedded = {
  readonly "wp:featuredmedia"?: unknown;
};

export type MappedWordpressEmailPost = {
  readonly id: number;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string | null;
  readonly date: string;
  readonly permalinkUrl: string;
  readonly cover: {
    readonly url: string | null;
    readonly alt: string;
  };
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function renderedString(value: unknown): string {
  const record = asRecord(value) as WpRendered | null;
  return typeof record?.rendered === "string" ? record.rendered : "";
}

function asNumber(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function asString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function permalinkUrl(date: string, slug: string): string {
  const [year = "", month = "", day = ""] = date.slice(0, 10).split("-");
  return `${BLOG_SITE_ORIGIN}/blog/${year}/${month}/${day}/${slug}/`;
}

function mapCover(raw: WordpressEmailRawPost, title: string): MappedWordpressEmailPost["cover"] {
  const embedded = asRecord(raw._embedded) as WpEmbedded | null;
  const mediaItems = Array.isArray(embedded?.["wp:featuredmedia"])
    ? embedded["wp:featuredmedia"]
    : [];
  const media = asRecord(mediaItems[0]) as WpMedia | null;
  const url = asString(raw.jetpack_featured_media_url) ?? asString(media?.source_url);

  return {
    alt: asString(media?.alt_text) ?? title,
    url,
  };
}

export function mapWordpressPost(
  value: unknown,
  options: {
    readonly includeContent?: boolean;
  } = {}
): MappedWordpressEmailPost | null {
  const raw = asRecord(value) as WordpressEmailRawPost | null;
  if (!raw) {
    return null;
  }

  const id = asNumber(raw.id);
  const slug = asString(raw.slug);
  const date = asString(raw.date);
  const title = decodeWpText(renderedString(raw.title));
  if (id === null || !slug || !date || !title) {
    return null;
  }

  if (asString(raw.status) && raw.status !== "publish") {
    return null;
  }

  return {
    content: options.includeContent ? sanitizeWpHtml(renderedString(raw.content)) : null,
    cover: mapCover(raw, title),
    date,
    excerpt: decodeWpText(renderedString(raw.excerpt)),
    id,
    permalinkUrl: permalinkUrl(date, slug),
    title,
  };
}
