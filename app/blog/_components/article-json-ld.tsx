import { BLOG_SITE_ORIGIN, type WordpressPost } from "@lib/wordpress";

type ArticleJsonLdProps = {
  readonly post: WordpressPost;
};

export function ArticleJsonLd({ post }: ArticleJsonLdProps) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    dateModified: post.modified,
    mainEntityOfPage: post.permalinkUrl,
    url: post.permalinkUrl,
    image: post.cover.url ? [post.cover.url] : undefined,
    author: post.author.name
      ? {
          "@type": "Person",
          name: post.author.name,
        }
      : undefined,
    publisher: {
      "@type": "Organization",
      name: "Knowhere",
      url: BLOG_SITE_ORIGIN,
    },
  };

  return (
    <script
      // biome-ignore lint/security/noDangerouslySetInnerHtml: JSON-LD is serialized from mapped WordPress fields
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      type="application/ld+json"
    />
  );
}
