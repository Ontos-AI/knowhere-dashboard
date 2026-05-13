"use client";

import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import { useTheme } from "next-themes";
import { startTransition, useEffect, useState } from "react";

type LandingThemeToggleProps = {
  className?: string;
  iconClassName?: string;
};

export const LandingThemeToggle = ({ className, iconClassName }: LandingThemeToggleProps) => {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <button
      type="button"
      aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
      className={cn(
        "flex h-16 w-[52px] flex-none items-center justify-center text-zinc-950 transition-colors hover:text-zinc-600 dark:text-[#fafafa] dark:hover:text-[#d4d4d8]",
        className
      )}
      onClick={() => {
        startTransition(() => {
          setTheme(isDark ? "light" : "dark");
        });
      }}
    >
      <KnowhereIcon
        className={cn("size-5 text-current", iconClassName)}
        name={isDark ? "theme-light" : "theme-dark"}
      />
    </button>
  );
};
