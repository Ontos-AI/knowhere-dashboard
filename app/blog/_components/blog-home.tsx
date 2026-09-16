import { ArticleCard } from "@app/blog/_components/article-card";
import { ArticleCover } from "@app/blog/_components/article-cover";
import { BlogPagination } from "@app/blog/_components/blog-pagination";
import { CategoryFilter } from "@app/blog/_components/category-filter";
import { HeroDataStream } from "@app/blog/_components/hero-data-stream";
import { formatArticleDate, type WordpressBlogIndex, type WordpressPost } from "@lib/wordpress";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

type BlogHomeProps = {
  readonly index: WordpressBlogIndex;
  readonly locale: string;
};

function LeadArticle({
  post,
  formattedDate,
}: {
  readonly post: WordpressPost;
  readonly formattedDate: string;
}) {
  const categoryName = post.categories[0]?.name;

  return (
    <article aria-labelledby="lead-title" className="kb-photon-lead">
      <Link href={post.permalinkPath}>
        <div className="kb-lead-image">
          <div className="kb-lead-cover-copy">
            <div className="kb-lead-story">
              {categoryName ? (
                <span className="kb-lead-cover-tag">
                  <span aria-hidden="true" />
                  {categoryName}
                </span>
              ) : null}
              <h2 className="kb-lead-cover-title" id="lead-title">
                {post.title}
              </h2>
              {post.excerpt ? <p>{post.excerpt}</p> : null}
              <time dateTime={post.date.slice(0, 10)}>{formattedDate}</time>
            </div>
          </div>
          <div className="kb-lead-cover-art">
            <ArticleCover
              alt={post.cover.alt || post.title}
              sizes="(max-width: 767px) 100vw, 640px"
              src={post.cover.url}
            />
          </div>
        </div>
      </Link>
    </article>
  );
}

export async function BlogHome({ index, locale }: BlogHomeProps) {
  const t = await getTranslations("Blog");
  const lead = index.featured[0] ?? null;
  const featuredCards = index.featured.slice(1, 4);
  const formatted = (post: WordpressPost) => formatArticleDate(post.date, locale);

  return (
    <div className="kb kb-standard">
      <a className="kb-skip" href="#blog-main">
        {t("skipToContent")}
      </a>
      <main className="kb-classic kb-hybrid" id="blog-main">
        <section aria-labelledby="blog-title" className="kb-intro kb-shell">
          <HeroDataStream />
          <h1 id="blog-title">{t("title")}</h1>
          <p>{t("description")}</p>
        </section>
        {lead ? (
          <div className="kb-shell">
            <LeadArticle formattedDate={formatted(lead)} post={lead} />
          </div>
        ) : null}
        {featuredCards.length > 0 ? (
          <section aria-labelledby="featured-title" className="kb-classic-featured kb-shell">
            <div className="kb-section-heading">
              <span className="kb-eyebrow">{t("featuredEyebrow")}</span>
              <h2 id="featured-title">{t("featuredTitle")}</h2>
            </div>
            <div className="kb-featured-grid">
              {featuredCards.map((post) => (
                <ArticleCard
                  formattedDate={formatted(post)}
                  key={post.id}
                  post={post}
                  readLabel={t("read")}
                />
              ))}
            </div>
          </section>
        ) : null}
        <section aria-labelledby="latest-title" className="kb-latest kb-shell" id="articles">
          <div className="kb-section-heading">
            <span className="kb-eyebrow">{t("browseEyebrow")}</span>
            <h2 id="latest-title">{t("allArticles")}</h2>
          </div>
          <CategoryFilter
            allLabel={t("filterAll")}
            ariaLabel={t("filterAria")}
            categories={index.categories}
            selectedSlug={index.categorySlug}
          />
          {index.posts.length > 0 ? (
            <div className="kb-article-grid">
              {index.posts.map((post) => (
                <ArticleCard
                  formattedDate={formatted(post)}
                  key={post.id}
                  post={post}
                  readLabel={t("read")}
                />
              ))}
            </div>
          ) : (
            <div className="kb-empty">
              <h3>{t("emptyTitle")}</h3>
              <p>{t("emptyDescription")}</p>
            </div>
          )}
          <BlogPagination
            ariaLabel={t("paginationAria")}
            categorySlug={index.categorySlug}
            currentPage={index.page}
            nextLabel={t("next")}
            pageCount={index.totalPages}
            pageLabel={(page) => t("page", { page })}
            previousLabel={t("previous")}
          />
        </section>
      </main>
    </div>
  );
}
