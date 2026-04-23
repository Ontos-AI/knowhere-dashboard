import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { LandingThemeToggle } from "@app/(landing)/_components/landing-theme-toggle";
import { clawNavItems } from "@app/(landing)/claw/_components/claw-content";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import Link from "next/link";

export const ClawHeader = () => {
  return (
    <header className="border-b border-[#e4e4e7] bg-[#fafafa] w-full">
      <div className="mx-auto grid h-12 w-full max-w-[1536px] grid-cols-[128px_minmax(0,1fr)_48px_48px] sm:grid-cols-[128px_minmax(0,1fr)_48px_128px] md:h-16 md:grid-cols-[128px_minmax(0,1fr)_52px_128px]">
        <div className="flex h-full items-center border-r border-[#e4e4e7] px-4">
          <LandingBrand size="nav" />
        </div>
        <div className="flex min-w-0 items-center pl-2">
          <nav
            aria-label="Claw page sections"
            className="hidden h-full min-w-0 items-center overflow-x-auto sm:flex"
          >
            {clawNavItems.map((item) => (
              <Link
                className={
                  item.isActive
                    ? "inline-flex h-full items-center justify-center px-2 text-sm font-semibold leading-5 text-[#09090b] lg:px-4"
                    : "inline-flex h-full items-center justify-center px-2 text-sm font-light leading-5 text-[#09090b] transition-colors hover:text-[#52525c] lg:px-4"
                }
                href={item.href}
                key={item.label}
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <button
            className="ml-auto hidden h-full items-center gap-1 px-4 text-sm leading-5 text-[#09090b] transition-colors hover:text-[#52525c] lg:inline-flex"
            type="button"
          >
            English
            <KnowhereIcon className="size-5 text-current" name="chevron-down" />
          </button>
        </div>
        <div className="flex h-full items-center justify-center border-l border-[#e4e4e7]">
          <LandingThemeToggle className="flex h-full w-full sm:hidden md:flex" />
          <button
            aria-label="Open site menu"
            className="hidden h-full w-full items-center justify-center text-[#09090b] transition-colors hover:text-[#52525c] sm:inline-flex md:hidden"
            type="button"
          >
            <KnowhereIcon className="size-5 text-current" name="menu" />
          </button>
        </div>
        <div className="flex h-full items-center justify-center border-l border-[#e4e4e7]">
          <button
            aria-label="Open site menu"
            className="inline-flex h-full w-full items-center justify-center text-[#09090b] transition-colors hover:text-[#52525c] sm:hidden"
            type="button"
          >
            <KnowhereIcon className="size-5 text-current" name="menu" />
          </button>
          <Link
            className="hidden h-full w-full items-center justify-center border-b-[6px] border-[#c10007] bg-[#e7000b] pb-1 font-mono-readable text-base font-semibold leading-6 text-[#f5f3ff] transition-colors hover:bg-[#c10007] sm:inline-flex"
            href="/login"
          >
            GET API KEY
          </Link>
        </div>
      </div>
    </header>
  );
};
