import {
  KNOWHERE_ICON_NAMES,
  KnowhereIcon,
  type KnowhereIconName,
} from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import type { ComponentProps, ReactNode } from "react";

const tagVariants = cva(
  "relative inline-flex shrink-0 items-center justify-center overflow-hidden",
  {
    variants: {
      variant: {
        count:
          "size-12 border border-b border-l border-r-4 border-t-0 border-violet-200 bg-violet-100 text-violet-400",
        icon: "size-12 border border-b border-l-4 border-r border-t border-violet-200 bg-violet-100 text-violet-500",
        status:
          "size-12 rounded-full border border-b border-l border-r-4 border-t border-emerald-600 bg-emerald-500 text-white",
        format: "border border-stone-100 bg-white px-4 py-2 text-black",
        text: "border border-b border-l-4 border-r border-t border-zinc-200 bg-zinc-100 px-6 py-3 text-zinc-950",
        step: "border border-b border-l border-r-4 border-t-0 border-violet-100 bg-violet-50 px-5 py-2.5 text-violet-400",
        block:
          "gap-2 border border-b border-l border-r border-t-0 border-orange-200 bg-orange-100 px-5 py-2 text-orange-600",
        "pixel-icon":
          "size-12 border border-b border-l-4 border-r border-t border-violet-100 bg-violet-50 text-violet-500",
      },
    },
    defaultVariants: {
      variant: "text",
    },
  }
);

type TagVariant = NonNullable<VariantProps<typeof tagVariants>["variant"]>;

const textVariants: Record<TagVariant, string> = {
  count: "font-mono text-lg font-bold leading-7",
  icon: "",
  status: "",
  format: "font-mono text-2xl font-normal leading-8",
  text: "font-mono text-base font-bold leading-6",
  step: "font-mono text-lg font-bold leading-7",
  block: "font-mono text-base font-bold leading-6",
  "pixel-icon": "",
};

export type TagProps = ComponentProps<"div"> &
  VariantProps<typeof tagVariants> & {
    icon?: KnowhereIconName | ReactNode;
    value?: ReactNode;
  };

const cornerClassName = "absolute size-[9px] border-l-2 border-t-2 border-stone-300";

const isKnowhereIconName = (value: ReactNode): value is KnowhereIconName =>
  typeof value === "string" && KNOWHERE_ICON_NAMES.includes(value as KnowhereIconName);

export const Tag = ({ children, className, icon, value, variant = "text", ...props }: TagProps) => {
  const resolvedVariant: TagVariant = variant ?? "text";
  const resolvedValue =
    value ??
    (resolvedVariant === "count"
      ? "1"
      : resolvedVariant === "step"
        ? "STEP 1"
        : resolvedVariant === "block"
          ? "TEXT"
          : resolvedVariant === "format"
            ? ".text"
            : children);

  const fallbackIcon: KnowhereIconName =
    resolvedVariant === "status" ? "check" : resolvedVariant === "block" ? "mind" : "download";

  const resolvedIcon = isKnowhereIconName(icon) ? (
    <KnowhereIcon className="size-6" name={icon} />
  ) : (
    (icon ?? (
      <KnowhereIcon
        className={cn(
          resolvedVariant === "status"
            ? "size-8"
            : resolvedVariant === "block"
              ? "size-4"
              : "size-6"
        )}
        name={fallbackIcon}
      />
    ))
  );

  return (
    <div className={cn(tagVariants({ variant: resolvedVariant }), className)} {...props}>
      {resolvedVariant === "format" ? (
        <>
          <div className="pointer-events-none absolute inset-0 opacity-50 [background-image:repeating-linear-gradient(0deg,transparent_0,transparent_15px,rgba(214,211,209,0.65)_16px)]" />
          <span className={cn(cornerClassName, "left-0 top-0")} />
          <span className={cn(cornerClassName, "right-0 top-0 rotate-90")} />
          <span className={cn(cornerClassName, "bottom-0 left-0 -rotate-90")} />
          <span className={cn(cornerClassName, "bottom-0 right-0 rotate-180")} />
        </>
      ) : null}

      {resolvedVariant === "icon" ||
      resolvedVariant === "status" ||
      resolvedVariant === "pixel-icon" ? (
        <span className="relative z-10 flex items-center justify-center">{resolvedIcon}</span>
      ) : resolvedVariant === "block" ? (
        <>
          <span className="relative z-10 flex items-center justify-center">{resolvedIcon}</span>
          <span className={cn("relative z-10 whitespace-nowrap", textVariants.block)}>
            {resolvedValue}
          </span>
        </>
      ) : (
        <span className={cn("relative z-10 whitespace-nowrap", textVariants[resolvedVariant])}>
          {resolvedValue}
        </span>
      )}
    </div>
  );
};
