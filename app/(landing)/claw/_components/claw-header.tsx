"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { LandingThemeToggle } from "@app/(landing)/_components/landing-theme-toggle";
import {
  LandingTrackedLink,
  trackLandingInteraction,
} from "@app/(landing)/_components/landing-tracked-link";
import { type ClawNavItem, clawNavItems } from "@app/(landing)/claw/_components/claw-content";
import { clawHeaderDesign } from "@app/(landing)/claw/_components/claw-header-design";
import { LanguageSwitcher } from "@components/language-switcher";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { useActiveSection } from "@hooks/use-active-section";
import { cn } from "@lib/utils";
import Link from "next/link";
import { useLocale } from "next-intl";
import { useState } from "react";

type ClawHeaderProps = {
  navItems?: ClawNavItem[];
  showUtilityControls?: boolean;
};

const getNavItemSectionId = (item: ClawNavItem) => {
  return item.href.startsWith("#") ? item.href.slice(1) : null;
};

const getClawNavCtaId = (item: ClawNavItem) => {
  const sectionId = getNavItemSectionId(item);
  if (item.isExternal && item.label === "Docs") {
    return "docs";
  }
  return sectionId ? `claw_nav_${sectionId}` : "claw_nav_link";
};

const localeLabels = {
  en: "English",
  zh: "中文",
} as const;

export const ClawHeader = ({
  navItems = clawNavItems,
  showUtilityControls = false,
}: ClawHeaderProps) => {
  const activeSection = useActiveSection({
    ids: navItems
      .map((item) => getNavItemSectionId(item))
      .filter((sectionId): sectionId is string => sectionId !== null),
  });
  const locale = useLocale();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const currentLocaleLabel = localeLabels[locale as keyof typeof localeLabels] ?? "English";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e4e4e7] bg-white">
      <div
        className={cn(
          "relative mx-auto grid h-12 w-full",
          showUtilityControls
            ? "grid-cols-[148px_minmax(0,1fr)_88px] min-[640px]:grid-cols-[148px_minmax(0,1fr)_220px] min-[768px]:max-[768px]:grid-cols-[152px_minmax(0,1fr)_224px] min-[769px]:grid-cols-[152px_minmax(0,1fr)_224px]"
            : "grid-cols-[128px_minmax(0,1fr)_48px] min-[640px]:grid-cols-[128px_minmax(0,1fr)_128px] min-[640px]:max-[767px]:grid-cols-[148px_minmax(0,1fr)_152px] min-[768px]:max-[768px]:grid-cols-[148px_minmax(0,1fr)_152px] min-[769px]:grid-cols-[152px_minmax(0,1fr)_152px]",
          "min-[640px]:max-[767px]:h-16 min-[768px]:max-[768px]:h-16 min-[769px]:h-16 min-[769px]:max-w-[1280px]"
        )}
      >
        <div className="flex h-full items-center border-r border-[#e4e4e7] px-4 min-[640px]:max-[767px]:px-[14px] min-[768px]:max-[768px]:px-[14px] min-[769px]:border-l min-[769px]:px-4">
          <Link href="/" className="flex items-center">
            <LandingBrand size="nav" />
          </Link>
        </div>
        <div className="flex min-w-0 items-center pl-2 min-[640px]:max-[767px]:justify-between min-[769px]:justify-between">
          <nav
            aria-label="Main navigation"
            className="hidden h-full min-w-0 items-center overflow-x-auto min-[640px]:flex"
          >
            {navItems.map((item) => {
              const targetSection = getNavItemSectionId(item);
              const isActive = targetSection === activeSection;

              return (
                <Link
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "group inline-flex h-full items-center justify-center px-[14px] text-[#09090b] leading-5 min-[768px]:max-[768px]:px-3",
                    "min-[640px]:max-[767px]:px-2 min-[768px]:max-[768px]:px-2",
                    isActive
                      ? "text-[14px] font-semibold opacity-100"
                      : "text-[14px] font-normal opacity-100 transition-opacity duration-150 ease-out hover:opacity-60 active:opacity-100 active:font-medium"
                  )}
                  href={item.href}
                  key={item.label}
                  onClick={() =>
                    trackLandingInteraction(getClawNavCtaId(item), "claw_header", locale, {
                      href: item.href,
                    })
                  }
                  rel={item.isExternal ? "noreferrer" : undefined}
                  target={item.isExternal ? "_blank" : undefined}
                >
                  <span
                    data-label={item.label}
                    className={cn(
                      "relative inline-grid",
                      "before:invisible before:col-start-1 before:row-start-1 before:font-semibold before:content-[attr(data-label)]",
                      "after:pointer-events-none after:absolute after:bottom-[2px] after:left-0 after:h-px after:w-full after:bg-current after:content-['']",
                      "after:origin-left after:transition-transform after:duration-200 after:ease-out",
                      isActive
                        ? "after:scale-x-100 after:opacity-100"
                        : "after:scale-x-0 after:opacity-100 group-hover:after:scale-x-100 group-hover:after:opacity-60 group-active:after:scale-x-100 group-active:after:opacity-100"
                    )}
                  >
                    <span
                      className={cn(
                        "col-start-1 row-start-1",
                        "transition-[font-weight,opacity] duration-150 ease-out",
                        isActive
                          ? "font-semibold opacity-100"
                          : "font-normal opacity-100 group-hover:opacity-60"
                      )}
                    >
                      {item.label}
                    </span>
                  </span>
                </Link>
              );
            })}
          </nav>
          {showUtilityControls ? (
            <LanguageSwitcher align="end" contentClassName="mt-0" sideOffset={0}>
              <button
                type="button"
                className="hidden h-full items-center gap-1 pl-4 pr-3 text-xs leading-4 text-[#09090b] transition-colors hover:text-[#52525c] min-[768px]:flex"
              >
                <span>{currentLocaleLabel}</span>
                <KnowhereIcon className="size-5 text-current" name="chevron-down" />
              </button>
            </LanguageSwitcher>
          ) : null}
        </div>
        <div className="flex h-full items-center justify-center border-l border-[#e4e4e7]">
          <button
            aria-expanded={mobileMenuOpen}
            aria-haspopup="menu"
            aria-label="Open site menu"
            className={cn(
              "inline-flex h-full items-center justify-center text-[#09090b] transition-colors hover:text-[#52525c] min-[640px]:hidden min-[640px]:max-[767px]:hidden",
              showUtilityControls ? "w-11" : "w-full"
            )}
            onClick={() => setMobileMenuOpen((open) => !open)}
            type="button"
          >
            <KnowhereIcon className="h-[14px] w-[14px] text-current" name="menu" />
          </button>
          {showUtilityControls ? (
            <LandingThemeToggle
              className="h-full w-11 text-[#09090b] hover:text-[#52525c] min-[640px]:w-[68px] min-[768px]:w-[72px]"
              iconClassName="size-4"
            />
          ) : null}
          <LandingTrackedLink
            className={cn(
              clawHeaderDesign.desktopCtaButton,
              showUtilityControls ? "w-[152px]" : "w-full"
            )}
            ctaId="get_api_key"
            href="/login"
            sourceSection="claw_header"
          >
            GET API KEY
          </LandingTrackedLink>
        </div>

        {mobileMenuOpen ? (
          <nav className={clawHeaderDesign.mobileMenu}>
            {navItems.map((item) => {
              const targetSection = getNavItemSectionId(item);
              const isActive = targetSection === activeSection;

              return (
                <Link
                  key={`mobile-${item.label}`}
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    clawHeaderDesign.mobileMenuItem,
                    isActive ? clawHeaderDesign.mobileMenuItemActive : "font-normal"
                  )}
                  href={item.href}
                  onClick={() => {
                    trackLandingInteraction(getClawNavCtaId(item), "claw_header_mobile", locale, {
                      href: item.href,
                    });
                    setMobileMenuOpen(false);
                  }}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  target={item.isExternal ? "_blank" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        ) : null}
      </div>
    </header>
  );
};
