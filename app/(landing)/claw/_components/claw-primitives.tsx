import { cn } from "@lib/utils";
import Link from "next/link";
import { type CSSProperties, type ReactNode, useId } from "react";

type ClawActionButtonProps = {
  children: ReactNode;
  className?: string;
  href: string;
  variant?: "primary" | "secondary";
};

export const ClawActionButton = ({
  children,
  className,
  href,
  variant = "primary",
}: ClawActionButtonProps) => {
  return (
    <Link
      className={cn(
        "inline-flex h-[52px] items-center justify-center rounded-full px-7 pb-1 font-mono-display text-lg font-semibold leading-6 tracking-normal transition-colors duration-150 min-[640px]:h-[72px] min-[640px]:px-9 min-[640px]:max-[767px]:h-[52px] min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:h-[52px] min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-6 min-[769px]:h-[52px] min-[769px]:px-7 min-[769px]:text-lg min-[769px]:leading-6",
        variant === "primary"
          ? "border-b-[6px] border-[#c10007] bg-[#e7000b] text-[#f5f3ff] hover:bg-[#c10007]"
          : "border-x-2 border-t-2 border-b-[6px] border-[#e4e4e7] bg-[#fafafa] text-[#27272a] hover:bg-[#f4f4f5]",
        className
      )}
      href={href}
    >
      {children}
    </Link>
  );
};

type ClawSectionHeadingProps = {
  className?: string;
  description: string;
  eyebrow: string;
  eyebrowSpacingClassName?: string;
  titleBlockClassName?: string;
  title: ReactNode;
};

export const ClawSectionHeading = ({
  className,
  description,
  eyebrow,
  eyebrowSpacingClassName,
  titleBlockClassName,
  title,
}: ClawSectionHeadingProps) => {
  return (
    <div
      className={cn(
        "space-y-2 px-5 min-[640px]:space-y-3 min-[640px]:px-16 min-[769px]:space-y-2 min-[769px]:px-12",
        "min-[640px]:max-[767px]:space-y-2 min-[640px]:max-[767px]:px-12 min-[768px]:max-[768px]:space-y-2 min-[768px]:max-[768px]:px-12",
        className
      )}
    >
      <p
        className={cn(
          "text-base font-bold leading-6 text-[#ff6467] min-[640px]:text-xl min-[640px]:leading-7 min-[640px]:max-[767px]:text-xl min-[640px]:max-[767px]:leading-7 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:text-base min-[769px]:leading-6",
          eyebrowSpacingClassName
        )}
      >
        {eyebrow}
      </p>
      <div
        className={cn(
          "space-y-2 min-[640px]:space-y-3 min-[640px]:max-[767px]:space-y-2 min-[768px]:max-[768px]:space-y-2 min-[769px]:space-y-2",
          titleBlockClassName
        )}
      >
        <h2 className="text-[24px] font-bold leading-8 tracking-normal text-[#09090b] min-[640px]:text-4xl min-[640px]:leading-10 min-[640px]:max-[767px]:text-[30px] min-[640px]:max-[767px]:leading-9 min-[768px]:max-[768px]:text-[30px] min-[768px]:max-[768px]:leading-9 min-[769px]:text-[30px] min-[769px]:leading-9">
          {title}
        </h2>
        <p className="max-w-[1152px] text-base leading-6 text-[#71717b] min-[640px]:text-xl min-[640px]:leading-7 min-[640px]:max-[767px]:text-base min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:text-base min-[768px]:max-[768px]:leading-6 min-[769px]:text-base min-[769px]:leading-6">
          {description}
        </p>
      </div>
    </div>
  );
};

type ClawStripedOverlayProps = {
  className?: string;
  tint?: "amber" | "orange" | "pink" | "red" | "violet";
};

const stripeTintMap: Record<NonNullable<ClawStripedOverlayProps["tint"]>, string> = {
  amber: "rgba(245, 158, 11, 0.06)",
  orange: "rgba(249, 115, 22, 0.06)",
  pink: "rgba(217, 70, 239, 0.06)",
  red: "rgba(239, 68, 68, 0.04)",
  violet: "rgba(139, 92, 246, 0.06)",
};

export const ClawStripedOverlay = ({ className, tint = "violet" }: ClawStripedOverlayProps) => {
  const style: CSSProperties = {
    backgroundImage: `repeating-linear-gradient(-45deg, ${stripeTintMap[tint]} 0px, ${stripeTintMap[tint]} 1px, transparent 1px, transparent 8px)`,
  };

  return <div aria-hidden="true" className={cn("absolute inset-0", className)} style={style} />;
};

type FileFormatBadgeProps = {
  backgroundColor: string;
  borderColor: string;
  cornerColor: string;
  label: string;
  stripeColor: string;
  textColor: string;
};

export const FileFormatBadge = ({
  backgroundColor,
  borderColor,
  cornerColor,
  label,
  stripeColor,
  textColor,
}: FileFormatBadgeProps) => {
  const stripeStyle: CSSProperties = {
    backgroundImage: `repeating-linear-gradient(-45deg, ${stripeColor} 0px, ${stripeColor} 1px, transparent 1px, transparent 8px)`,
  };

  const cornerClassName = "absolute size-[9px] border-l-2 border-t-2";

  return (
    <span
      className="relative inline-flex items-center overflow-hidden border px-3 py-1 font-mono-display text-base leading-6 min-[640px]:px-4 min-[640px]:py-2 min-[640px]:text-2xl min-[640px]:leading-8 min-[640px]:max-[767px]:px-3 min-[640px]:max-[767px]:py-2 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:px-3 min-[768px]:max-[768px]:py-2 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-6 min-[769px]:px-3 min-[769px]:py-2 min-[769px]:text-lg min-[769px]:leading-6"
      style={{
        backgroundColor,
        borderColor,
        color: textColor,
      }}
    >
      <span aria-hidden="true" className="absolute inset-0 opacity-60" style={stripeStyle} />
      <span
        aria-hidden="true"
        className={cn(cornerClassName, "left-0 top-0")}
        style={{ borderColor: cornerColor }}
      />
      <span
        aria-hidden="true"
        className={cn(cornerClassName, "right-0 top-0 -scale-x-100")}
        style={{ borderColor: cornerColor }}
      />
      <span
        aria-hidden="true"
        className={cn(cornerClassName, "bottom-0 left-0 -scale-y-100")}
        style={{ borderColor: cornerColor }}
      />
      <span
        aria-hidden="true"
        className={cn(cornerClassName, "bottom-0 right-0 -scale-100")}
        style={{ borderColor: cornerColor }}
      />
      <span className="relative">{label}</span>
    </span>
  );
};

type OpenClawMarkProps = {
  className?: string;
};

export const OpenClawMark = ({ className }: OpenClawMarkProps) => {
  const iconId = useId();
  const bodyGradientId = `${iconId}-body-gradient`;
  const leftArmGradientId = `${iconId}-left-arm-gradient`;
  const rightArmGradientId = `${iconId}-right-arm-gradient`;

  return (
    <svg
      aria-hidden="true"
      className={cn(className)}
      fill="none"
      viewBox="0 0 56 50"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          d="M49.7604 22.2417C49.2301 10.8677 40.0554 2.09579 28.0378 2.09579C16.0201 2.09579 6.84808 10.8677 6.31781 22.2417C5.83479 32.6116 11.694 41.8626 20.6875 45.1706V50H25.7225V45.14C26.4811 45.2216 27.2529 45.2521 28.0404 45.2521C28.8279 45.2521 29.5997 45.219 30.3584 45.14V50H35.3933V45.1706C44.3868 41.8626 50.246 32.6116 49.763 22.2417H49.7604Z"
          fill={`url(#${bodyGradientId})`}
        />
        <path
          d="M3.19079 18.4878C5.54025 18.0061 10.0443 18.2227 11.2419 20.389C11.8746 21.5333 11.4756 26.9157 5.68988 28.3505C-0.0958161 29.7853 -2.37439 19.6321 3.19079 18.4878Z"
          fill={`url(#${leftArmGradientId})`}
        />
        <path
          d="M52.8092 18.4878C50.4598 18.0061 45.9557 18.2227 44.7581 20.389C44.1254 21.5333 44.5244 26.9157 50.3101 28.3505C56.0958 29.7853 58.3744 19.6321 52.8092 18.4878Z"
          fill={`url(#${rightArmGradientId})`}
        />
        <path
          d="M20.5068 5.09286C20.3047 5.09286 20.1026 5.01641 19.9477 4.86605C17.6822 2.6463 16.3513 1.71864 15.1989 1.55299C14.3484 1.43066 13.6842 1.84352 13.679 1.84862C13.3167 2.07798 12.8311 1.98369 12.5896 1.63709C12.3507 1.28795 12.4399 0.819022 12.7969 0.582011C12.9124 0.505556 13.9782 -0.167248 15.4299 0.0391803C16.9761 0.2609 18.5039 1.2752 21.0686 3.78803C21.3757 4.08875 21.3731 4.57297 21.0633 4.86859C20.9111 5.01641 20.7089 5.09031 20.5094 5.09031L20.5068 5.09286Z"
          fill="#FE4346"
        />
        <path
          d="M35.5727 5.09286C35.7748 5.09286 35.977 5.01641 36.1319 4.86605C38.3973 2.6463 39.7282 1.71864 40.8806 1.55299C41.7312 1.43066 42.3953 1.84352 42.4006 1.84862C42.7628 2.07798 43.2485 1.98369 43.49 1.63709C43.7289 1.28795 43.6396 0.819022 43.2826 0.582011C43.1671 0.505556 42.1013 -0.167248 40.6496 0.0391803C39.1035 0.2609 37.5757 1.2752 35.0109 3.78803C34.7038 4.08875 34.7064 4.57297 35.0162 4.86859C35.1685 5.01641 35.3706 5.09031 35.5701 5.09031L35.5727 5.09286Z"
          fill="#FE4346"
        />
        <path
          d="M20.7616 16.9816C22.426 16.9816 23.7752 15.6718 23.7752 14.056C23.7752 12.4402 22.426 11.1303 20.7616 11.1303C19.0973 11.1303 17.748 12.4402 17.748 14.056C17.748 15.6718 19.0973 16.9816 20.7616 16.9816Z"
          fill="#090C11"
        />
        <path
          d="M21.1878 14.9301C21.9301 14.9301 22.5318 14.3459 22.5318 13.6252C22.5318 12.9046 21.9301 12.3204 21.1878 12.3204C20.4455 12.3204 19.8438 12.9046 19.8438 13.6252C19.8438 14.3459 20.4455 14.9301 21.1878 14.9301Z"
          fill="#18D1B9"
        />
        <path
          d="M35.4286 16.9816C37.093 16.9816 38.4422 15.6718 38.4422 14.056C38.4422 12.4402 37.093 11.1303 35.4286 11.1303C33.7643 11.1303 32.415 12.4402 32.415 14.056C32.415 15.6718 33.7643 16.9816 35.4286 16.9816Z"
          fill="#090C11"
        />
        <path
          d="M35.8548 14.9301C36.5971 14.9301 37.1988 14.3459 37.1988 13.6252C37.1988 12.9046 36.5971 12.3204 35.8548 12.3204C35.1125 12.3204 34.5107 12.9046 34.5107 13.6252C34.5107 14.3459 35.1125 14.9301 35.8548 14.9301Z"
          fill="#18D1B9"
        />
      </g>
      <defs>
        <linearGradient
          id={bodyGradientId}
          gradientUnits="userSpaceOnUse"
          x1="15.1801"
          x2="41.6082"
          y1="6.11733"
          y2="48.1175"
        >
          <stop stopColor="#EC3D40" />
          <stop offset="1" stopColor="#A32123" />
        </linearGradient>
        <linearGradient
          id={leftArmGradientId}
          gradientUnits="userSpaceOnUse"
          x1="2.34279"
          x2="7.39723"
          y1="19.1323"
          y2="29.0602"
        >
          <stop stopColor="#EC3D40" />
          <stop offset="1" stopColor="#A32123" />
        </linearGradient>
        <linearGradient
          id={rightArmGradientId}
          gradientUnits="userSpaceOnUse"
          x1="45.1059"
          x2="55.2447"
          y1="20.0067"
          y2="25.7055"
        >
          <stop stopColor="#EC3D40" />
          <stop offset="1" stopColor="#A32123" />
        </linearGradient>
      </defs>
    </svg>
  );
};

type OpenClawWordmarkProps = {
  className?: string;
  compact?: boolean;
  textClassName?: string;
};

type NpmLogoProps = {
  className?: string;
};

export const NpmLogo = ({ className }: NpmLogoProps) => {
  return (
    <svg
      aria-hidden="true"
      className={cn(className)}
      fill="none"
      viewBox="0 0 18 7"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 0V6H5V7H9V6H18V0H0Z" fill="#CB3837" />
      <path
        d="M1 1V5H3V2H4V5H5V1H6V6H8V2H9V4H8V5H10V1H11V5H13V2H14V5H15V2H16V5H17V1H1Z"
        fill="#FAFAFA"
      />
    </svg>
  );
};

type KnowhereWingProps = {
  className?: string;
  variant: "primary" | "secondary";
};

const KnowhereWing = ({ className, variant }: KnowhereWingProps) => {
  return (
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
};

type KnowhereWordmarkProps = {
  className?: string;
  compact?: boolean;
};

export const KnowhereWordmark = ({ className, compact = false }: KnowhereWordmarkProps) => {
  const iconContainerClassName = compact
    ? "h-[20.203px] w-[28px]"
    : "h-[49.73px] w-[68px] min-[640px]:max-[767px]:h-[38.664px] min-[640px]:max-[767px]:w-[48px] min-[768px]:max-[768px]:h-[38.664px] min-[768px]:max-[768px]:w-[48px] min-[769px]:h-[38.664px] min-[769px]:w-[48px]";
  const primaryWingClassName = compact
    ? "left-0 top-0 h-[20.203px] w-[14.973px]"
    : "left-0 top-0 h-[49.73px] w-[36.362px] min-[640px]:max-[767px]:h-[38.664px] min-[640px]:max-[767px]:w-[28.534px] min-[768px]:max-[768px]:h-[38.664px] min-[768px]:max-[768px]:w-[28.534px] min-[769px]:h-[38.664px] min-[769px]:w-[28.534px]";
  const secondaryWingClassName = compact
    ? "left-[13.03px] top-[5.8px] h-[20.203px] w-[14.973px] rotate-180"
    : "left-[31.64px] top-[14.27px] h-[49.73px] w-[36.362px] rotate-180 min-[640px]:max-[767px]:left-[19.47px] min-[640px]:max-[767px]:top-[9.34px] min-[640px]:max-[767px]:h-[38.664px] min-[640px]:max-[767px]:w-[28.534px] min-[768px]:max-[768px]:left-[19.47px] min-[768px]:max-[768px]:top-[9.34px] min-[768px]:max-[768px]:h-[38.664px] min-[768px]:max-[768px]:w-[28.534px] min-[769px]:left-[19.47px] min-[769px]:top-[9.34px] min-[769px]:h-[38.664px] min-[769px]:w-[28.534px]";
  const textClassName = compact
    ? "text-[22px] leading-none"
    : "text-5xl leading-[48px] min-[640px]:max-[767px]:text-[32px] min-[640px]:max-[767px]:leading-normal min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-normal min-[769px]:text-[36px] min-[769px]:leading-normal";

  return (
    <span className={cn("inline-flex items-center gap-[10px]", className)}>
      <span
        aria-hidden="true"
        className={cn("relative block shrink-0 opacity-80", iconContainerClassName)}
      >
        <KnowhereWing className={primaryWingClassName} variant="primary" />
        <KnowhereWing className={secondaryWingClassName} variant="secondary" />
      </span>
      <span
        className={cn(
          "font-[family-name:var(--font-brand)] font-medium capitalize text-[#09090b]",
          textClassName
        )}
      >
        knowhere
      </span>
    </span>
  );
};

export const OpenClawWordmark = ({
  className,
  compact = false,
  textClassName,
}: OpenClawWordmarkProps) => {
  const iconClassName = compact
    ? "h-7 w-8"
    : "h-[50px] w-[56px] min-[640px]:max-[767px]:h-[35.714px] min-[640px]:max-[767px]:w-[40px] min-[768px]:max-[768px]:h-[35.714px] min-[768px]:max-[768px]:w-[40px] min-[769px]:h-[35.714px] min-[769px]:w-[40px]";
  const defaultTextClassName = compact
    ? "text-2xl leading-8"
    : "text-5xl leading-[48px] min-[640px]:max-[767px]:text-[36px] min-[640px]:max-[767px]:leading-10 min-[768px]:max-[768px]:text-[36px] min-[768px]:max-[768px]:leading-10 min-[769px]:text-[36px] min-[769px]:leading-10";

  return (
    <span className={cn("inline-flex items-center gap-2", className)}>
      <OpenClawMark className={iconClassName} />
      <span className={cn(defaultTextClassName, "font-bold text-[#e7000b]", textClassName)}>
        OpenClaw.
      </span>
    </span>
  );
};
