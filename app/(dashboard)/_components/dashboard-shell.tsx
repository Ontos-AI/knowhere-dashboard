"use client";

import { Sidebar } from "@app/(dashboard)/_components/sidebar";
import { BuyCreditsModal } from "@app/(dashboard)/billing/_components/buy-credits-modal";
import { LanguageSwitcher } from "@components/language-switcher";
import { ThemeSwitcher } from "@components/theme-switcher";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import type { AuthUser } from "@hooks/use-auth";
import { useCredits } from "@hooks/use-credits";
import { trackBuyCreditsClicked } from "@lib/posthog";
import { setCookie } from "@utils/cookies";
import { Bell, Menu } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

type DashboardTitleNamespace = "ApiKeys" | "Billing" | "Settings" | "Usage" | "Webhooks";

type DashboardShellProps = {
  children: React.ReactNode;
  compactMobileHeader?: boolean;
  compactTabletHeader?: boolean;
  creditsIconSrc: string;
  isBuyCreditsOpen: boolean;
  mainClassName?: string;
  titleNamespace: DashboardTitleNamespace;
  user: AuthUser;
};

const localeLabels = {
  en: "English",
  zh: "中文",
} as const;

const formatCreditsLabel = (credits: number) => {
  return credits.toLocaleString(undefined, {
    maximumFractionDigits: 3,
  });
};

const buildBuyCreditsHref = (pathname: string, searchParams: URLSearchParams) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("buy", "true");
  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
};

const ThemeButton = () => {
  const t = useTranslations("Common");
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <ThemeSwitcher>
      <button
        type="button"
        className="flex h-12 w-12 items-center justify-center text-[#083b3a] transition-colors hover:bg-[#f3f5ea] dark:text-[#f0f2e6] dark:hover:bg-[#073231]"
        aria-label={t("toggleTheme")}
      >
        <KnowhereIcon name={isDark ? "theme-light" : "theme-dark"} className="h-[18px] w-[18px]" />
      </button>
    </ThemeSwitcher>
  );
};

const TabletActionsMenu = () => {
  const router = useRouter();
  const t = useTranslations("Common");
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex h-full w-11 items-center justify-center text-[#083b3a] transition-colors hover:bg-[#f3f5ea] dark:text-[#f0f2e6] dark:hover:bg-[#073231]"
          aria-label="Open actions"
        >
          <Menu className="h-4 w-4" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="min-w-[140px] border-[#bbbcb3]">
        <DropdownMenuItem
          onClick={() => {
            void setCookie("NEXT_LOCALE", "en").then(() => router.refresh());
          }}
        >
          English
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => {
            void setCookie("NEXT_LOCALE", "zh").then(() => router.refresh());
          }}
        >
          中文
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("light")}>{t("themeLight")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>{t("themeDark")}</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>{t("themeSystem")}</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const CreditsButton = ({
  compactTabletHeader = false,
  iconSrc,
}: {
  compactTabletHeader?: boolean;
  iconSrc: string;
}) => {
  const { data: credits } = useCredits();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const buyCreditsHref = buildBuyCreditsHref(
    pathname,
    new URLSearchParams(searchParams.toString())
  );

  return (
    <Link
      href={buyCreditsHref}
      onClick={() => trackBuyCreditsClicked("sidebar")}
      className={[
        "flex h-10 min-w-[119px] items-center justify-center bg-white font-sans text-[12px] font-semibold text-[#083b3a] shadow-none transition-transform hover:-translate-y-px dark:border-[#156462] dark:bg-[#073231] dark:text-[#f0f2e6]",
        compactTabletHeader
          ? "gap-[10px] rounded-lg border-x-2 border-t-2 border-b-[6px] border-[#bbbcb3] px-[14px] pb-1 leading-[14px] sm:min-w-[115px] sm:gap-1 sm:rounded-md sm:border-x sm:border-t sm:border-b-[4px] sm:px-3 sm:pb-[3px] sm:leading-[18px] lg:h-12 lg:min-w-[136px] lg:gap-[6px] lg:rounded-lg lg:border-x-2 lg:border-t-2 lg:border-b-[6px] lg:px-[14px] lg:pb-1 lg:text-[14px] lg:leading-5"
          : "gap-[10px] rounded-lg border-x-2 border-t-2 border-b-[6px] border-[#bbbcb3] px-[14px] pb-1 leading-[14px] sm:min-w-[115px] sm:gap-1.5 sm:px-3 sm:leading-[18px] lg:h-12 lg:min-w-[136px] lg:gap-[6px] lg:px-[14px] lg:text-[14px] lg:leading-5",
      ].join(" ")}
    >
      <Image
        src={iconSrc}
        alt=""
        aria-hidden
        width={20}
        height={20}
        className={
          compactTabletHeader ? "h-5 w-5 shrink-0 sm:h-4 sm:w-4 lg:h-5 lg:w-5" : "h-5 w-5 shrink-0"
        }
      />
      <span className="font-mono-display">{formatCreditsLabel(credits ?? 0)} Credits</span>
    </Link>
  );
};

const NotificationButton = () => {
  return (
    <button
      type="button"
      className="flex h-full w-11 items-center justify-center text-[#083b3a] transition-colors hover:bg-[#f3f5ea] dark:text-[#f0f2e6] dark:hover:bg-[#073231] lg:h-12 lg:w-12"
      aria-label="Notifications"
    >
      <Bell className="h-4 w-4" strokeWidth={1.75} />
    </button>
  );
};

export const DashboardShell = ({
  children,
  compactMobileHeader = false,
  compactTabletHeader = false,
  creditsIconSrc,
  isBuyCreditsOpen,
  mainClassName,
  titleNamespace,
  user,
}: DashboardShellProps) => {
  const t = useTranslations(titleNamespace);
  const locale = useLocale();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const mainClassNameValue: string =
    mainClassName ??
    "px-[14px] pb-[22px] pt-[22px] sm:px-[30px] sm:pb-6 sm:pt-[22px] lg:px-12 lg:pt-6";

  return (
    <div className="min-h-screen bg-[#f0f2e6] font-sans text-[#083b3a] dark:bg-[#083b3a] dark:text-[#f0f2e6]">
      <Sidebar user={user} open={mobileSidebarOpen} onOpenChange={setMobileSidebarOpen} />

      <div className="min-w-0 sm:pl-[160px] lg:pl-[200px]">
        <div className="w-full">
          <header
            className={[
              "flex items-center gap-3 border-b border-[#bbbcb3] bg-[#f0f2e6] px-4 font-sans sm:px-[30px] lg:px-12",
              "dark:border-[#156462] dark:bg-[#083b3a]",
              compactTabletHeader
                ? compactMobileHeader
                  ? "h-12 sm:h-12 lg:h-16"
                  : "h-16 sm:h-12 lg:h-16"
                : "h-16",
            ].join(" ")}
          >
            <button
              type="button"
              className="flex h-full w-11 items-center justify-center text-[#083b3a] transition-colors hover:bg-[#f3f5ea] dark:text-[#f0f2e6] dark:hover:bg-[#073231] sm:hidden"
              onClick={() => setMobileSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu className="h-4 w-4" />
            </button>
            <h1
              className={[
                "hidden min-w-0 flex-1 truncate font-sans text-lg font-medium tracking-[-0.01em] text-[#083b3a] sm:block",
                "dark:text-[#f0f2e6]",
                compactTabletHeader
                  ? "sm:text-[16px] sm:leading-[26px] lg:text-[18px] lg:leading-7"
                  : "text-[18px] leading-7",
              ].join(" ")}
            >
              {t("title")}
            </h1>
            <div className="ml-auto flex items-center sm:hidden">
              <NotificationButton />
            </div>
            <div className="hidden items-center sm:flex lg:hidden">
              <NotificationButton />
              <TabletActionsMenu />
            </div>
            <div className="hidden items-center lg:flex">
              <LanguageSwitcher>
                <button
                  type="button"
                  className="flex h-12 items-center gap-1 px-4 font-sans text-[12px] leading-4 text-[#083b3a] transition-colors hover:bg-[#f3f5ea] dark:text-[#f0f2e6] dark:hover:bg-[#073231]"
                >
                  <span>{localeLabels[locale as keyof typeof localeLabels] || "English"}</span>
                  <Image
                    src="/icons/knowhere/chevron-down.svg"
                    alt=""
                    aria-hidden
                    width={20}
                    height={20}
                    className="h-5 w-5 dark:invert"
                  />
                </button>
              </LanguageSwitcher>
              <NotificationButton />
              <ThemeButton />
            </div>
            <div className="shrink-0">
              <CreditsButton compactTabletHeader={compactTabletHeader} iconSrc={creditsIconSrc} />
            </div>
          </header>

          <main className={["flex justify-center", mainClassNameValue].join(" ")}>{children}</main>
        </div>
      </div>

      {isBuyCreditsOpen ? <BuyCreditsModal /> : null}
    </div>
  );
};
