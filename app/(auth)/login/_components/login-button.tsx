import { cn } from "@lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type LoginButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  icon?: ReactNode;
  variant: "primary" | "secondary";
};

export const LoginButton = ({
  children,
  className,
  icon,
  type = "button",
  variant,
  ...props
}: LoginButtonProps) => {
  return (
    <button
      className={cn(
        "flex h-10 w-full items-center justify-center gap-0.5 px-[10px] pb-px text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 lg:gap-1 lg:px-3 lg:pb-[2px]",
        variant === "secondary"
          ? "border-x-[0.5px] border-t-[0.5px] border-b-[3px] border-[#f4f4f5] bg-white font-normal text-xs leading-[18px] text-[#27272a] hover:bg-[#fcfcfd] lg:border-x lg:border-t lg:border-b-4 lg:text-sm lg:leading-5"
          : "border-x-[0.5px] border-t-[0.5px] border-b-[3px] border-[#7008e7] bg-[#7f22fe] font-mono-display text-xs font-medium leading-5 text-[#f5f3ff] hover:bg-[#8b30ff] lg:border-x lg:border-t lg:border-b-4",
        className
      )}
      type={type}
      {...props}
    >
      {icon ? <span className="flex size-5 items-center justify-center">{icon}</span> : null}
      <span>{children}</span>
    </button>
  );
};
