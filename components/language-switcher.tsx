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
        className={[
          "w-[200px] rounded-none border-[#e4e4e7] bg-white p-0 shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]",
          contentClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        {menuItems.map((menuLocale) => {
          const isActive = locale === menuLocale;

          return (
            <DropdownMenuItem
              key={menuLocale}
              className="flex h-12 items-center justify-between rounded-none border-b border-[#f4f4f5] px-5 py-3 text-[16px] font-normal leading-6 text-black outline-none transition-colors last:border-b-0 data-[highlighted]:bg-[#fafafa] data-[highlighted]:text-black"
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
