"use client";

import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type PixelDividerProps = {
  variant?: "dotted" | "dashed";
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const PixelDivider = ({ variant = "dotted", className, ...props }: PixelDividerProps) => {
  return (
    <div
      className={cn(
        variant === "dotted" && "pixel-divider",
        variant === "dashed" && "pixel-divider-dash",
        className
      )}
      {...props}
    />
  );
};
