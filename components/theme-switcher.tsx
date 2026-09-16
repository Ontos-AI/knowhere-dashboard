"use client";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { ChevronDown, SunMoon } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type SiteTheme = "light" | "dark" | "system";

type ThemeSwitcherProps = {
  align?: "start" | "center" | "end";
  children?: React.ReactNode;
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
};

const menuItems: SiteTheme[] = ["light", "dark", "system"];

const dashboardMenuContentClassName =
  "w-[200px] rounded-none border-[#bbbcb3] bg-white p-0 shadow-[0_4px_6px_-1px_rgba(8,59,58,0.12)] dark:border-[#156462] dark:bg-[#083b3a]";

const dashboardMenuItemClassName =
  "flex h-12 items-center justify-between rounded-none border-b border-[#f3f5ea] px-5 py-3 text-[16px] font-normal leading-6 text-[#083b3a] outline-none transition-colors last:border-b-0 data-[highlighted]:bg-[#f3f5ea] data-[highlighted]:text-[#083b3a] dark:border-[#156462] dark:text-[#f0f2e6] dark:data-[highlighted]:bg-[#073231] dark:data-[highlighted]:text-[#f0f2e6]";

const chromeMenuItemClassName =
  "flex min-h-11 items-center justify-between rounded-[2px] px-2.5 py-2 text-[14px] font-normal leading-5 text-inherit data-[highlighted]:bg-black/[0.03] data-[highlighted]:text-inherit focus:bg-black/[0.03] focus:text-inherit";

export const ThemeSwitcher = ({
  align = "end",
  children,
  contentClassName,
  side = "bottom",
  sideOffset = 4,
}: ThemeSwitcherProps) => {
  const t = useTranslations("Common");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeTheme: SiteTheme = mounted && theme ? (theme as SiteTheme) : "system";

  const menuLabels: Record<SiteTheme, string> = {
    light: t("themeLight"),
    dark: t("themeDark"),
    system: t("themeSystem"),
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="sm" className="h-8 gap-2">
            <SunMoon className="h-4 w-4" />
            <span className="text-sm font-medium">{menuLabels[activeTheme]}</span>
            <ChevronDown className="h-4 w-4" />
            <span className="sr-only">{t("toggleTheme")}</span>
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName ?? dashboardMenuContentClassName}
      >
        {menuItems.map((menuTheme) => {
          const isActive = mounted && activeTheme === menuTheme;

          return (
            <DropdownMenuItem
              key={menuTheme}
              aria-checked={isActive}
              className={contentClassName ? chromeMenuItemClassName : dashboardMenuItemClassName}
              onSelect={() => {
                setTheme(menuTheme);
              }}
            >
              <span>{menuLabels[menuTheme]}</span>
              <span className="ml-4 flex size-[19px] shrink-0 items-center justify-center">
                {isActive ? (
                  <Image
                    src="/icons/common/check-green.svg"
                    alt=""
                    aria-hidden
                    width={13.21}
                    height={9.83}
                    className="h-[9.83px] w-[13.21px]"
                  />
                ) : null}
              </span>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
