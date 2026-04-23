import { KnowhereIcon, type KnowhereIconName } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import * as React from "react";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: KnowhereIconName;
};

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  ({ className, icon = "info", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex size-10 items-center justify-center rounded-full text-[#FD9A00] transition-opacity focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-30 hover:opacity-60 active:opacity-40",
        className
      )}
      type={type}
      {...props}
    >
      <KnowhereIcon className="size-6 text-current" name={icon} />
    </button>
  )
);

IconButton.displayName = "IconButton";
