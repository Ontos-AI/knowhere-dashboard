export function blogListHref(input: {
  readonly category?: string | null;
  readonly page?: number;
}): string {
  const params = new URLSearchParams();
  if (input.category) {
    params.set("category", input.category);
  }
  if (input.page && input.page > 1) {
    params.set("page", String(input.page));
  }
  const query = params.toString();
  return query ? `/blog?${query}` : "/blog";
}

export function parseBlogPage(value: string | string[] | undefined): number {
  const raw = Array.isArray(value) ? value[0] : value;
  const page = Number.parseInt(raw ?? "1", 10);
  return Number.isFinite(page) && page > 0 ? page : 1;
}

export function parseBlogCategory(value: string | string[] | undefined): string | null {
  const raw = Array.isArray(value) ? value[0] : value;
  const category = raw?.trim();
  return category ? category : null;
}
