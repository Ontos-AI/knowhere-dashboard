import { cn } from "@lib/utils";
import type { ComponentProps } from "react";

export type TipsListProps = ComponentProps<"div"> & {
  items: string[];
};

export const TipsList = ({ className, items, ...props }: TipsListProps) => (
  <div className={cn("flex flex-col gap-6 text-sm leading-5 text-zinc-600", className)} {...props}>
    {items.map((item) => (
      <p key={item}>{item}</p>
    ))}
  </div>
);
