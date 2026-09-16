import { articlePermalinkPath, articlePermalinkUrl } from "@lib/wordpress/permalink";
import { readingTimeMinutesFromHtml } from "@lib/wordpress/reading-time";
import { decodeWpText, sanitizeWpHtml } from "@lib/wordpress/sanitize";
import type {
  WordpressAuthor,
  WordpressCategory,
  WordpressCover,
  WordpressPost,
} from "@lib/wordpress/types";

type WpRendered = {
  readonly rendered?: unknown;
};

type WpTerm = {
  readonly id?: unknown;
  readonly name?: unknown;
  readonly slug?: unknown;
  readonly taxonomy?: unknown;
  readonly count?: unknown;
};

type WpAuthor = {
  readonly name?: unknown;
  readonly description?: unknown;
  readonly avatar_urls?: unknown;
};

type WpMedia = {
  readonly source_url?: unknown;
  readonly alt_text?: unknown;
};

type WpEmbedded = {
  readonly author?: unknown;
  readonly "wp:featuredmedia"?: unknown;
  readonly "wp:term"?: unknown;
};

export type WordpressRawPost = {
  readonly id?: unknown;
  readonly slug?: unknown;
  readonly date?: unknown;
  readonly modified?: unknown;
  readonly sticky?: unknown;
  readonly status?: unknown;
  readonly title?: unknown;
  readonly excerpt?: unknown;
  readonly content?: unknown;
  readonly categories?: unknown;
  readonly jetpack_featured_media_url?: unknown;
  readonly _embedded?: unknown;
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

function categoryFromUnknown(value: unknown): WordpressCategory | null {
  const term = asRecord(value) as WpTerm | null;
  const id = asNumber(term?.id);
  const name = asString(term?.name);
  const slug = asString(term?.slug);

  if (id === null || !name || !slug) {
    return null;
  }

  return {
    id,
    name,
    slug,
    count: asNumber(term?.count) ?? 0,
  };
}

function embeddedTerms(embedded: WpEmbedded | null): readonly WpTerm[] {
  if (!Array.isArray(embedded?.["wp:term"])) {
    return [];
  }

  return embedded["wp:term"].flatMap((group) => (Array.isArray(group) ? group : []));
}

function mapCategories(
  raw: WordpressRawPost,
  lookup: ReadonlyMap<number, WordpressCategory>
): WordpressCategory[] {
  const ids = Array.isArray(raw.categories)
    ? raw.categories.flatMap((value) => {
        const id = asNumber(value);
        return id === null ? [] : [id];
      })
    : [];
  const embedded = asRecord(raw._embedded) as WpEmbedded | null;
  const embeddedCategories = embeddedTerms(embedded).flatMap((term) => {
    if (term.taxonomy && term.taxonomy !== "category") {
      return [];
    }

    const category = categoryFromUnknown(term);
    return category ? [category] : [];
  });
  const byId = new Map<number, WordpressCategory>(
    embeddedCategories.map((category) => [category.id, category])
  );

  if (ids.length === 0) {
    return embeddedCategories;
  }

  return ids.flatMap((id) => {
    const category = lookup.get(id) ?? byId.get(id);
    return category ? [category] : [];
  });
}

function mapAuthor(raw: WordpressRawPost): WordpressAuthor {
  const embedded = asRecord(raw._embedded) as WpEmbedded | null;
  const authors = Array.isArray(embedded?.author) ? embedded.author : [];
  const author = asRecord(authors[0]) as WpAuthor | null;
  const avatarUrls = asRecord(author?.avatar_urls);
  const avatarUrl =
    asString(avatarUrls?.["96"]) ?? asString(avatarUrls?.["48"]) ?? asString(avatarUrls?.["24"]);
  const bio = asString(author?.description);

  return {
    name: asString(author?.name) ?? "",
    avatarUrl,
    bio,
  };
}

function mapCover(raw: WordpressRawPost, title: string): WordpressCover {
  const embedded = asRecord(raw._embedded) as WpEmbedded | null;
  const mediaItems = Array.isArray(embedded?.["wp:featuredmedia"])
    ? embedded["wp:featuredmedia"]
    : [];
  const media = asRecord(mediaItems[0]) as WpMedia | null;
  const url = asString(raw.jetpack_featured_media_url) ?? asString(media?.source_url);
  const alt = asString(media?.alt_text) ?? title;

  return { url, alt };
}

export function mapWordpressCategory(value: unknown): WordpressCategory | null {
  return categoryFromUnknown(value);
}

export function mapWordpressPost(
  value: unknown,
  options: {
    readonly includeContent?: boolean;
    readonly categories?: ReadonlyMap<number, WordpressCategory>;
  } = {}
): WordpressPost | null {
  const raw = asRecord(value) as WordpressRawPost | null;
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

  const contentHtml = options.includeContent ? sanitizeWpHtml(renderedString(raw.content)) : null;
  const excerpt = decodeWpText(renderedString(raw.excerpt));
  const categories = mapCategories(raw, options.categories ?? new Map());
  const cover = mapCover(raw, title);

  return {
    id,
    slug,
    title,
    excerpt,
    content: contentHtml,
    date,
    modified: asString(raw.modified) ?? date,
    sticky: raw.sticky === true,
    categories,
    cover,
    author: mapAuthor(raw),
    permalinkPath: articlePermalinkPath(date, slug),
    permalinkUrl: articlePermalinkUrl(date, slug),
    readingTimeMinutes: readingTimeMinutesFromHtml(
      contentHtml ?? sanitizeWpHtml(renderedString(raw.content))
    ),
  };
}
