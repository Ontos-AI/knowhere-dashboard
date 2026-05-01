import { cn } from "@lib/utils";

type LandingBrandProps = {
  className?: string;
  compact?: boolean;
  size?: "default" | "nav" | "header";
};

const LOGO_SRC = "/images/knowhere/logo.png";

export const LandingBrand = ({
  className,
  compact = false,
  size = "default",
}: LandingBrandProps) => {
  if (compact) {
    return (
      <img
        alt="Knowhere"
        className={cn("h-auto w-[110px] object-contain", className)}
        src={LOGO_SRC}
      />
    );
  }

  if (size === "nav") {
    return (
      <img
        alt="Knowhere"
        className={cn("h-auto w-[120px] object-contain", className)}
        src={LOGO_SRC}
      />
    );
  }

  if (size === "header") {
    return <img alt="Knowhere" className={cn("h-[22px] w-auto", className)} src={LOGO_SRC} />;
  }

  return <img alt="Knowhere" className={cn("h-[28px] w-auto", className)} src={LOGO_SRC} />;
};
