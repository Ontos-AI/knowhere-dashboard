import { KnowhereBrand } from "@components/brand/knowhere-brand";
import { cn } from "@lib/utils";
import type { JSX } from "react";

type LandingBrandProps = {
  readonly className?: string;
  readonly compact?: boolean;
  readonly size?: "default" | "nav" | "header";
};

type ResolvedLandingBrandSize = NonNullable<LandingBrandProps["size"]> | "compact";

const BRAND_WIDTH_CLASS_BY_SIZE = {
  compact: "w-[110px]",
  default: "w-[120px]",
  header: "w-[94px]",
  nav: "w-[120px]",
} as const satisfies Record<ResolvedLandingBrandSize, string>;

const BRAND_SIZES_BY_SIZE = {
  compact: "110px",
  default: "120px",
  header: "94px",
  nav: "120px",
} as const satisfies Record<ResolvedLandingBrandSize, string>;

export const LandingBrand = ({
  className,
  compact = false,
  size = "default",
}: LandingBrandProps): JSX.Element => {
  const resolvedSize: ResolvedLandingBrandSize = compact ? "compact" : size;

  return (
    <KnowhereBrand
      className={cn(BRAND_WIDTH_CLASS_BY_SIZE[resolvedSize], className)}
      priority={size === "header" || size === "nav"}
      sizes={BRAND_SIZES_BY_SIZE[resolvedSize]}
      tone="auto"
    />
  );
};
