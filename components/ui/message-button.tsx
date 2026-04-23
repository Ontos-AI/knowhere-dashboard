import { KnowhereIcon, type KnowhereIconName } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import * as React from "react";

export type MessageButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: KnowhereIconName;
};

export const MessageButton = React.forwardRef<HTMLButtonElement, MessageButtonProps>(
  ({ children, className, icon = "arrow-outward", type = "button", ...props }, ref) => (
    <button
      ref={ref}
      className={cn(
        "inline-flex h-[60px] items-center justify-center gap-2 rounded-sm pl-8 pr-6 text-xl leading-7 text-[#7008E7] transition-[background-color,color] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 hover:bg-[#F5F3FF] active:bg-[#EDE9FE]",
        className
      )}
      type={type}
      {...props}
    >
      <span className="font-mono-display font-medium tracking-normal whitespace-nowrap">
        {children}
      </span>
      <KnowhereIcon className="size-6 text-current" name={icon} />
    </button>
  )
);

MessageButton.displayName = "MessageButton";
