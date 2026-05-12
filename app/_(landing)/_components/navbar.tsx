"use client";

import { NAV_LINKS } from "@app/_(landing)/_lib/constants";
import { KnowhereBrand } from "@components/brand/knowhere-brand";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { PixelButton } from "./pixel/pixel-button";

type NavbarProps = {
  customLinks?: Array<{
    label: string;
    href: string;
  }>;
};

export const Navbar = ({ customLinks }: NavbarProps = {}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  // Use custom links if provided, otherwise use default NAV_LINKS
  const navLinks = customLinks !== undefined ? customLinks : NAV_LINKS;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (href: string) => {
    if (href.startsWith("#")) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
        setIsOpen(false);
      }
    }
  };

  return (
    <nav
      className={cn(
        "fixed top-0 w-full z-50 transition-none",
        "bg-pixel-bg border-b-2 border-pixel-border",
        isScrolled && "shadow-[0_4px_0_var(--pixel-shadow)]"
      )}
    >
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="inline-flex items-center group" aria-label="Knowhere">
            <KnowhereBrand className="w-[116px]" priority sizes="116px" />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isExternal = link.href.startsWith("https://");
              const isAnchor = link.href.startsWith("#");

              if (isExternal) {
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                  >
                    {link.label}
                  </Link>
                );
              }

              if (isAnchor) {
                return (
                  <button
                    type="button"
                    key={link.href}
                    onClick={() => scrollToSection(link.href)}
                    className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                  >
                    {link.label}
                  </button>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Desktop CTA */}
          <div className="hidden md:flex items-center gap-4">
            {/* TODO: Temporarily hide the public GitHub entry until the project is open source. */}
            {/*
            <Link
              href={SOCIAL_LINKS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
            >
              GitHub
            </Link>
            */}
            <PixelButton
              variant="primary"
              style={{
                boxShadow: "4px 4px 0 var(--pixel-fg)",
              }}
              asChild
            >
              <Link href="/login">GET API KEY</Link>
            </PixelButton>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              type="button"
              onClick={() => setIsOpen(!isOpen)}
              className="pixel-menu-btn"
              aria-label="Toggle menu"
            >
              <div className="mb-1 text-base">{isOpen ? "✕" : "☰"}</div>
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden border-t-2 border-pixel-border py-4">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => {
                const isExternal = link.href.startsWith("https://");
                const isAnchor = link.href.startsWith("#");

                if (isExternal) {
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                      onClick={() => setIsOpen(false)}
                    >
                      {link.label}
                    </Link>
                  );
                }

                if (isAnchor) {
                  return (
                    <button
                      type="button"
                      key={link.href}
                      onClick={() => scrollToSection(link.href)}
                      className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none text-left uppercase tracking-wider"
                    >
                      {link.label}
                    </button>
                  );
                }

                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
              {/* TODO: Temporarily hide the public GitHub entry until the project is open source. */}
              {/*
              <Link
                href={SOCIAL_LINKS.github}
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                GitHub
              </Link>
              */}
              <div className="pt-4 border-t-2 border-pixel-border">
                <PixelButton variant="primary" className="w-full" asChild>
                  <Link href="/login">GET API KEY</Link>
                </PixelButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};
