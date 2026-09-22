import { cn } from "@lib/utils";
import Image from "next/image";
import type { JSX } from "react";

type KnowhereBrandVariant = "horizontal" | "mark";
type ResolvedKnowhereBrandTone = "light" | "dark";
type KnowhereBrandTone = ResolvedKnowhereBrandTone | "auto";

type BrandAsset = {
  readonly height: number;
  readonly src: string;
  readonly width: number;
};

type KnowhereBrandProps = {
  readonly className?: string;
  readonly imageClassName?: string;
  readonly priority?: boolean;
  readonly sizes?: string;
  readonly tone?: KnowhereBrandTone;
  readonly variant?: KnowhereBrandVariant;
};

type BrandImageProps = {
  readonly asset: BrandAsset;
  readonly className?: string;
  readonly isInverted: boolean;
  readonly priority: boolean;
  readonly sizes?: string;
};

/*
  The prototype's own marks, so the dashboard carries the same logo as the site: its header
  logo, which is the mark plus the wordmark, and the mark on its own drawn in ink. The
  prototype inverts the header logo in dark theme rather than shipping a second file, which
  is what `isInverted` below reproduces.
*/
const BRAND_ASSETS = {
  horizontal: {
    light: {
      height: 52,
      src: "/images/site-chrome/knowhere-back-to-top.svg",
      width: 132,
    },
    dark: {
      height: 52,
      src: "/images/site-chrome/knowhere-back-to-top.svg",
      width: 132,
    },
  },
  mark: {
    light: {
      height: 42,
      src: "/images/site-chrome/knowhere-mark.svg",
      width: 37,
    },
    dark: {
      height: 42,
      src: "/images/site-chrome/knowhere-mark.svg",
      width: 37,
    },
  },
} as const satisfies Record<KnowhereBrandVariant, Record<ResolvedKnowhereBrandTone, BrandAsset>>;

function renderBrandImage({
  asset,
  className,
  isInverted,
  priority,
  sizes,
}: BrandImageProps): JSX.Element {
  return (
    <Image
      alt="Knowhere"
      className={cn("block h-auto w-full object-contain", isInverted && "invert", className)}
      height={asset.height}
      priority={priority}
      sizes={sizes}
      src={asset.src}
      unoptimized
      width={asset.width}
    />
  );
}

export const KnowhereBrand = ({
  className,
  imageClassName,
  priority = false,
  sizes,
  tone = "light",
  variant = "horizontal",
}: KnowhereBrandProps): JSX.Element => {
  if (tone === "auto") {
    return (
      <span className={cn("inline-flex shrink-0 items-center", className)}>
        {renderBrandImage({
          asset: BRAND_ASSETS[variant].light,
          className: cn("dark:hidden", imageClassName),
          isInverted: false,
          priority,
          sizes,
        })}
        {renderBrandImage({
          asset: BRAND_ASSETS[variant].dark,
          className: cn("hidden dark:block", imageClassName),
          isInverted: true,
          priority,
          sizes,
        })}
      </span>
    );
  }

  return (
    <span className={cn("inline-flex shrink-0 items-center", className)}>
      {renderBrandImage({
        asset: BRAND_ASSETS[variant][tone],
        className: imageClassName,
        isInverted: tone === "dark",
        priority,
        sizes,
      })}
    </span>
  );
};
