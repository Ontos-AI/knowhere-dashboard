"use client";

import { NAV_LINKS } from "@app/(landing)/_lib/constants";
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
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className="flex items-center">
              {/* Pixel art logo icon */}
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                className="pixel-image"
                role="img"
                aria-label="Knowhere Logo"
              >
                <rect x="6" y="4" width="12" height="2" fill="currentColor" />
                <rect x="4" y="6" width="2" height="12" fill="currentColor" />
                <rect x="18" y="6" width="2" height="12" fill="currentColor" />
                <rect x="6" y="18" width="12" height="2" fill="currentColor" />
                <rect x="10" y="8" width="4" height="2" fill="currentColor" />
                <rect x="8" y="10" width="2" height="4" fill="currentColor" />
                <rect x="14" y="10" width="2" height="4" fill="currentColor" />
                <rect x="10" y="14" width="4" height="2" fill="currentColor" />
              </svg>
              <span className="ml-2 font-pixel text-pixel-sm text-pixel-fg tracking-wider">
                KNOWHERE
              </span>
            </div>
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
            <Link
              href="https://github.com/knowhereapi"
              target="_blank"
              rel="noopener noreferrer"
              className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
            >
              GitHub
            </Link>
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
              <Link
                href="https://github.com/knowhereapi"
                target="_blank"
                rel="noopener noreferrer"
                className="font-pixel text-pixel-xs text-pixel-muted hover:text-pixel-fg transition-none uppercase tracking-wider"
                onClick={() => setIsOpen(false)}
              >
                GitHub
              </Link>
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
