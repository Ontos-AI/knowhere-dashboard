"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { clawNavItems } from "@app/(landing)/claw/_components/claw-content";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { useActiveSection } from "@hooks/use-active-section";
import { cn } from "@lib/utils";
import Link from "next/link";

export const ClawHeader = () => {
  const activeSection = useActiveSection({
    ids: clawNavItems.map((item) => item.href.replace(/^#/, "")),
  });

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#e4e4e7] bg-[#fafafa]">
      <div className="mx-auto grid h-12 w-full grid-cols-[128px_minmax(0,1fr)_48px] min-[640px]:grid-cols-[128px_minmax(0,1fr)_128px] min-[640px]:max-[767px]:h-16 min-[640px]:max-[767px]:max-w-[640px] min-[640px]:max-[767px]:grid-cols-[148px_340px_152px] min-[768px]:max-[768px]:h-16 min-[768px]:max-[768px]:max-w-[768px] min-[768px]:max-[768px]:grid-cols-[148px_468px_152px] min-[769px]:h-16 min-[769px]:max-w-[1280px] min-[769px]:grid-cols-[152px_minmax(0,1fr)_152px]">
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
            {clawNavItems.map((item) => {
              const targetSection = item.href.replace(/^#/, "");
              const isActive = targetSection === activeSection;

              return (
                <Link
                  aria-current={isActive ? "location" : undefined}
                  className={cn(
                    "inline-flex h-full items-center justify-center px-[14px] text-[#09090b] leading-5 min-[768px]:max-[768px]:px-3",
                    isActive
                      ? "text-[14px] font-semibold underline decoration-solid underline-offset-2"
                      : "text-[14px] font-normal transition-opacity hover:opacity-60"
                  )}
                  href={item.href}
                  key={item.label}
                  rel={item.isExternal ? "noreferrer" : undefined}
                  target={item.isExternal ? "_blank" : undefined}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex h-full items-center justify-center border-l border-[#e4e4e7]">
          <button
            aria-label="Open site menu"
            className="inline-flex h-full w-full items-center justify-center text-[#09090b] transition-colors hover:text-[#52525c] min-[640px]:hidden min-[640px]:max-[767px]:hidden"
            type="button"
          >
            <KnowhereIcon className="size-5 text-current" name="menu" />
          </button>
          <Link
            className="hidden h-full w-full items-center justify-center border-b-[6px] border-b-[#c10007] bg-[#e7000b] pt-[4px] pb-[4px] px-6 font-mono-readable text-sm font-semibold leading-5 text-[#fef2f2] transition-all hover:border-b-[8px] hover:border-b-[#9f0712] hover:bg-[#c10007] hover:pb-[6px] active:border-b-0 active:bg-[#9f0712] active:pb-[6px] min-[640px]:inline-flex"
            href="/login"
          >
            GET API KEY
          </Link>
        </div>
      </div>
    </header>
  );
};
