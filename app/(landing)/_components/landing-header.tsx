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
  label,
  children,
  active = false,
  external = false,
}: {
  href: string;
  label: string;
  children: ReactNode;
  active?: boolean;
  external?: boolean;
}) => (
  <Link
    aria-current={active ? "location" : undefined}
    className={cn(
      "group relative flex h-16 items-center justify-center px-4 text-[14px] leading-5 text-zinc-950 max-[639px]:h-12",
      active
        ? "font-semibold opacity-100"
        : "font-normal opacity-100 transition-opacity duration-150 ease-out hover:opacity-60 active:opacity-100 active:font-medium"
    )}
    href={href}
    rel={external ? "noreferrer" : undefined}
    target={external ? "_blank" : undefined}
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
                label={item.label}
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
              "inline-flex items-center justify-center border-b-[6px] border-b-[#7f22fe] bg-[#8e51ff] pt-[4px] pb-[4px] px-6 text-[#f5f3ff] transition-all hover:border-b-[8px] hover:border-b-[#7008e7] hover:bg-[#7f22fe] hover:pb-[6px] active:border-b-0 active:bg-[#7008e7] active:pb-[6px]",
              monoDisplayClassName,
              "h-full w-[152px] flex-none rounded-none text-sm font-semibold max-[639px]:hidden"
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
