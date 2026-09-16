export const BLOG_SITE_ORIGIN = "https://knowhereto.ai";
export const DEFAULT_WORDPRESS_SITE = "knowheretoai.wordpress.com";
export const WP_REVALIDATE_SECONDS = 90;
export const BLOG_PAGE_SIZE = 9;
export const BLOG_RELATED_COUNT = 3;
export const BLOG_FEATURED_CARD_COUNT = 3;

export type WordpressCategory = {
  readonly id: number;
  readonly name: string;
  readonly slug: string;
  readonly count: number;
};

export type WordpressAuthor = {
  readonly name: string;
  readonly avatarUrl: string | null;
  readonly bio: string | null;
};

export type WordpressCover = {
  readonly url: string | null;
  readonly alt: string;
};

export type WordpressPost = {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly excerpt: string;
  readonly content: string | null;
  readonly date: string;
  readonly modified: string;
  readonly sticky: boolean;
  readonly categories: readonly WordpressCategory[];
  readonly cover: WordpressCover;
  readonly author: WordpressAuthor;
  readonly permalinkPath: string;
  readonly permalinkUrl: string;
  readonly readingTimeMinutes: number;
};

export type WordpressPostList = {
  readonly posts: readonly WordpressPost[];
  readonly total: number;
  readonly totalPages: number;
};

export type WordpressBlogIndex = {
  readonly posts: readonly WordpressPost[];
  readonly featured: readonly WordpressPost[];
  readonly categories: readonly WordpressCategory[];
  readonly total: number;
  readonly totalPages: number;
  readonly page: number;
  readonly categorySlug: string | null;
};

export class WordpressFetchError extends Error {
  readonly status: number;

  constructor(message: string, status = 502) {
    super(message);
    this.name = "WordpressFetchError";
    this.status = status;
  }
}
