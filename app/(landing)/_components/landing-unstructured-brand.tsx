import { cn } from "@lib/utils";
import Image from "next/image";

type LandingUnstructuredBrandProps = {
  className?: string;
};

export const LandingUnstructuredBrand = ({ className }: LandingUnstructuredBrandProps) => {
  return (
    <div className={cn("flex h-10 w-[149px] shrink-0 items-center gap-2", className)}>
      <Image
        src="/images/brand/unstructured-mark.png"
        alt=""
        aria-hidden="true"
        width={28}
        height={28}
        className="size-7 shrink-0 object-contain"
      />
      <span className="w-[113px] whitespace-nowrap font-sans text-lg font-normal leading-7 text-zinc-950">
        Unstructured
      </span>
    </div>
  );
};
