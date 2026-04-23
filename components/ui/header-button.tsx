import { KnowhereIcon, type KnowhereIconName } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import { Slot } from "@radix-ui/react-slot";
import type { ButtonHTMLAttributes, ReactNode } from "react";

export type HeaderButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  icon?: KnowhereIconName;
  label?: ReactNode;
  selected?: boolean;
  trailingIcon?: KnowhereIconName | false;
  variant?: "icon" | "text";
};

export const HeaderButton = ({
  asChild = false,
  className,
  icon = "theme-dark",
  label,
  selected = false,
  trailingIcon,
  variant = "text",
  ...props
}: HeaderButtonProps) => {
  const Comp = asChild ? Slot : "button";
  const resolvedTrailingIcon =
    trailingIcon === undefined && variant === "text" ? "chevron-down" : trailingIcon;

  return (
    <Comp
      className={cn(
        "inline-flex h-[63px] items-center justify-center border-b-[6px] border-transparent py-[10px] text-zinc-950 transition-[background-color,border-color,color] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-ring/15 focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50",
        variant === "text" ? "gap-2 pl-4 pr-3 text-sm font-normal" : "px-4",
        selected
          ? "border-zinc-200 bg-zinc-100"
          : "hover:border-zinc-300 hover:bg-zinc-200 active:border-zinc-200 active:bg-zinc-100",
        className
      )}
      {...props}
    >
      {variant === "icon" ? (
        <KnowhereIcon className="size-5 text-current" name={icon} />
      ) : (
        <>
          <span>{label}</span>
          {resolvedTrailingIcon ? (
            <KnowhereIcon className="size-5 text-current" name={resolvedTrailingIcon} />
          ) : null}
        </>
      )}
    </Comp>
  );
};
