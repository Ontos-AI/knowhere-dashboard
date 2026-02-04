"use client";

import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { setCookie } from "@utils/cookies";
import { Languages } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();

  const localeLabels = {
    en: "English",
    zh: "中文",
  };

  const switchLocale = async (newLocale: string) => {
    // Set cookie using Cookie Store API with fallback
    await setCookie("NEXT_LOCALE", newLocale);
    // Refresh page
    router.refresh();
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2">
          <Languages className="h-4 w-4" />
          <span className="text-sm font-medium">
            {localeLabels[locale as keyof typeof localeLabels] || "English"}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem
          onClick={() => switchLocale("en")}
          className={`cursor-pointer ${locale === "en" ? "bg-muted" : ""}`}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => switchLocale("zh")}
          className={`cursor-pointer ${locale === "zh" ? "bg-muted" : ""}`}
        >
          中文
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
