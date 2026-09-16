"use client";

import { LandingTrackedLink } from "@app/(landing)/_components/landing-tracked-link";
import { LanguageSwitcher } from "@components/language-switcher";
import {
  GitHubIcon,
  GlobalIcon,
  ThemeMoonIcon,
  ThemeSunIcon,
} from "@components/site-chrome/header-icons";
import {
  type SiteChromePage,
  siteChromeLinks,
  siteChromeNavCtaIds,
  siteChromeNavigation,
} from "@components/site-chrome/links";
import { ThemeSwitcher } from "@components/theme-switcher";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import "@components/site-chrome/site-chrome.css";

const chromeMenuClassName =
  "kh-site kh-site-chrome-menu z-[110] w-[148px] min-w-[148px] rounded-[8px] border p-1 shadow-none bg-[var(--chrome-paper)] text-[var(--chrome-ink)]";

type SiteHeaderProps = {
  page?: SiteChromePage;
};

export const SiteHeader = ({ page = "landing" }: SiteHeaderProps) => {
  const t = useTranslations("SiteChrome");
  const links = siteChromeNavigation(page);
  const landingHome = page === "landing" ? "#top" : siteChromeLinks.landing;
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const menuTrigger = useRef<HTMLButtonElement>(null);
  const mobileMenu = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    const onResize = () => {
      if (window.innerWidth >= 1200) setMenuOpen(false);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    mobileMenu.current?.querySelector<HTMLElement>("a")?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuOpen(false);
        menuTrigger.current?.focus();
        return;
      }

      if (event.key !== "Tab") return;

      const focusable = [
        menuTrigger.current,
        ...Array.from(mobileMenu.current?.querySelectorAll<HTMLElement>("a,button") ?? []),
      ].filter(Boolean) as HTMLElement[];
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (!first || !last) return;

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previous;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [menuOpen]);

  const closeMenu = () => {
    setMenuOpen(false);
    menuTrigger.current?.focus();
  };

  const renderGithubLink = (sourceSection: "header" | "header_mobile") => (
    <LandingTrackedLink
      className="kh-header-icon github-link"
      ctaId={siteChromeNavCtaIds.github}
      href={siteChromeLinks.github}
      sourceSection={sourceSection}
      aria-label={t("nav.github")}
    >
      <GitHubIcon />
    </LandingTrackedLink>
  );

  const renderThemeButton = () => (
    <ThemeSwitcher align="end" contentClassName={chromeMenuClassName} sideOffset={10}>
      <button
        type="button"
        className="kh-header-icon kh-theme-toggle"
        aria-label={t("chooseTheme")}
      >
        <ThemeSunIcon />
        <ThemeMoonIcon />
      </button>
    </ThemeSwitcher>
  );

  return (
    <header
      className={`kh-site-header${scrolled ? " kh-scrolled" : ""}${menuOpen ? " kh-menu-open" : ""}`}
    >
      <nav className="kh-shell kh-header-nav" aria-label={t("mainNavigation")}>
        <Link className="kh-header-wordmark" href={landingHome} aria-label={t("home")}>
          <Image
            src="/images/site-chrome/knowhere-back-to-top.svg"
            width={132}
            height={52}
            alt="Knowhere"
            priority
            unoptimized
          />
        </Link>
        <div className="kh-header-links">
          {links.map((item) => (
            <LandingTrackedLink
              key={item.key}
              href={item.href}
              ctaId={item.ctaId}
              external={item.external}
              sourceSection="header"
              aria-current={item.key === page ? "page" : undefined}
            >
              {t(`nav.${item.key}`)}
            </LandingTrackedLink>
          ))}
        </div>
        <div className="kh-header-actions">
          <div className="kh-desktop-utility">{renderGithubLink("header")}</div>
          <div className="kh-header-language">
            <LanguageSwitcher align="end" contentClassName={chromeMenuClassName} sideOffset={10}>
              <button type="button" className="kh-header-icon" aria-label={t("chooseLanguage")}>
                <GlobalIcon />
              </button>
            </LanguageSwitcher>
          </div>
          <div className="kh-desktop-utility">{renderThemeButton()}</div>
          <LandingTrackedLink
            className="kh-button kh-header-api"
            ctaId={siteChromeNavCtaIds.getApiKey}
            href={siteChromeLinks.login}
            sourceSection="header"
          >
            {t("cta")}
          </LandingTrackedLink>
          <button
            ref={menuTrigger}
            className="kh-header-menu-toggle"
            type="button"
            aria-label={menuOpen ? t("closeMenu") : t("openMenu")}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span>
              <i />
              <i />
            </span>
          </button>
        </div>
      </nav>
      <div
        ref={mobileMenu}
        id="mobile-menu"
        className="kh-header-mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label={t("menu")}
        hidden={!menuOpen}
      >
        <nav aria-label={t("mobileNavigation")}>
          {links.map((item) => (
            <LandingTrackedLink
              key={`mobile-${item.key}`}
              href={item.href}
              ctaId={item.ctaId}
              external={item.external}
              sourceSection="header_mobile"
              onClick={closeMenu}
              aria-current={item.key === page ? "page" : undefined}
            >
              {t(`nav.${item.key}`)}
            </LandingTrackedLink>
          ))}
        </nav>
        <div className="kh-header-mobile-utilities">
          {renderGithubLink("header_mobile")}
          {renderThemeButton()}
          <LandingTrackedLink
            className="kh-button"
            ctaId={siteChromeNavCtaIds.getApiKey}
            href={siteChromeLinks.login}
            sourceSection="header_mobile"
            onClick={closeMenu}
          >
            {t("cta")}
          </LandingTrackedLink>
        </div>
      </div>
    </header>
  );
};
