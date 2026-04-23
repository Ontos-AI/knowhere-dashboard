import { cn } from "@lib/utils";

type LandingBrandProps = {
  className?: string;
  compact?: boolean;
  size?: "default" | "nav" | "header";
};

type BrandWingProps = {
  className?: string;
  variant: "primary" | "secondary";
};

const BrandWing = ({ className, variant }: BrandWingProps) => (
  <svg
    aria-hidden="true"
    className={cn("absolute text-[#7008e7]", className)}
    fill="none"
    viewBox="0 0 13.9727 16.5721"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M10.2206 12.0056C10.5901 12.4245 11.1023 12.6651 11.6654 12.6533C12.2272 12.6428 12.794 12.3806 13.22 11.9459C13.646 11.5112 13.8903 10.9457 13.8782 10.3951C13.8674 9.84338 13.6012 9.35175 13.159 9.00703C12.9704 8.85961 12.7818 8.71219 12.5932 8.56477C9.19851 5.9112 5.80377 3.25763 2.40904 0.604066C2.22044 0.456646 2.03184 0.309225 1.84325 0.161805C1.69199 0.0438795 1.48991 -0.0110334 1.28863 0.00183716C1.08694 0.0151318 0.902545 0.0951376 0.768855 0.231564C0.635165 0.367992 0.561069 0.551767 0.555702 0.749773C0.550752 0.947354 0.614954 1.14296 0.741349 1.28626C0.899337 1.46491 1.05733 1.64357 1.21531 1.82223C4.0591 5.03802 6.90289 8.25381 9.74668 11.4696C9.90467 11.6483 10.0627 11.8269 10.2206 12.0056Z"
      fill="currentColor"
      opacity={variant === "primary" ? 0.15 : 1}
    />
    <path
      d="M11.1935 12.527C11.7249 12.7198 12.288 12.6864 12.7681 12.3976C13.2477 12.1109 13.6049 11.5922 13.7522 10.9925C13.8995 10.3927 13.8222 9.77162 13.5282 9.30251C13.2348 8.83127 12.7488 8.55056 12.1861 8.48537C11.9979 8.46326 11.8097 8.44116 11.6215 8.41905C8.23391 8.02115 4.8463 7.62324 1.45869 7.22533C1.27049 7.20323 1.08229 7.18112 0.894084 7.15902C0.706408 7.13727 0.507245 7.1945 0.343418 7.30584C0.179416 7.41789 0.0641778 7.57491 0.0200436 7.75462C-0.0240907 7.93433 0.00562745 8.12553 0.0996504 8.29842C0.193848 8.4706 0.34464 8.61034 0.521866 8.67463C0.699728 8.73884 0.877589 8.80305 1.05545 8.86725C4.25695 10.023 7.45845 11.1787 10.66 12.3344C10.8378 12.3986 11.0157 12.4628 11.1935 12.527Z"
      fill="currentColor"
      opacity={variant === "primary" ? 0.2 : 0.7}
    />
    <path
      d="M12.4021 12.4642C12.9606 12.3577 13.4189 12.0429 13.6595 11.5435C13.9011 11.0467 13.9054 10.4063 13.6878 9.80842C13.4703 9.21052 13.0535 8.71717 12.5457 8.48222C12.0369 8.24463 11.4787 8.2848 10.9774 8.54857C10.8455 8.61763 10.7136 8.68669 10.5817 8.75574C8.20766 9.99879 5.83359 11.2418 3.45951 12.4849C3.32761 12.5539 3.19572 12.623 3.06383 12.6921C2.90183 12.7773 2.77385 12.9343 2.70271 13.1138C2.63187 13.2942 2.62369 13.4825 2.68529 13.6518C2.74689 13.8211 2.87475 13.9618 3.04609 14.0576C3.21711 14.1526 3.41758 14.1948 3.59807 14.1604C3.7448 14.1321 3.89154 14.1039 4.03827 14.0756C6.67947 13.5667 9.32067 13.0579 11.9619 12.549C12.1086 12.5207 12.2553 12.4925 12.4021 12.4642Z"
      fill="currentColor"
      opacity={variant === "primary" ? 0.6 : 0.4}
    />
    <path
      d="M13.414 11.7173C13.8322 11.3328 14.0441 10.8312 13.951 10.2862C13.8609 9.74337 13.4733 9.20173 12.9255 8.81706C12.3777 8.43239 11.7297 8.24673 11.1761 8.33755C10.6195 8.42625 10.2028 8.78407 9.9656 9.29568C9.91761 9.39846 9.86962 9.50124 9.82163 9.60402C8.95779 11.454 8.09395 13.3041 7.23011 15.1541C7.18212 15.2569 7.13413 15.3596 7.08613 15.4624C7.01285 15.6205 7.00838 15.8182 7.05758 16.0009C7.10773 16.1843 7.20748 16.3375 7.35101 16.4383C7.49454 16.5391 7.67472 16.5824 7.86803 16.57C8.0604 16.557 8.25009 16.4893 8.37927 16.3705C8.46319 16.293 8.5471 16.2154 8.63101 16.1379C10.1414 14.7419 11.6518 13.3459 13.1622 11.9499C13.2462 11.8724 13.3301 11.7948 13.414 11.7173Z"
      fill="currentColor"
      opacity={variant === "primary" ? 0.8 : 0.4}
    />
  </svg>
);

export const LandingBrand = ({
  className,
  compact = false,
  size = "default",
}: LandingBrandProps) => {
  const isHeaderSize = size === "header";
  const isNavSize = size === "nav";

  const wingClassName = compact ? "h-[15px] w-4" : isHeaderSize ? "h-[22px] w-6" : "h-5 w-[22px]";

  const primaryWingClassName = compact
    ? "left-0 top-0 h-[11.66px] w-[8.556px]"
    : isHeaderSize
      ? "left-0 top-0 h-[17.094px] w-[12.834px]"
      : "left-0 top-0 h-[15.54px] w-[11.764px]";

  const secondaryWingClassName = compact
    ? "left-[7.45px] top-[3.34px] h-[11.66px] w-[8.556px] rotate-180"
    : isHeaderSize
      ? "left-[11.17px] top-[4.91px] h-[17.094px] w-[12.834px] rotate-180"
      : "left-[10.24px] top-[4.46px] h-[15.54px] w-[11.764px] rotate-180";

  const textClassName = compact
    ? "text-xs leading-4"
    : isHeaderSize
      ? "text-[22px] leading-[30px]"
      : isNavSize
        ? "text-sm leading-5"
        : "text-base leading-[21px]";

  return (
    <div className={cn("flex items-center gap-[9.8px]", compact && "gap-2", className)}>
      <span
        aria-hidden="true"
        className={cn("relative block shrink-0 origin-left opacity-80", wingClassName)}
      >
        <BrandWing className={primaryWingClassName} variant="primary" />
        <BrandWing className={secondaryWingClassName} variant="secondary" />
      </span>
      <div
        className={cn(
          "font-[family-name:var(--font-brand)] font-medium capitalize text-zinc-950",
          textClassName
        )}
      >
        knowhere
      </div>
    </div>
  );
};
