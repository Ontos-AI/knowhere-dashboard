import { ArticleCard } from "@app/blog/_components/article-card";
import { ArticleJsonLd } from "@app/blog/_components/article-json-ld";
import { ShareLinks } from "@app/blog/_components/share-links";
import { formatArticleDate, type WordpressPost } from "@lib/wordpress";
import { ChevronLeft } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

type ArticleDetailProps = {
  readonly post: WordpressPost;
  readonly related: readonly WordpressPost[];
  readonly locale: string;
};

function AuthorValue({ post }: { readonly post: WordpressPost }) {
  if (!post.author.name) {
    return null;
  }

  return (
    <span className="kb-author">
      {post.author.avatarUrl ? (
        <Image alt={post.author.name} height={24} src={post.author.avatarUrl} width={24} />
      ) : null}
      {post.author.name}
    </span>
  );
}

export async function ArticleDetail({ post, related, locale }: ArticleDetailProps) {
  const t = await getTranslations("Blog");
  const formattedDate = formatArticleDate(post.date, locale);
  const readingTime = t("readingTimeValue", { minutes: post.readingTimeMinutes });
  const categoryNames = post.categories.map((category) => category.name).join(", ");

  return (
    <div className="kb kb-standard kb-detail">
      <ArticleJsonLd post={post} />
      <a className="kb-skip" href="#article-main">
        {t("skipToContent")}
      </a>
      <main id="article-main">
        <article aria-labelledby="article-title" className="kb-detail-grid kb-shell">
          <header className="kb-detail-heading">
            <Link className="kb-detail-back" href="/blog">
              <ChevronLeft aria-hidden="true" size={20} /> {t("back")}
            </Link>
            <h1 id="article-title">{post.title}</h1>
            <div className="kb-detail-meta">
              {post.author.name ? <span>{post.author.name}</span> : null}
              <time dateTime={post.date.slice(0, 10)}>{formattedDate}</time>
              <span>{readingTime}</span>
            </div>
          </header>
          <div className="kb-detail-primary">
            <div className="kb-detail-body">
              {post.content ? (
                <div
                  className="kb-detail-content"
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: WordPress HTML is sanitized server-side
                  dangerouslySetInnerHTML={{ __html: post.content }}
                />
              ) : null}
              <div className="kb-detail-end">
                <Link className="kb-detail-back" href="/blog">
                  <ChevronLeft aria-hidden="true" size={20} /> {t("backToBlog")}
                </Link>
              </div>
            </div>
          </div>
          <aside aria-label={t("articleInformation")} className="kb-detail-sidebar">
            <div className="kb-detail-sidebar-inner kb-detail-information">
              <h2>{t("articleInformation")}</h2>
              <dl>
                {post.author.name ? (
                  <div>
                    <dt>{t("author")}</dt>
                    <dd>
                      <AuthorValue post={post} />
                    </dd>
                  </div>
                ) : null}
                {post.author.bio ? (
                  <div>
                    <dt>{t("bio")}</dt>
                    <dd>{post.author.bio}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>{t("published")}</dt>
                  <dd>
                    <time dateTime={post.date.slice(0, 10)}>{formattedDate}</time>
                  </dd>
                </div>
                {categoryNames ? (
                  <div>
                    <dt>{t("category")}</dt>
                    <dd>{categoryNames}</dd>
                  </div>
                ) : null}
                <div>
                  <dt>{t("readingTime")}</dt>
                  <dd>{readingTime}</dd>
                </div>
              </dl>
              <ShareLinks
                post={post}
                shareLabel={t("share")}
                shareOnLabel={(network) => t("shareOn", { network })}
              />
            </div>
          </aside>
        </article>
        {related.length > 0 ? (
          <section
            aria-labelledby="related-title"
            className="kb-detail-related kb-classic kb-hybrid kb-shell"
          >
            <div className="kb-section-heading">
              <h2 id="related-title">{t("recommended")}</h2>
            </div>
            <div className="kb-featured-grid">
              {related.map((item) => (
                <ArticleCard
                  formattedDate={formatArticleDate(item.date, locale)}
                  key={item.id}
                  post={item}
                  readLabel={t("read")}
                />
              ))}
            </div>
          </section>
        ) : null}
      </main>
    </div>
  );
}
