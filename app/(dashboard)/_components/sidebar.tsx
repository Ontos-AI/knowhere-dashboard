"use client";

import { KnowhereBrand } from "@components/brand/knowhere-brand";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@components/ui/sheet";
import { cn } from "@lib/utils";
import { setCookie } from "@utils/cookies";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { type AuthUser, useAuth } from "@/hooks/use-auth";

type SidebarProps = {
  user: AuthUser;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

type NavigationItem = {
  href: string;
  icon: {
    height: number;
    src: string;
    width: number;
    x: number;
    y: number;
  };
  label: string;
};

const SIDEBAR_SHEET_WIDTH_CLASS = "w-[160px] min-w-[160px] max-w-[160px]";
const SIDEBAR_STATIC_WIDTH_CLASS =
  "sm:w-[160px] sm:min-w-[160px] sm:max-w-[160px] lg:w-[200px] lg:min-w-[200px] lg:max-w-[200px]";

const SIDEBAR_BRAND_WIDTH = "112px";

const localeLabels = {
  en: "English",
  zh: "中文",
} as const;

const mobileLocaleOrder: Array<keyof typeof localeLabels> = ["zh", "en"];

const getNavigation = (labels: {
  usage: string;
  apiKeys: string;
  webhooks: string;
  settings: string;
}): NavigationItem[] => [
  {
    href: "/usage",
    icon: {
      src: "/icons/sidebar/usage.svg",
      x: 3.33,
      y: 3.33,
      width: 13.33,
      height: 13.33,
    },
    label: labels.usage,
  },
  {
    href: "/api-keys",
    icon: {
      src: "/icons/sidebar/api-keys.svg",
      x: 1.67,
      y: 5.83,
      width: 17.32,
      height: 8.33,
    },
    label: labels.apiKeys,
  },
  {
    href: "/webhooks/secrets",
    icon: {
      src: "/icons/sidebar/webhooks.svg",
      x: 2.08,
      y: 2.08,
      width: 15.83,
      height: 15,
    },
    label: labels.webhooks,
  },
  {
    href: "/settings",
    icon: {
      src: "/icons/sidebar/settings.svg",
      x: 2.71,
      y: 2.5,
      width: 14.57,
      height: 15,
    },
    label: labels.settings,
  },
];

const SidebarBrand = ({ onNavigate }: { onNavigate?: () => void }) => {
  return (
    <Link href="/" aria-label="Knowhere" className="inline-flex items-center" onClick={onNavigate}>
      <KnowhereBrand className="w-[112px]" priority sizes={SIDEBAR_BRAND_WIDTH} tone="auto" />
    </Link>
  );
};

const MobileSidebarBrand = ({ onNavigate }: { onNavigate?: () => void }) => {
  return (
    <Link
      href="/"
      aria-label="Knowhere"
      className="inline-flex items-center gap-3"
      onClick={onNavigate}
    >
      <Image
        src="/images/site-chrome/knowhere-mark.svg"
        alt=""
        aria-hidden
        width={45}
        height={42}
        priority
        unoptimized
        className="h-[21px] w-[22.5px] shrink-0 object-contain opacity-80 dark:invert"
      />
      <span className="font-[family-name:var(--font-brand)] text-base font-medium leading-[21px] text-[#083b3a] dark:text-[#f0f2e6]">
        Knowhere
      </span>
    </Link>
  );
};

const SidebarNavIcon = ({
  icon,
  isActive,
}: {
  icon: NavigationItem["icon"];
  isActive: boolean;
}) => {
  return (
    <span aria-hidden="true" className="relative block size-5 shrink-0">
      <Image
        src={icon.src}
        alt=""
        aria-hidden
        width={icon.width}
        height={icon.height}
        className={cn(
          "absolute block transition-[filter]",
          isActive ? "brightness-0 invert" : "brightness-0 dark:invert"
        )}
        style={{
          left: `${icon.x}px`,
          top: `${icon.y}px`,
          width: `${icon.width}px`,
          height: `${icon.height}px`,
        }}
      />
    </span>
  );
};

const DashboardSidebarContent = ({
  user,
  onNavigate,
  onLogout,
}: {
  user: AuthUser;
  onNavigate?: () => void;
  onLogout: () => Promise<void>;
}) => {
  const pathname = usePathname();
  const t = useTranslations("Common");

  const navigation = getNavigation({
    usage: t("usage"),
    apiKeys: t("apiKeys"),
    webhooks: t("webhooks"),
    settings: t("settings"),
  });

  return (
    <div className="flex h-full min-w-0 w-full flex-col bg-[#f3f5ea] font-sans text-[#083b3a] dark:bg-[#073231] dark:text-[#f0f2e6]">
      <div className="flex h-16 items-center border-b border-[#bbbcb3] px-[18px] dark:border-[#156462] lg:border-b-0 lg:px-4">
        <SidebarBrand onNavigate={onNavigate} />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex items-center gap-1.5 overflow-hidden border-b px-4 text-[12px] font-normal leading-4 tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a88b]/25 focus-visible:ring-inset lg:h-9",
                isActive
                  ? "h-7 border-[#0a6351] bg-[#19a88b] text-[#f0f2e6] shadow-[inset_-8px_0_0_#0a6351] lg:h-9"
                  : "h-8 border-[#bbbcb3] text-[#083b3a] dark:border-[#156462] dark:text-[#f0f2e6] lg:h-9"
              )}
            >
              <SidebarNavIcon icon={item.icon} isActive={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="group flex h-[63px] w-full items-center gap-3 border-t border-[#bbbcb3] px-[18px] text-left transition-colors hover:bg-[#f3f5ea] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a88b]/25 focus-visible:ring-inset dark:border-[#156462] dark:hover:bg-[#042626] lg:px-4"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#19a88b]/15 bg-cover bg-center text-sm font-semibold text-[#0a6351]"
              style={{
                backgroundImage: user.image ? `url(${user.image})` : undefined,
              }}
            >
              {!user.image ? user.name?.charAt(0).toUpperCase() || "U" : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center text-[#083b3a] dark:text-[#f0f2e6] lg:max-w-[80px]">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-5">
                {user.name}
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-4 text-[#083b3a] dark:text-[#bbbcb3]">
                {user.email}
              </div>
            </div>
            <span className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-white group-focus-visible:bg-white dark:group-hover:bg-[#042626] dark:group-focus-visible:bg-[#042626]">
              <Image
                src="/icons/sidebar/footer-expand-all.svg"
                alt=""
                aria-hidden
                width={8}
                height={13.33}
                className="block h-[13.33px] w-2 dark:invert"
              />
            </span>
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          side="top"
          sideOffset={8}
          className="w-[236px] rounded-none border-[#bbbcb3] bg-card p-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] dark:border-[#156462] dark:bg-[#083b3a]"
        >
          <DropdownMenuItem
            asChild
            className="flex h-[52px] items-center gap-4 rounded-none bg-[#f0f2e6] px-5 py-4 text-[14px] font-normal leading-5 text-[#083b3a] outline-none data-[highlighted]:bg-[#f0f2e6] data-[highlighted]:text-[#083b3a] dark:bg-[#073231] dark:text-[#f0f2e6] dark:data-[highlighted]:bg-[#073231] dark:data-[highlighted]:text-[#f0f2e6]"
          >
            <Link href="/settings" onClick={onNavigate} className="cursor-pointer">
              <Image
                src="/icons/sidebar/footer-settings.svg"
                alt=""
                aria-hidden
                width={20}
                height={20}
                className="size-5 shrink-0 dark:invert"
              />
              {t("settings")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem
            className="flex h-[52px] items-center gap-4 rounded-none px-5 py-4 text-[14px] font-normal leading-5 text-[#083b3a] outline-none data-[highlighted]:bg-[#f0f2e6] data-[highlighted]:text-[#083b3a] dark:text-[#f0f2e6] dark:data-[highlighted]:bg-[#073231] dark:data-[highlighted]:text-[#f0f2e6]"
            onClick={async () => {
              await onLogout();
            }}
          >
            <Image
              src="/icons/sidebar/footer-sign-out.svg"
              alt=""
              aria-hidden
              width={20}
              height={20}
              className="size-5 shrink-0 dark:invert"
            />
            {t("logout")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

const MobileSidebarContent = ({
  user,
  onNavigate,
  onLogout,
}: {
  user: AuthUser;
  onNavigate?: () => void;
  onLogout: () => Promise<void>;
}) => {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Common");
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const navigation = getNavigation({
    usage: t("usage"),
    apiKeys: t("apiKeys"),
    webhooks: t("webhooks"),
    settings: t("settings"),
  });

  const handleLocaleChange = async (nextLocale: keyof typeof localeLabels) => {
    await setCookie("NEXT_LOCALE", nextLocale);
    onNavigate?.();
    router.refresh();
  };

  return (
    <div className="flex h-full min-w-0 w-full flex-col bg-[#f3f5ea] font-sans text-[#083b3a] dark:bg-[#073231] dark:text-[#f0f2e6]">
      <div className="flex h-12 items-center border-b border-[#bbbcb3] px-3 dark:border-[#156462]">
        <MobileSidebarBrand onNavigate={onNavigate} />
      </div>

      <nav className="flex min-h-0 flex-1 flex-col">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onNavigate}
              aria-current={isActive ? "page" : undefined}
              className={cn(
                "relative flex h-12 items-center gap-[10px] overflow-hidden border-b p-3 text-[14px] font-normal leading-5 tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#19a88b]/25 focus-visible:ring-inset",
                isActive
                  ? "border-[#0a6351] bg-[#19a88b] text-[#f0f2e6] shadow-[inset_-8px_0_0_#0a6351]"
                  : "border-[#bbbcb3] text-[#083b3a] dark:border-[#156462] dark:text-[#f0f2e6]"
              )}
            >
              <SidebarNavIcon icon={item.icon} isActive={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="w-full border-y border-[#bbbcb3] bg-white pb-20 dark:border-[#156462] dark:bg-[#083b3a]">
        {mobileLocaleOrder.map((localeKey) => (
          <button
            key={localeKey}
            type="button"
            className="flex h-12 w-full items-center justify-between border-b border-[#f3f5ea] px-3 text-left dark:border-[#156462]"
            onClick={() => void handleLocaleChange(localeKey)}
          >
            <span className="text-[14px] font-medium leading-5 text-[#083b3a] dark:text-[#f0f2e6]">
              {localeLabels[localeKey]}
            </span>
            <KnowhereIcon
              name="check"
              className={cn(
                "size-[19px] text-[#19a88b] transition-opacity",
                locale === localeKey ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        ))}

        {(["light", "dark", "system"] as const).map((menuTheme) => {
          const isActive = mounted && theme === menuTheme;
          const menuLabels = {
            light: t("themeLight"),
            dark: t("themeDark"),
            system: t("themeSystem"),
          } as const;

          return (
            <button
              key={menuTheme}
              type="button"
              className="flex h-12 w-full items-center justify-between border-b border-[#f3f5ea] px-3 text-left last:border-b-0 dark:border-[#156462]"
              onClick={() => setTheme(menuTheme)}
            >
              <span className="text-[14px] font-medium leading-5 text-[#083b3a] dark:text-[#f0f2e6]">
                {menuLabels[menuTheme]}
              </span>
              <KnowhereIcon
                name="check"
                className={cn(
                  "size-[19px] text-[#19a88b] transition-opacity",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />
            </button>
          );
        })}
      </div>

      <div className="flex h-[63px] items-center gap-3 border-t border-[#bbbcb3] px-3 dark:border-[#156462]">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#19a88b]/15 bg-cover bg-center text-sm font-semibold text-[#0a6351]"
          style={{
            backgroundImage: user.image ? `url(${user.image})` : undefined,
          }}
        >
          {!user.image ? user.name?.charAt(0).toUpperCase() || "U" : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-5 text-[#083b3a] dark:text-[#f0f2e6]">
            {user.name}
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-4 text-[#083b3a] dark:text-[#bbbcb3]">
            {user.email}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2 border-t border-[#bbbcb3] px-3 text-[#595a55] transition-colors hover:bg-white dark:border-[#156462] dark:text-[#bbbcb3] dark:hover:bg-[#083b3a]"
        onClick={async () => {
          await onLogout();
        }}
      >
        <Image
          src="/icons/sidebar/footer-sign-out.svg"
          alt=""
          aria-hidden
          width={16}
          height={16}
          className="size-4 opacity-45 dark:invert"
        />
        <span className="text-[12px] font-normal leading-4">{t("logout")}</span>
      </button>
    </div>
  );
};

export function Sidebar({ user, open, onOpenChange }: SidebarProps) {
  const { logout } = useAuth();

  const handleClose = () => onOpenChange(false);

  const handleLogout = async () => {
    await logout();
    handleClose();
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent
          side="left"
          className={cn(
            SIDEBAR_SHEET_WIDTH_CLASS,
            "border-r border-[#bbbcb3] bg-[#f3f5ea] p-0 text-[#083b3a] dark:border-[#156462] dark:bg-[#073231] dark:text-[#f0f2e6] [&>button]:hidden"
          )}
        >
          <SheetHeader className="sr-only">
            <SheetTitle>Sidebar</SheetTitle>
            <SheetDescription>Dashboard navigation</SheetDescription>
          </SheetHeader>
          <MobileSidebarContent user={user} onNavigate={handleClose} onLogout={handleLogout} />
        </SheetContent>
      </Sheet>

      <aside
        className={cn(
          SIDEBAR_STATIC_WIDTH_CLASS,
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[#bbbcb3] bg-[#f3f5ea] dark:border-[#156462] dark:bg-[#073231] sm:flex"
        )}
      >
        <div className="flex h-full w-full lg:hidden">
          <DashboardSidebarContent user={user} onLogout={handleLogout} />
        </div>
        <div className="hidden h-full w-full lg:flex">
          <DashboardSidebarContent user={user} onLogout={handleLogout} />
        </div>
      </aside>
    </>
  );
}
