import { blogListHref } from "@app/blog/_lib/query";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

type BlogPaginationProps = {
  readonly currentPage: number;
  readonly pageCount: number;
  readonly categorySlug: string | null;
  readonly ariaLabel: string;
  readonly previousLabel: string;
  readonly nextLabel: string;
  readonly pageLabel: (page: number) => string;
};

export function BlogPagination({
  currentPage,
  pageCount,
  categorySlug,
  ariaLabel,
  previousLabel,
  nextLabel,
  pageLabel,
}: BlogPaginationProps) {
  if (pageCount <= 1) {
    return null;
  }

  return (
    <nav className="kb-pagination" aria-label={ariaLabel}>
      <div className="kb-pagination-side kb-pagination-previous">
        {currentPage > 1 ? (
          <Link
            href={`${blogListHref({ category: categorySlug, page: currentPage - 1 })}#articles`}
          >
            <ArrowLeft aria-hidden="true" /> {previousLabel}
          </Link>
        ) : null}
      </div>
      <div className="kb-pagination-pages">
        {Array.from({ length: pageCount }, (_, index) => index + 1).map((page) =>
          page === currentPage ? (
            <span aria-current="page" key={page}>
              {page}
            </span>
          ) : (
            <Link
              aria-label={pageLabel(page)}
              href={`${blogListHref({ category: categorySlug, page })}#articles`}
              key={page}
            >
              {page}
            </Link>
          )
        )}
      </div>
      <div className="kb-pagination-side kb-pagination-next">
        {currentPage < pageCount ? (
          <Link
            href={`${blogListHref({ category: categorySlug, page: currentPage + 1 })}#articles`}
          >
            {nextLabel} <ArrowRight aria-hidden="true" />
          </Link>
        ) : null}
      </div>
    </nav>
  );
}
