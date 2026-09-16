import { blogListHref } from "@app/blog/_lib/query";
import type { WordpressCategory } from "@lib/wordpress";
import Link from "next/link";

type CategoryFilterProps = {
  readonly categories: readonly WordpressCategory[];
  readonly selectedSlug: string | null;
  readonly allLabel: string;
  readonly ariaLabel: string;
};

export function CategoryFilter({
  categories,
  selectedSlug,
  allLabel,
  ariaLabel,
}: CategoryFilterProps) {
  return (
    <div className="kb-filterbar">
      <nav className="kb-filters" aria-label={ariaLabel}>
        <Link aria-current={selectedSlug ? undefined : "page"} href={blogListHref({})}>
          {allLabel}
        </Link>
        {categories.map((category) => (
          <Link
            aria-current={selectedSlug === category.slug ? "page" : undefined}
            href={blogListHref({ category: category.slug })}
            key={category.slug}
          >
            {category.name}
          </Link>
        ))}
      </nav>
    </div>
  );
}
