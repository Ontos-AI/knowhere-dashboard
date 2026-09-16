"use client";

import { dashboardDialogDesign } from "@app/(dashboard)/_components/dashboard-dialog-design";
import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const dashboardActionButtonVariants = cva(
  "inline-flex items-center rounded-none border font-mono-display text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a88b]/25 disabled:cursor-not-allowed [&_svg]:shrink-0",
  {
    variants: {
      size: {
        compact:
          "h-9 justify-center gap-0.5 border-b-[3px] px-2.5 pb-px leading-5 transition-[transform,border-width,background-color] hover:border-b-[5px] active:translate-y-[2px] active:border-b-[3px] lg:gap-1 lg:border-b-4 lg:px-3 lg:pb-0.5 lg:hover:border-b-[6px] lg:active:border-b-4",
        dialog: dashboardDialogDesign.actionButton.dialogSize,
        page: "h-9 justify-center gap-1 border-b-4 px-3 pb-0.5 leading-5 transition-[transform,border-width,background-color] hover:border-b-[6px] active:translate-y-[2px] active:border-b-4",
        small:
          "h-8 justify-center gap-1 border-b-4 px-3 pb-0.5 leading-4 transition-[transform,border-width,background-color] hover:border-b-[6px] active:translate-y-[2px] active:border-b-4",
      },
      variant: {
        primary:
          "border-[#0a6351] bg-[#19a88b] text-[#f0f2e6] hover:bg-[#0a6351] disabled:border-muted disabled:bg-muted disabled:text-muted-foreground",
        secondary:
          "border-border bg-card text-foreground hover:bg-muted disabled:border-border disabled:bg-muted disabled:text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "page",
      variant: "primary",
    },
  }
);

type DashboardActionButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof dashboardActionButtonVariants> & {
    asChild?: boolean;
  };

export const DashboardActionButton = React.forwardRef<
  HTMLButtonElement,
  DashboardActionButtonProps
>(({ asChild = false, className, size, variant, ...props }, ref) => {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      className={cn(dashboardActionButtonVariants({ size, variant }), className)}
      ref={ref}
      {...props}
    />
  );
});

DashboardActionButton.displayName = "DashboardActionButton";
