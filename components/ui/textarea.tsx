import { cn } from "@lib/utils";
import * as React from "react";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[96px] w-full rounded-none border border-border bg-card px-3 py-2 text-base leading-6 text-foreground shadow-none placeholder:text-muted-foreground transition-colors hover:border-muted-foreground/40 focus-visible:border-primary focus-visible:outline-none focus-visible:ring-0 disabled:cursor-not-allowed disabled:border-border disabled:bg-muted disabled:text-muted-foreground disabled:placeholder:text-muted-foreground",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Textarea.displayName = "Textarea";

export { Textarea };
