"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { LandingThemeToggle } from "@app/(landing)/_components/landing-theme-toggle";
import { LandingTrackedLink } from "@app/(landing)/_components/landing-tracked-link";
import { LanguageSwitcher } from "@components/language-switcher";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { useActiveSection } from "@hooks/use-active-section";
import { cn } from "@lib/utils";
import Link from "next/link";
import { useLocale, useTranslations } from "next-intl";
import { type ReactNode, useState } from "react";

const landingHeaderCanvasWidthClassName =
  "mx-auto grid h-12 w-full grid-cols-[148px_minmax(0,1fr)_88px] min-[640px]:grid-cols-[148px_minmax(0,1fr)_88px] min-[640px]:h-16 min-[768px]:max-w-[768px] min-[769px]:max-w-[1280px] min-[769px]:grid-cols-[152px_minmax(0,1fr)_88px]";

type LandingNavItem = {
  href: string;
  labelKey: "docs" | "github";
  external?: boolean;
};

const landingNavItems: LandingNavItem[] = [
  { href: "https://docs.knowhereto.ai/", labelKey: "docs", external: true },
  { href: "/github", labelKey: "github" },
];

const localeLabels = {
  en: "English",
  zh: "中文",
} as const;

const landingNavCtaIds: Record<LandingNavItem["labelKey"], string> = {
  docs: "docs",
  github: "github",
};

const LandingHeaderLink = ({
  href,
  label,
  children,
  active = false,
  external = false,
  ctaId,
  sourceSection,
}: {
  href: string;
  label: string;
  children: ReactNode;
  active?: boolean;
  external?: boolean;
  ctaId: string;
  sourceSection: string;
}) => (
  <LandingTrackedLink
    aria-current={active ? "location" : undefined}
    className={cn(
      "group relative flex h-16 shrink-0 items-center justify-center px-4 text-[14px] leading-5 text-zinc-950 max-[639px]:h-12 dark:text-[#fafafa]",
      active
        ? "font-semibold opacity-100"
        : "font-normal opacity-100 transition-opacity duration-150 ease-out hover:opacity-60 active:opacity-100 active:font-medium"
    )}
    ctaId={ctaId}
    external={external}
    href={href}
    sourceSection={sourceSection}
  >
    <span
      data-label={label}
      className={cn(
        "relative inline-grid",
        "before:invisible before:col-start-1 before:row-start-1 before:font-semibold before:content-[attr(data-label)]",
        "after:pointer-events-none after:absolute after:bottom-[2px] after:left-0 after:h-px after:w-full after:bg-current after:content-['']",
        "after:origin-left after:transition-transform after:duration-200 after:ease-out",
        active
          ? "after:scale-x-100 after:opacity-100"
          : "after:scale-x-0 after:opacity-100 group-hover:after:scale-x-100 group-hover:after:opacity-60 group-active:after:scale-x-100 group-active:after:opacity-100"
      )}
    >
      <span
        className={cn(
          "col-start-1 row-start-1",
          "transition-[font-weight,opacity] duration-150 ease-out",
          active ? "font-semibold opacity-100" : "font-normal opacity-100 group-hover:opacity-60"
        )}
      >
        {children}
      </span>
    </span>
  </LandingTrackedLink>
);

export const LandingHeader = () => {
  const activeSection = useActiveSection({
    ids: [],
  });
  const locale = useLocale();
  const t = useTranslations("Landing.header");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLocaleLabel = localeLabels[locale as keyof typeof localeLabels] ?? "English";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-white dark:border-[#3f3f46] dark:bg-[#18181b]">
      <div className={cn(landingHeaderCanvasWidthClassName, "relative")}>
        <div className="flex h-full items-center border-r border-zinc-200 px-4 dark:border-[#3f3f46] min-[640px]:px-[14px] min-[769px]:border-l min-[769px]:px-4">
          <Link href="/" className="flex items-center">
            <LandingBrand size="nav" />
          </Link>
        </div>

        <div className="flex min-w-0 items-center justify-between pl-2 min-[769px]:border-x min-[769px]:border-zinc-200 min-[769px]:dark:border-[#3f3f46]">
          <nav className="hidden h-full min-w-0 items-center overflow-x-auto min-[640px]:flex">
            {landingNavItems.map((item) => {
              const targetSection = item.href.startsWith("#") ? item.href.slice(1) : null;
              const label = t(`nav.${item.labelKey}`);

              return (
                <LandingHeaderLink
                  key={item.labelKey}
                  active={targetSection === activeSection}
                  ctaId={landingNavCtaIds[item.labelKey]}
                  external={item.external}
                  href={item.href}
                  label={label}
                  sourceSection="header"
                >
                  {label}
                </LandingHeaderLink>
              );
            })}
          </nav>
          <LanguageSwitcher align="end" contentClassName="mt-0" sideOffset={0}>
            <button
              type="button"
              className="hidden h-full items-center gap-1 pl-4 pr-3 text-xs leading-4 text-zinc-950 transition-colors hover:text-zinc-600 dark:text-[#fafafa] dark:hover:text-[#d4d4d8] min-[768px]:flex"
            >
              <span>{currentLocaleLabel}</span>
              <KnowhereIcon className="size-5 text-current" name="chevron-down" />
            </button>
          </LanguageSwitcher>
        </div>

        <div className="flex h-full items-center justify-center border-l border-zinc-200 dark:border-[#3f3f46] min-[769px]:border-l-0">
          <LandingThemeToggle className="h-full w-11 text-zinc-950 hover:text-zinc-600 dark:text-[#fafafa] dark:hover:text-[#d4d4d8] min-[640px]:w-[72px]" />
          <button
            aria-expanded={mobileMenuOpen}
            aria-haspopup="menu"
            aria-label={t("openNavigationMenu")}
            className="flex h-full w-11 items-center justify-center text-zinc-950 transition-colors hover:bg-zinc-100/70 hover:text-zinc-600 dark:text-[#fafafa] dark:hover:bg-[#27272a] dark:hover:text-[#d4d4d8] min-[640px]:hidden"
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            <KnowhereIcon className="h-[14px] w-[14px] text-current" name="menu" />
          </button>
        </div>

        {mobileMenuOpen ? (
          <nav className="absolute top-full right-0 left-0 z-40 flex w-full flex-col border-b border-zinc-200 bg-white dark:border-[#3f3f46] dark:bg-[#18181b] min-[640px]:hidden">
            <LanguageSwitcher align="end" contentClassName="mt-0" sideOffset={0}>
              <button
                type="button"
                className="flex h-12 w-full items-center justify-between border-t border-zinc-200 px-4 text-sm text-zinc-950 transition-colors hover:bg-zinc-100/70 dark:border-[#3f3f46] dark:text-[#fafafa] dark:hover:bg-[#27272a]"
              >
                <span>{currentLocaleLabel}</span>
                <KnowhereIcon className="size-5 text-current" name="chevron-down" />
              </button>
            </LanguageSwitcher>
            {landingNavItems.map((item) => {
              const targetSection = item.href.startsWith("#") ? item.href.slice(1) : null;
              const label = t(`nav.${item.labelKey}`);

              return (
                <LandingTrackedLink
                  key={`mobile-${item.labelKey}`}
                  aria-current={targetSection === activeSection ? "location" : undefined}
                  className={cn(
                    "flex h-12 w-full items-center border-t border-zinc-200 px-4 text-sm text-zinc-950 transition-colors hover:bg-zinc-100/70 dark:border-[#3f3f46] dark:text-[#fafafa] dark:hover:bg-[#27272a]",
                    targetSection === activeSection ? "font-semibold" : "font-normal"
                  )}
                  ctaId={landingNavCtaIds[item.labelKey]}
                  external={item.external}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  sourceSection="header_mobile"
                >
                  {label}
                </LandingTrackedLink>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
};
