"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelHeadingProps = {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "2xl";
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLHeadingElement>;

export const PixelHeading = ({
  as: Component = "h2",
  size = "md",
  children,
  className,
  ...props
}: PixelHeadingProps) => {
  return (
    <Component
      className={cn(
        "pixel-text",
        size === "xs" && "pixel-text-xs",
        size === "sm" && "pixel-text-sm",
        size === "md" && "pixel-text-md",
        size === "lg" && "pixel-text-lg",
        size === "xl" && "pixel-text-xl",
        size === "2xl" && "pixel-text-2xl",
        className
      )}
      {...props}
    >
      {children}
    </Component>
  );
};
