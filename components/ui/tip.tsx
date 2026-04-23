import { cn } from "@lib/utils";
import type { ComponentProps } from "react";

const tipTailAlignments = {
  start: "left-6",
  center: "left-1/2 -translate-x-1/2",
  end: "right-6",
} as const;

export type TipProps = ComponentProps<"div"> & {
  align?: keyof typeof tipTailAlignments;
};

export const Tip = ({ align = "center", children, className, ...props }: TipProps) => {
  return (
    <div
      className={cn(
        "relative inline-flex max-w-sm items-center justify-center rounded-2xl bg-zinc-950 px-5 py-4 text-center text-sm leading-5 text-zinc-50 shadow-xl",
        className
      )}
      {...props}
    >
      <span>{children}</span>
      <div className={cn("absolute top-full h-3 w-7 overflow-hidden", tipTailAlignments[align])}>
        <div className="absolute left-1/2 top-0 size-4 -translate-x-1/2 -translate-y-2 rotate-45 rounded-sm bg-zinc-950" />
      </div>
    </div>
  );
};
