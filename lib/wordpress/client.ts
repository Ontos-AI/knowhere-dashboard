import { env } from "@lib/env";
import { mapWordpressCategory, mapWordpressPost } from "@lib/wordpress/map-post";
import { permalinkDateMatches } from "@lib/wordpress/permalink";
import {
  BLOG_FEATURED_CARD_COUNT,
  BLOG_PAGE_SIZE,
  BLOG_RELATED_COUNT,
  type WordpressBlogIndex,
  type WordpressCategory,
  WordpressFetchError,
  type WordpressPost,
  type WordpressPostList,
  WP_REVALIDATE_SECONDS,
} from "@lib/wordpress/types";

const WP_API_ORIGIN = "https://public-api.wordpress.com/wp/v2/sites";

type FetchInit = RequestInit & {
  readonly next?: { readonly revalidate: number };
};

function wordpressSite(): string {
  return env.WORDPRESS_SITE;
}

function wpUrl(path: string, search: URLSearchParams): string {
  return `${WP_API_ORIGIN}/${wordpressSite()}/${path}?${search.toString()}`;
}

async function wpGet(path: string, search: URLSearchParams): Promise<Response> {
  const init: FetchInit = {
    headers: { Accept: "application/json" },
    next: { revalidate: WP_REVALIDATE_SECONDS },
  };
  const response = await fetch(wpUrl(path, search), init);

  if (!response.ok) {
    throw new WordpressFetchError(
      `WordPress request failed for ${path} (${response.status})`,
      response.status
    );
  }

  return response;
}

function headerCount(response: Response, name: string, fallback: number): number {
  const value = Number.parseInt(response.headers.get(name) ?? "", 10);
  return Number.isFinite(value) && value >= 0 ? value : fallback;
}

function asJsonArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export async function getWordpressCategories(): Promise<WordpressCategory[]> {
  const search = new URLSearchParams({
    per_page: "100",
  });
  const response = await wpGet("categories", search);
  const payload: unknown = await response.json();

  return asJsonArray(payload)
    .flatMap((item) => {
      const category = mapWordpressCategory(item);
      return category ? [category] : [];
    })
    .filter((category) => category.count > 0);
}

async function getPublishedPosts(search: URLSearchParams): Promise<WordpressPostList> {
  search.set("status", "publish");
  search.set("_embed", "1");
  const response = await wpGet("posts", search);
  const payload: unknown = await response.json();
  const posts = asJsonArray(payload).flatMap((item) => {
    const post = mapWordpressPost(item, { includeContent: false });
    return post ? [post] : [];
  });

  return {
    posts,
    total: headerCount(response, "X-WP-Total", posts.length),
    totalPages: headerCount(response, "X-WP-TotalPages", 1),
  };
}

export async function getWordpressPosts(options: {
  readonly page?: number;
  readonly perPage?: number;
  readonly categoryId?: number;
}): Promise<WordpressPostList> {
  const page = Math.max(1, options.page ?? 1);
  const search = new URLSearchParams({
    per_page: String(options.perPage ?? BLOG_PAGE_SIZE),
    page: String(page),
  });

  if (options.categoryId) {
    search.set("categories", String(options.categoryId));
  }

  return getPublishedPosts(search);
}

export async function getFeaturedWordpressPosts(): Promise<readonly WordpressPost[]> {
  const stickySearch = new URLSearchParams({
    sticky: "true",
    per_page: String(1 + BLOG_FEATURED_CARD_COUNT),
  });
  const sticky = await getPublishedPosts(stickySearch);

  if (sticky.posts.length > 0) {
    return sticky.posts;
  }

  const latest = await getWordpressPosts({ page: 1, perPage: 1 });
  return latest.posts;
}

export async function getWordpressPostByPermalink(input: {
  readonly year: string;
  readonly month: string;
  readonly day: string;
  readonly slug: string;
}): Promise<WordpressPost | null> {
  const search = new URLSearchParams({
    slug: input.slug,
    per_page: "1",
  });
  search.set("status", "publish");
  search.set("_embed", "1");
  const response = await wpGet("posts", search);
  const payload: unknown = await response.json();
  const raw = asJsonArray(payload)[0];
  const post = raw ? mapWordpressPost(raw, { includeContent: true }) : null;

  if (!post || !permalinkDateMatches(post.date, input.year, input.month, input.day)) {
    return null;
  }

  return post;
}

export async function getRelatedWordpressPosts(
  post: WordpressPost
): Promise<readonly WordpressPost[]> {
  const categoryId = post.categories[0]?.id;
  if (!categoryId) {
    return [];
  }

  const search = new URLSearchParams({
    categories: String(categoryId),
    exclude: String(post.id),
    per_page: String(BLOG_RELATED_COUNT),
  });

  const related = await getPublishedPosts(search);
  return related.posts;
}

export async function getWordpressBlogIndex(options: {
  readonly page?: number;
  readonly categorySlug?: string | null;
}): Promise<WordpressBlogIndex> {
  const page = Math.max(1, options.page ?? 1);
  const categorySlug = options.categorySlug?.trim() || null;
  const categories = await getWordpressCategories();
  const selectedCategory = categorySlug
    ? categories.find((category) => category.slug === categorySlug)
    : undefined;

  if (categorySlug && !selectedCategory) {
    const featured = await getFeaturedWordpressPosts();
    return {
      posts: [],
      featured,
      categories,
      total: 0,
      totalPages: 0,
      page,
      categorySlug,
    };
  }

  const [list, featured] = await Promise.all([
    getWordpressPosts({
      page,
      perPage: BLOG_PAGE_SIZE,
      categoryId: selectedCategory?.id,
    }),
    getFeaturedWordpressPosts(),
  ]);

  return {
    posts: list.posts,
    featured,
    categories,
    total: list.total,
    totalPages: list.totalPages,
    page,
    categorySlug,
  };
}
