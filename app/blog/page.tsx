import { BlogFetchError } from "@app/blog/_components/blog-fetch-error";
import { BlogHome } from "@app/blog/_components/blog-home";
import { blogPageMetadata } from "@app/blog/_lib/metadata";
import { blogListHref, parseBlogCategory, parseBlogPage } from "@app/blog/_lib/query";
import { getWordpressBlogIndex, WordpressFetchError } from "@lib/wordpress";
import type { Metadata } from "next";
import { getLocale, getTranslations } from "next-intl/server";

type BlogPageProps = {
  readonly searchParams: Promise<{
    category?: string | string[];
    page?: string | string[];
  }>;
};

export async function generateMetadata({ searchParams }: BlogPageProps): Promise<Metadata> {
  const t = await getTranslations("Blog");
  const params = await searchParams;
  const category = parseBlogCategory(params.category);
  const page = parseBlogPage(params.page);

  return blogPageMetadata({
    title: t("metaTitle"),
    description: t("metaDescription"),
    canonicalPath: blogListHref({ category, page }),
  });
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const params = await searchParams;
  const categorySlug = parseBlogCategory(params.category);
  const page = parseBlogPage(params.page);
  const locale = await getLocale();

  try {
    const index = await getWordpressBlogIndex({ page, categorySlug });
    return <BlogHome index={index} locale={locale} />;
  } catch (error) {
    if (error instanceof WordpressFetchError) {
      return (
        <div className="kb kb-standard">
          <main className="kb-classic kb-hybrid" id="blog-main">
            <BlogFetchError />
          </main>
        </div>
      );
    }

    throw error;
  }
}
