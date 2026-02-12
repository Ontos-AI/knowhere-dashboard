"use client";

import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type PixelCardProps = {
  children: ReactNode;
  accent?: boolean;
  accentColor?: "green" | "yellow" | "red";
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

export const PixelCard = ({
  children,
  accent = false,
  accentColor = "green",
  className,
  ...props
}: PixelCardProps) => {
  return (
    <div
      className={cn("pixel-card", accent && "pixel-card-accent", className)}
      style={
        accent
          ? ({
              "--accent-color":
                accentColor === "green"
                  ? "var(--pixel-accent-green)"
                  : accentColor === "yellow"
                    ? "var(--pixel-accent-yellow)"
                    : "var(--pixel-accent-red)",
            } as React.CSSProperties)
          : undefined
      }
      {...props}
    >
      {children}
    </div>
  );
};
