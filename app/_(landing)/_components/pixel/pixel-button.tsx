"use client";

import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelButtonProps = {
  variant?: "primary" | "secondary";
  children: ReactNode;
  className?: string;
  asChild?: boolean;
} & ButtonHTMLAttributes<HTMLButtonElement>;

export const PixelButton = ({
  variant = "primary",
  children,
  className,
  asChild = false,
  ...props
}: PixelButtonProps) => {
  const Comp = asChild ? Slot : "button";

  return (
    <Comp
      className={cn(
        "pixel-btn",
        variant === "primary" && "pixel-btn-primary",
        variant === "secondary" && "pixel-btn-secondary",
        className
      )}
      {...props}
    >
      {children}
    </Comp>
  );
};
