"use client";

import { dashboardDialogDesign } from "@app/(dashboard)/_components/dashboard-dialog-design";
import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import * as React from "react";

const dashboardActionButtonVariants = cva(
  "inline-flex items-center rounded-none border font-mono-display text-xs font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/25 disabled:cursor-not-allowed [&_svg]:shrink-0",
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
          "border-[#7008e7] bg-[#7f22fe] text-[#f5f3ff] hover:bg-[#7008e7] disabled:border-[#d6d3d1] disabled:bg-[#d6d3d1] disabled:text-[#a8a29e]",
        secondary:
          "border-[#f4f4f5] bg-white text-[#27272a] hover:bg-[#fafafa] disabled:border-[#e7e5e4] disabled:bg-[#f4f4f5] disabled:text-[#a1a1a1] dark:border-[#3f3f46] dark:bg-[#18181b] dark:text-[#fafafa] dark:hover:bg-[#27272a]",
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
