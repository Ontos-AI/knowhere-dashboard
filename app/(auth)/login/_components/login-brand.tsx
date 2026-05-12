import { KnowhereBrand } from "@components/brand/knowhere-brand";
import { cn } from "@lib/utils";
import type { JSX } from "react";

type LoginBrandProps = {
  readonly className?: string;
  readonly variant: "card" | "header";
};

const LOGIN_BRAND_WIDTH_CLASS_BY_VARIANT = {
  card: "w-[145px]",
  header: "w-[118px]",
} as const satisfies Record<LoginBrandProps["variant"], string>;

const LOGIN_BRAND_SIZES_BY_VARIANT = {
  card: "145px",
  header: "118px",
} as const satisfies Record<LoginBrandProps["variant"], string>;

export const LoginBrand = ({ className, variant }: LoginBrandProps): JSX.Element => {
  return (
    <KnowhereBrand
      className={cn(LOGIN_BRAND_WIDTH_CLASS_BY_VARIANT[variant], className)}
      priority={variant === "header"}
      sizes={LOGIN_BRAND_SIZES_BY_VARIANT[variant]}
    />
  );
};
