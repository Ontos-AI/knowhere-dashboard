import type { KnowhereIconName } from "@components/ui/knowhere-icon";
import { Tag } from "@components/ui/tag";
import { cn } from "@lib/utils";
import type { ComponentProps } from "react";

const toneClasses = {
  neutral: {
    border: "border-zinc-200",
    description: "text-zinc-500",
    title: "text-zinc-950",
  },
  rose: {
    border: "border-rose-200",
    description: "text-zinc-500",
    title: "text-zinc-950",
  },
  violet: {
    border: "border-violet-100",
    description: "text-zinc-500",
    title: "text-zinc-950",
  },
} as const;

export type FeatureBlockProps = ComponentProps<"div"> & {
  description: string;
  icon?: KnowhereIconName;
  striped?: boolean;
  title: string;
  tone?: keyof typeof toneClasses;
};

export const FeatureBlock = ({
  children,
  className,
  description,
  icon = "download",
  striped = true,
  title,
  tone = "neutral",
  ...props
}: FeatureBlockProps) => (
  <div
    className={cn(
      "relative overflow-hidden border bg-white px-16 py-10",
      toneClasses[tone].border,
      className
    )}
    {...props}
  >
    {striped ? (
      <div className="pointer-events-none absolute inset-0 opacity-30 [background-image:repeating-linear-gradient(125deg,rgba(212,212,216,0.35)_0px,rgba(212,212,216,0.35)_14px,transparent_14px,transparent_42px)]" />
    ) : null}
    <div className="relative flex items-center gap-4">
      <Tag icon={icon} variant="icon" />
      <div className="flex min-w-0 flex-1 flex-col gap-2">
        <div className={cn("text-lg font-bold leading-7", toneClasses[tone].title)}>{title}</div>
        <p className={cn("text-base leading-6", toneClasses[tone].description)}>{description}</p>
        {children ? <div className="pt-4">{children}</div> : null}
      </div>
    </div>
  </div>
);
