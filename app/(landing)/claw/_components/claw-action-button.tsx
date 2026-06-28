"use client";

import { trackLandingInteraction } from "@app/(landing)/_components/landing-tracked-link";
import { cn } from "@lib/utils";
import Link from "next/link";
import { useLocale } from "next-intl";
import type { MouseEvent, ReactNode } from "react";

type ClawActionButtonProps = {
  children: ReactNode;
  className?: string;
  ctaId: string;
  href: string;
  sourceSection: string;
  variant?: "primary" | "secondary";
};

export const ClawActionButton = ({
  children,
  className,
  ctaId,
  href,
  sourceSection,
  variant = "primary",
}: ClawActionButtonProps) => {
  const locale = useLocale();

  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    trackLandingInteraction(ctaId, sourceSection, locale, { href });

    if (!href.startsWith("#")) {
      return;
    }

    const target = document.getElementById(href.slice(1));
    if (!target) {
      return;
    }

    event.preventDefault();
    target.scrollIntoView({ behavior: "smooth", block: "start" });
    window.history.replaceState(null, "", href);
  };

  return (
    <Link
      className={cn(
        "group inline-flex h-[52px] items-center justify-center rounded-full px-7 font-mono-readable text-lg leading-6 tracking-normal transition-[background-color,border-color,border-bottom-width] duration-150 min-[640px]:h-[72px] min-[640px]:px-9 min-[640px]:max-[767px]:h-[52px] min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:h-[52px] min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-6 min-[769px]:h-[52px] min-[769px]:px-7 min-[769px]:text-lg min-[769px]:leading-6",
        variant === "primary"
          ? "border border-b-[6px] border-[#c10007] bg-[#e7000b] text-[#f5f3ff] [--btn-bottom:6px] hover:border-[#a00006] hover:bg-[#c10007] hover:border-b-[8px] hover:[--btn-bottom:8px] active:border-[#a00006] active:bg-[#a00006] active:border-b-[6px] active:[--btn-bottom:6px]"
          : "border-x-2 border-t-2 border-b-[6px] border-[#d4d4d8] bg-[#fafafa] text-[#27272a] [--btn-bottom:6px] hover:border-[#d4d4d8] hover:bg-[#f4f4f5] hover:border-b-[8px] hover:[--btn-bottom:8px] active:border-[#d4d4d8] active:bg-[#e4e4e7] active:border-b-[6px] active:[--btn-bottom:6px]",
        className
      )}
      href={href}
      onClick={handleClick}
    >
      <span className="inline-flex h-full translate-y-1 items-center pb-[var(--btn-bottom)] font-semibold transition-[padding-bottom,transform] duration-150 ease-out">
        {children}
      </span>
    </Link>
  );
};
