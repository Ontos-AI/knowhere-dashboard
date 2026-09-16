import { BLOG_SITE_ORIGIN } from "@lib/wordpress";
import type { Metadata } from "next";

export const blogMetadataBase = new URL(BLOG_SITE_ORIGIN);

export function blogPageMetadata(input: {
  readonly title: string;
  readonly description: string;
  readonly canonicalPath: string;
  readonly image?: string | null;
  readonly type?: "website" | "article";
}): Metadata {
  const canonical = `${BLOG_SITE_ORIGIN}${input.canonicalPath}`;

  return {
    metadataBase: blogMetadataBase,
    title: input.title,
    description: input.description,
    alternates: {
      canonical,
    },
    openGraph: {
      title: input.title,
      description: input.description,
      url: canonical,
      siteName: "Knowhere",
      type: input.type ?? "website",
      images: input.image ? [{ url: input.image }] : undefined,
    },
    twitter: {
      card: input.image ? "summary_large_image" : "summary",
      title: input.title,
      description: input.description,
      images: input.image ? [input.image] : undefined,
    },
  };
}
