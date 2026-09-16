import { BLOG_SITE_ORIGIN } from "@lib/wordpress/types";

export type PermalinkDateParts = {
  readonly year: string;
  readonly month: string;
  readonly day: string;
};

export function permalinkDateParts(date: string): PermalinkDateParts {
  const [year = "", month = "", day = ""] = date.slice(0, 10).split("-");
  return { year, month, day };
}

export function articlePermalinkPath(date: string, slug: string): string {
  const { year, month, day } = permalinkDateParts(date);
  return `/blog/${year}/${month}/${day}/${slug}`;
}

export function articlePermalinkUrl(date: string, slug: string): string {
  return `${BLOG_SITE_ORIGIN}${articlePermalinkPath(date, slug)}/`;
}

export function permalinkDateMatches(
  date: string,
  year: string,
  month: string,
  day: string
): boolean {
  const parts = permalinkDateParts(date);
  return parts.year === year && parts.month === month && parts.day === day;
}

export function formatArticleDate(date: string, locale: string): string {
  const { year, month, day } = permalinkDateParts(date);
  const yearNumber = Number.parseInt(year, 10);
  const monthNumber = Number.parseInt(month, 10);
  const dayNumber = Number.parseInt(day, 10);

  if (!yearNumber || !monthNumber || !dayNumber) {
    return date.slice(0, 10);
  }

  return new Date(Date.UTC(yearNumber, monthNumber - 1, dayNumber)).toLocaleDateString(
    locale === "zh" ? "zh-CN" : "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
      timeZone: "UTC",
    }
  );
}

export type ShareNetwork = "linkedin" | "mastodon" | "bluesky" | "twitter" | "facebook";

export function shareIntentUrl(network: ShareNetwork, permalink: string, title: string): string {
  const url = encodeURIComponent(permalink);
  const text = encodeURIComponent(title);

  switch (network) {
    case "linkedin":
      return `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
    case "mastodon":
      return `https://mastodon.social/share?text=${text}%20${url}`;
    case "bluesky":
      return `https://bsky.app/intent/compose?text=${text}%20${url}`;
    case "twitter":
      return `https://twitter.com/intent/tweet?url=${url}&text=${text}`;
    case "facebook":
      return `https://www.facebook.com/sharer/sharer.php?u=${url}`;
  }
}
