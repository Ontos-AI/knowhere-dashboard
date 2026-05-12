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
import { ThemeSwitch } from "@components/ui/theme-switch";
import { cn } from "@lib/utils";
import { setCookie } from "@utils/cookies";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
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

const SIDEBAR_BRAND_WIDTH = "120px";

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
      <KnowhereBrand className="w-[120px]" priority sizes={SIDEBAR_BRAND_WIDTH} tone="auto" />
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
        src="/images/knowhere/logo-icon.png"
        alt=""
        aria-hidden
        width={92}
        height={84}
        priority
        className="h-[20.36px] w-[22.4px] shrink-0 object-contain opacity-80"
      />
      <span className="font-[family-name:var(--font-brand)] text-base font-medium leading-[21px] text-[#09090b] dark:text-[#fafafa]">
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
    <div className="flex h-full min-w-0 w-full flex-col bg-[#f4f4f5] text-[#09090b] dark:bg-[#27272a] dark:text-[#fafafa]">
      <div className="flex h-16 items-center border-b border-[#d4d4d8] px-[18px] dark:border-[#3f3f46] lg:border-b-0 lg:px-4">
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
                "relative flex items-center gap-1.5 overflow-hidden border-b px-4 text-[12px] font-normal leading-4 tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25 focus-visible:ring-inset lg:h-9",
                isActive
                  ? "h-7 border-[#7f22fe] bg-[#8e51ff] text-[#f5f3ff] shadow-[inset_-8px_0_0_#7f22fe] lg:h-9"
                  : "h-8 border-[#e5e7eb] text-[#09090b] dark:border-[#3f3f46] dark:text-[#fafafa] lg:h-9"
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
            className="group flex h-[63px] w-full items-center gap-3 border-t border-[#e4e4e7] px-[18px] text-left transition-colors hover:bg-[#f4f4f5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25 focus-visible:ring-inset dark:border-[#3f3f46] dark:hover:bg-[#3f3f46] lg:px-4"
          >
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f59e0b]/15 bg-cover bg-center text-sm font-semibold text-[#a65f00]"
              style={{
                backgroundImage: user.image ? `url(${user.image})` : undefined,
              }}
            >
              {!user.image ? user.name?.charAt(0).toUpperCase() || "U" : null}
            </div>
            <div className="flex min-w-0 flex-1 flex-col justify-center text-[#09090b] dark:text-[#fafafa] lg:max-w-[80px]">
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-5">
                {user.name}
              </div>
              <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-4 text-[#09090b] dark:text-[#d4d4d8]">
                {user.email}
              </div>
            </div>
            <span className="ml-auto flex size-6 shrink-0 items-center justify-center rounded-full transition-colors group-hover:bg-white group-focus-visible:bg-white dark:group-hover:bg-[#52525c] dark:group-focus-visible:bg-[#52525c]">
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
          className="w-[236px] rounded-none border-[#e4e4e7] bg-white p-0 shadow-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-2px_rgba(0,0,0,0.05)] dark:border-[#3f3f46] dark:bg-[#18181b]"
        >
          <DropdownMenuItem
            asChild
            className="flex h-[52px] items-center gap-4 rounded-none bg-[#fafafa] px-5 py-4 text-[14px] font-normal leading-5 text-[#09090b] outline-none data-[highlighted]:bg-[#fafafa] data-[highlighted]:text-[#09090b] dark:bg-[#27272a] dark:text-[#fafafa] dark:data-[highlighted]:bg-[#27272a] dark:data-[highlighted]:text-[#fafafa]"
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
            className="flex h-[52px] items-center gap-4 rounded-none px-5 py-4 text-[14px] font-normal leading-5 text-[#09090b] outline-none data-[highlighted]:bg-[#fafafa] data-[highlighted]:text-[#09090b] dark:text-[#fafafa] dark:data-[highlighted]:bg-[#27272a] dark:data-[highlighted]:text-[#fafafa]"
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
  const { resolvedTheme, setTheme } = useTheme();

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
    <div className="flex h-full min-w-0 w-full flex-col bg-[#f4f4f5] text-[#09090b] dark:bg-[#27272a] dark:text-[#fafafa]">
      <div className="flex h-12 items-center border-b border-[#d4d4d8] px-3 dark:border-[#3f3f46]">
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
                "relative flex h-12 items-center gap-[10px] overflow-hidden border-b p-3 text-[14px] font-normal leading-5 tracking-normal transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#8e51ff]/25 focus-visible:ring-inset",
                isActive
                  ? "border-[#7f22fe] bg-[#8e51ff] text-[#f5f3ff] shadow-[inset_-8px_0_0_#7f22fe]"
                  : "border-[#e5e7eb] text-[#09090b] dark:border-[#3f3f46] dark:text-[#fafafa]"
              )}
            >
              <SidebarNavIcon icon={item.icon} isActive={isActive} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="w-full border-y border-[#e4e4e7] bg-white pb-20 dark:border-[#3f3f46] dark:bg-[#18181b]">
        {mobileLocaleOrder.map((localeKey) => (
          <button
            key={localeKey}
            type="button"
            className="flex h-12 w-full items-center justify-between border-b border-[#f4f4f5] px-3 text-left dark:border-[#3f3f46]"
            onClick={() => void handleLocaleChange(localeKey)}
          >
            <span className="text-[14px] font-medium leading-5 text-black dark:text-[#fafafa]">
              {localeLabels[localeKey]}
            </span>
            <KnowhereIcon
              name="check"
              className={cn(
                "size-[19px] text-[#00c950] transition-opacity",
                locale === localeKey ? "opacity-100" : "opacity-0"
              )}
            />
          </button>
        ))}

        <div className="flex h-12 items-center justify-between border-b border-[#e4e4e7] px-3 dark:border-[#3f3f46]">
          <span className="flex-1 text-[14px] font-medium leading-5 text-black dark:text-[#fafafa]">
            Theme
          </span>
          <ThemeSwitch
            checked={resolvedTheme === "dark"}
            onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
            aria-label="Toggle theme"
            className="bg-[#7f22fe] shadow-none data-[state=checked]:bg-[#7f22fe] data-[state=unchecked]:bg-[#7f22fe] focus-visible:ring-0"
          />
        </div>
      </div>

      <div className="flex h-[63px] items-center gap-3 border-t border-[#e4e4e7] px-3 dark:border-[#3f3f46]">
        <div
          className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#f59e0b]/15 bg-cover bg-center text-sm font-semibold text-[#a65f00]"
          style={{
            backgroundImage: user.image ? `url(${user.image})` : undefined,
          }}
        >
          {!user.image ? user.name?.charAt(0).toUpperCase() || "U" : null}
        </div>
        <div className="flex min-w-0 flex-1 flex-col justify-center">
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium leading-5 text-[#09090b] dark:text-[#fafafa]">
            {user.name}
          </div>
          <div className="overflow-hidden text-ellipsis whitespace-nowrap text-[12px] leading-4 text-[#09090b] dark:text-[#d4d4d8]">
            {user.email}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="flex h-10 w-full items-center justify-center gap-2 border-t border-[#e4e4e7] px-3 text-[#71717b] transition-colors hover:bg-white dark:border-[#3f3f46] dark:text-[#d4d4d8] dark:hover:bg-[#18181b]"
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
            "border-r border-[#d4d4d8] bg-[#f4f4f5] p-0 text-[#09090b] dark:border-[#3f3f46] dark:bg-[#27272a] dark:text-[#fafafa] [&>button]:hidden"
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
          "fixed inset-y-0 left-0 z-40 hidden border-r border-[#d4d4d8] bg-[#f4f4f5] dark:border-[#3f3f46] dark:bg-[#27272a] sm:flex"
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
