"use client";

import { cn } from "@lib/utils";
import Link from "next/link";
import type { MouseEvent, ReactNode } from "react";

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
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
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
        "inline-flex h-[52px] items-center justify-center rounded-full px-7 pb-1 font-mono-display text-lg font-semibold leading-6 tracking-normal transition-colors duration-150 min-[640px]:h-[72px] min-[640px]:px-9 min-[640px]:max-[767px]:h-[52px] min-[640px]:max-[767px]:px-7 min-[640px]:max-[767px]:text-lg min-[640px]:max-[767px]:leading-6 min-[768px]:max-[768px]:h-[52px] min-[768px]:max-[768px]:px-7 min-[768px]:max-[768px]:text-lg min-[768px]:max-[768px]:leading-6 min-[769px]:h-[52px] min-[769px]:px-7 min-[769px]:text-lg min-[769px]:leading-6",
        variant === "primary"
          ? "border-b-[6px] border-[#c10007] bg-[#e7000b] text-[#f5f3ff] hover:bg-[#c10007]"
          : "border-x-2 border-t-2 border-b-[6px] border-[#e4e4e7] bg-[#fafafa] text-[#27272a] hover:bg-[#f4f4f5]",
        className
      )}
      href={href}
      onClick={handleClick}
    >
      {children}
    </Link>
  );
};
