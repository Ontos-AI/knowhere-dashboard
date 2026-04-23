import { KnowhereIcon, type KnowhereIconName } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import type { ComponentProps, ReactNode } from "react";

export type ChipProps = ComponentProps<"div"> & {
  icon?: KnowhereIconName;
  size?: "compact" | "default";
  value?: ReactNode;
  variant?: "message" | "pop";
};

export const Chip = ({
  children,
  className,
  icon,
  size = "default",
  value,
  variant = "pop",
  ...props
}: ChipProps) => {
  const resolvedIcon = icon ?? (variant === "message" ? "search" : "draft");
  const resolvedValue = value ?? children;

  return (
    <div
      className={cn(
        "inline-flex items-center justify-center overflow-hidden transition-[background-color,border-color,color]",
        variant === "message"
          ? size === "compact"
            ? "gap-2 rounded-full border border-zinc-500 bg-zinc-700 pl-4 pr-5 py-2 text-zinc-50"
            : "gap-[10px] rounded-full border border-zinc-500 bg-zinc-700 pl-5 pr-6 py-[10px] text-zinc-50"
          : "gap-2.5 rounded-lg border border-zinc-600 bg-zinc-700 px-3 py-2 text-zinc-400",
        className
      )}
      {...props}
    >
      <KnowhereIcon
        className={cn(variant === "message" ? "size-6 text-zinc-50" : "size-5 text-zinc-400")}
        name={resolvedIcon}
      />
      <span
        className={cn(
          "font-mono-display tracking-normal whitespace-nowrap",
          variant === "message" ? "text-xl leading-7" : "text-sm leading-5"
        )}
      >
        {resolvedValue}
      </span>
    </div>
  );
};
