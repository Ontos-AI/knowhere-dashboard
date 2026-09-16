import { ArticleDetail } from "@app/blog/_components/article-detail";
import { BlogFetchError } from "@app/blog/_components/blog-fetch-error";
import { blogPageMetadata } from "@app/blog/_lib/metadata";
import {
  getRelatedWordpressPosts,
  getWordpressPostByPermalink,
  WordpressFetchError,
} from "@lib/wordpress";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLocale, getTranslations } from "next-intl/server";

type ArticlePageProps = {
  readonly params: Promise<{
    year: string;
    month: string;
    day: string;
    slug: string;
  }>;
};

async function loadArticle(params: { year: string; month: string; day: string; slug: string }) {
  return getWordpressPostByPermalink(params);
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const t = await getTranslations("Blog");
  const resolved = await params;

  try {
    const post = await loadArticle(resolved);
    if (!post) {
      return blogPageMetadata({
        title: t("notFoundTitle"),
        description: t("notFoundDescription"),
        canonicalPath: `/blog/${resolved.year}/${resolved.month}/${resolved.day}/${resolved.slug}/`,
      });
    }

    return blogPageMetadata({
      title: `${post.title} — Knowhere`,
      description: post.excerpt || t("metaDescription"),
      canonicalPath: `${post.permalinkPath}/`,
      image: post.cover.url,
      type: "article",
    });
  } catch {
    return blogPageMetadata({
      title: t("metaTitle"),
      description: t("metaDescription"),
      canonicalPath: `/blog/${resolved.year}/${resolved.month}/${resolved.day}/${resolved.slug}/`,
    });
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const resolved = await params;
  const locale = await getLocale();

  try {
    const post = await loadArticle(resolved);
    if (!post) {
      notFound();
    }

    const related = await getRelatedWordpressPosts(post);
    return <ArticleDetail locale={locale} post={post} related={related} />;
  } catch (error) {
    if (error instanceof WordpressFetchError) {
      return (
        <div className="kb kb-standard kb-detail">
          <main id="article-main">
            <BlogFetchError />
          </main>
        </div>
      );
    }

    throw error;
  }
}
