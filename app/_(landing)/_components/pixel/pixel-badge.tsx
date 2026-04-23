"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelBadgeProps = {
  children: ReactNode;
  color?: "green" | "yellow" | "red" | "gray";
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const PixelBadge = ({ children, color = "green", className, ...props }: PixelBadgeProps) => {
  return (
    <div
      className={cn(
        "flex items-center justify-center px-2 py-1 border-2 font-pixel text-pixel-xs w-fit min-w-[30px]",
        color === "green" && "bg-pixel-green text-pixel-bg border-pixel-fg",
        color === "yellow" && "bg-pixel-yellow text-pixel-fg border-pixel-fg",
        color === "red" && "bg-pixel-red text-pixel-bg border-pixel-fg",
        color === "gray" && "bg-pixel-border text-pixel-fg border-pixel-fg",
        className
      )}
      style={{
        boxShadow: "2px 2px 0 var(--pixel-fg)",
      }}
      {...props}
    >
      {children}
    </div>
  );
};
