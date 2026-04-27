"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { useActiveSection } from "@hooks/use-active-section";
import { cn } from "@lib/utils";
import Link from "next/link";
import type { ReactNode } from "react";

const landingHeaderCanvasWidthClassName =
  "mx-auto flex h-16 w-full items-center max-[639px]:h-12 min-[768px]:max-w-[768px] min-[769px]:max-w-[1280px]";
const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";

type LandingNavItem = {
  href: string;
  label: string;
  external?: boolean;
};

const landingNavItems: LandingNavItem[] = [
  { href: "#comparison", label: "Comparison" },
  { href: "#pricing", label: "Pricing" },
  { href: "https://docs.knowhereto.ai/", label: "Docs", external: true },
];

const LandingHeaderLink = ({
  href,
  children,
  active = false,
  external = false,
}: {
  href: string;
  children: ReactNode;
  active?: boolean;
  external?: boolean;
}) => (
  <Link
    aria-current={active ? "location" : undefined}
    className={cn(
      "relative flex h-16 items-center justify-center px-4 text-sm leading-5 text-zinc-950 transition-colors hover:bg-zinc-100/70",
      active
        ? "font-semibold after:absolute after:bottom-[13px] after:left-4 after:right-4 after:h-px after:bg-zinc-950"
        : "font-light"
    )}
    href={href}
    rel={external ? "noreferrer" : undefined}
    target={external ? "_blank" : undefined}
  >
    {children}
  </Link>
);

const HeaderIconButton = ({ children, label }: { children: ReactNode; label: string }) => (
  <button
    aria-label={label}
    className="hidden h-12 w-11 items-center justify-center border-l border-zinc-200 text-zinc-950 transition-colors hover:bg-zinc-100/70 hover:text-zinc-600 max-[639px]:flex"
    type="button"
  >
    {children}
  </button>
);

export const LandingHeader = () => {
  const activeSection = useActiveSection({
    ids: ["comparison", "pricing"],
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-200 bg-[#fafafa]">
      <div className={landingHeaderCanvasWidthClassName}>
        <div className="flex h-full w-[148px] flex-none items-center border-r border-zinc-200 px-[14px] min-[769px]:w-[152px] min-[769px]:px-4">
          <Link href="/" className="flex items-center">
            <LandingBrand size="nav" />
          </Link>
        </div>

        <nav className="flex h-full items-center max-[639px]:hidden">
          {landingNavItems.map((item) => {
            const targetSection = item.href.startsWith("#") ? item.href.slice(1) : null;

            return (
              <LandingHeaderLink
                key={item.label}
                active={targetSection === activeSection}
                external={item.external}
                href={item.href}
              >
                {item.label}
              </LandingHeaderLink>
            );
          })}
        </nav>

        <div className="ml-auto flex h-full items-center">
          <HeaderIconButton label="Open navigation menu">
            <KnowhereIcon className="size-5 text-current" name="menu" />
          </HeaderIconButton>
          <Link
            className={cn(
              "inline-flex items-center justify-center border border-b-[6px] border-[#7f22fe] bg-[#8e51ff] pb-1 text-[#f5f3ff] transition-transform hover:-translate-y-0.5",
              monoDisplayClassName,
              "h-full w-[152px] flex-none rounded-none px-0 text-sm font-semibold max-[639px]:hidden"
            )}
            href="/login"
          >
            GET API KEY
          </Link>
        </div>
      </div>
    </header>
  );
};
