import { ArticleCover } from "@app/blog/_components/article-cover";
import type { WordpressPost } from "@lib/wordpress";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

type ArticleCardProps = {
  readonly post: WordpressPost;
  readonly formattedDate: string;
  readonly readLabel: string;
};

export function ArticleCard({ post, formattedDate, readLabel }: ArticleCardProps) {
  const categoryName = post.categories[0]?.name;

  return (
    <article className="kb-card kb-card-hybrid">
      <Link href={post.permalinkPath}>
        <div className="kb-card-image">
          <ArticleCover alt={post.cover.alt || post.title} src={post.cover.url} />
        </div>
        <div className="kb-card-copy">
          <h3>{post.title}</h3>
          {post.excerpt ? <p>{post.excerpt}</p> : null}
        </div>
        <div className="kb-card-footer">
          <time dateTime={post.date.slice(0, 10)}>{formattedDate}</time>
          <span className="kb-card-read" aria-hidden="true">
            {readLabel} <ArrowRight />
          </span>
        </div>
      </Link>
      {categoryName ? <span className="sr-only">{categoryName}</span> : null}
    </article>
  );
}
