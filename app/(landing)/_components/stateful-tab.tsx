"use client";

import { cn } from "@lib/utils";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type TabTone = {
  selectedBg: string;
  selectedBorder: string;
  selectedText: string;
  enabledBg: string;
  enabledText: string;
  hoverBg: string;
  hoverBorder: string;
  activeBg: string;
  activeBorder: string;
};

type StatefulTabProps = {
  active: boolean;
  children: ReactNode;
  className?: string;
  tone: TabTone;
} & Omit<ButtonHTMLAttributes<HTMLButtonElement>, "children">;

export const StatefulTab = ({ active, children, className, tone, ...props }: StatefulTabProps) => (
  <button
    className={cn(
      "group h-8 border-b-4 px-4 text-xs leading-4 transition-[background-color,border-bottom-color,color] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 [--tab-shift:2px]",
      active
        ? "border-b-4 bg-[var(--tab-selected-bg)] text-[var(--tab-selected-text)] [border-bottom-color:var(--tab-selected-border)] font-bold [--tab-shift:-1px]"
        : "bg-[var(--tab-enabled-bg)] text-[var(--tab-enabled-text)] [border-bottom-color:transparent] font-light hover:bg-[var(--tab-hover-bg)] hover:[border-bottom-color:var(--tab-hover-border)] hover:[--tab-shift:-1px] active:bg-[var(--tab-active-bg)] active:[border-bottom-color:var(--tab-active-border)] active:[--tab-shift:-1px]",
      className
    )}
    style={{
      ["--tab-selected-bg" as string]: tone.selectedBg,
      ["--tab-selected-border" as string]: tone.selectedBorder,
      ["--tab-selected-text" as string]: tone.selectedText,
      ["--tab-enabled-bg" as string]: tone.enabledBg,
      ["--tab-enabled-text" as string]: tone.enabledText,
      ["--tab-hover-bg" as string]: tone.hoverBg,
      ["--tab-hover-border" as string]: tone.hoverBorder,
      ["--tab-active-bg" as string]: tone.activeBg,
      ["--tab-active-border" as string]: tone.activeBorder,
    }}
    {...props}
  >
    <span
      className={cn(
        "inline-flex h-full translate-y-[var(--tab-shift)] items-center leading-4 transition-transform duration-200 ease-out"
      )}
    >
      {children}
    </span>
  </button>
);
