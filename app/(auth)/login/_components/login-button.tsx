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
        "flex h-10 w-full items-center justify-center gap-1 px-3 pb-[2px] text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 max-[639px]:gap-0.5 max-[639px]:px-[10px] max-[639px]:pb-px max-[374px]:px-3",
        variant === "secondary"
          ? "border-x border-t border-b-4 border-[#f4f4f5] bg-white font-normal text-sm leading-5 text-[#27272a] hover:bg-[#fcfcfd] max-[639px]:border-x-[0.5px] max-[639px]:border-t-[0.5px] max-[639px]:border-b-[3px] max-[639px]:text-xs max-[639px]:leading-[18px]"
          : "border-x border-t border-b-4 border-[#7008e7] bg-[#7f22fe] font-mono-display text-xs font-medium leading-5 text-[#f5f3ff] hover:bg-[#8b30ff] max-[639px]:border-x-[0.5px] max-[639px]:border-t-[0.5px] max-[639px]:border-b-[3px]",
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
