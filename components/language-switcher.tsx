"use client";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { setCookie } from "@utils/cookies";
import { ChevronDown, Languages } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

type LanguageSwitcherProps = {
  align?: "start" | "center" | "end";
  children?: React.ReactNode;
  contentClassName?: string;
  side?: "top" | "right" | "bottom" | "left";
  sideOffset?: number;
};

const triggerLocaleLabels = {
  en: "English",
  zh: "中文",
} as const;

const menuLocaleLabels = {
  en: "English",
  zh: "简体中文",
} as const;

const menuItems: Array<keyof typeof menuLocaleLabels> = ["zh", "en"];

const dashboardMenuContentClassName =
  "w-[200px] rounded-none border-[#bbbcb3] bg-white p-0 shadow-[0_4px_6px_-1px_rgba(8,59,58,0.12)] dark:border-[#156462] dark:bg-[#083b3a]";

const dashboardMenuItemClassName =
  "flex h-12 items-center justify-between rounded-none border-b border-[#f3f5ea] px-5 py-3 text-[16px] font-normal leading-6 text-[#083b3a] outline-none transition-colors last:border-b-0 data-[highlighted]:bg-[#f3f5ea] data-[highlighted]:text-[#083b3a] dark:border-[#156462] dark:text-[#f0f2e6] dark:data-[highlighted]:bg-[#073231] dark:data-[highlighted]:text-[#f0f2e6]";

const chromeMenuItemClassName =
  "flex min-h-11 items-center justify-between rounded-[2px] px-2.5 py-2 text-[14px] font-normal leading-5 text-inherit data-[highlighted]:bg-black/[0.03] data-[highlighted]:text-inherit focus:bg-black/[0.03] focus:text-inherit";

export const LanguageSwitcher = ({
  align = "end",
  children,
  contentClassName,
  side = "bottom",
  sideOffset = 4,
}: LanguageSwitcherProps) => {
  const locale = useLocale();
  const router = useRouter();

  const handleLocaleChange = async (nextLocale: keyof typeof menuLocaleLabels) => {
    await setCookie("NEXT_LOCALE", nextLocale);
    router.refresh();
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        {children ?? (
          <Button variant="ghost" size="sm" className="h-8 gap-2">
            <Languages className="h-4 w-4" />
            <span className="text-sm font-medium">
              {triggerLocaleLabels[locale as keyof typeof triggerLocaleLabels] || "English"}
            </span>
            <ChevronDown className="h-4 w-4" />
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align={align}
        side={side}
        sideOffset={sideOffset}
        className={contentClassName ?? dashboardMenuContentClassName}
      >
        {menuItems.map((menuLocale) => {
          const isActive = locale === menuLocale;

          return (
            <DropdownMenuItem
              key={menuLocale}
              aria-checked={isActive}
              className={contentClassName ? chromeMenuItemClassName : dashboardMenuItemClassName}
              onSelect={() => {
                void handleLocaleChange(menuLocale);
              }}
            >
              <span>{menuLocaleLabels[menuLocale]}</span>
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
