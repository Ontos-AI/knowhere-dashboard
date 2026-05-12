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
  readonly priority: boolean;
  readonly sizes?: string;
};

const BRAND_ASSETS = {
  horizontal: {
    light: {
      height: 84,
      src: "/images/knowhere/logo.png",
      width: 360,
    },
    dark: {
      height: 84,
      src: "/images/knowhere/logo-dark.png",
      width: 360,
    },
  },
  mark: {
    light: {
      height: 84,
      src: "/images/knowhere/logo-icon.png",
      width: 92,
    },
    dark: {
      height: 84,
      src: "/images/knowhere/logo-icon.png",
      width: 92,
    },
  },
} as const satisfies Record<KnowhereBrandVariant, Record<ResolvedKnowhereBrandTone, BrandAsset>>;

function renderBrandImage({ asset, className, priority, sizes }: BrandImageProps): JSX.Element {
  return (
    <Image
      alt="Knowhere"
      className={cn("block h-auto w-full object-contain", className)}
      height={asset.height}
      priority={priority}
      sizes={sizes}
      src={asset.src}
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
          priority,
          sizes,
        })}
        {renderBrandImage({
          asset: BRAND_ASSETS[variant].dark,
          className: cn("hidden dark:block", imageClassName),
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
        priority,
        sizes,
      })}
    </span>
  );
};
