"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import { LandingHeader } from "@app/(landing)/_components/landing-header";
import { LandingTrackedLink } from "@app/(landing)/_components/landing-tracked-link";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

const footerPaddingClassName =
  "px-12 py-6 max-[639px]:px-[18px] max-[639px]:py-[18px] min-[640px]:max-[767px]:px-[46px] min-[640px]:max-[767px]:py-6";
const landingCanvasWidthClassName =
  "mx-auto flex w-full flex-col min-[768px]:max-w-[768px] min-[769px]:max-w-[976px]";
const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";

const RegisterLoginButton = ({ children }: { children: ReactNode }) => {
  const linkClassName = cn(
    "group inline-flex h-[72px] items-center justify-center rounded-full border border-b-[6px] border-[#7f22fe] bg-[#8e51ff] px-9 text-xl text-[#f5f3ff] transition-[background-color,border-color,border-bottom-width] hover:border-[#7008e7] hover:bg-[#7f22fe] hover:border-b-[8px] active:border-[#7008e7] active:bg-[#7008e7] active:border-b-[6px]",
    monoDisplayClassName
  );

  return (
    <LandingTrackedLink
      className={linkClassName}
      ctaId="register_login"
      href="/login"
      sourceSection="hero"
    >
      <span className="inline-flex h-full translate-y-1 items-center pb-[6px] font-semibold transition-[padding-bottom,transform] duration-150 ease-out">
        {children}
      </span>
    </LandingTrackedLink>
  );
};

export const LandingHome = () => {
  const t = useTranslations("Landing.header");
  const tHome = useTranslations("Landing.home");

  return (
    <div className="min-h-dvh bg-white text-[#09090b] dark:bg-[#18181b] dark:text-[#fafafa]">
      <LandingHeader />

      <main className={cn(landingCanvasWidthClassName, "min-w-[375px]")}>
        <section className="flex min-h-[calc(100dvh-96px)] items-center justify-center border-b border-l border-r border-zinc-200 bg-white dark:border-[#3f3f46] dark:bg-[#18181b]">
          <div className="flex flex-col items-center gap-6 px-5 text-center">
            <RegisterLoginButton>{t("cta")}</RegisterLoginButton>
          </div>
        </section>
      </main>

      <footer
        className={cn(
          "mx-auto flex w-full flex-row items-center justify-between gap-3 border border-zinc-200 bg-white text-left dark:border-[#3f3f46] dark:bg-[#18181b] max-[639px]:flex-col max-[639px]:text-center min-[768px]:max-w-[768px] min-[769px]:max-w-[976px]",
          footerPaddingClassName
        )}
      >
        <LandingBrand size="header" />
        <p className="text-xs leading-4 text-zinc-400">{tHome("footer.copyright")}</p>
      </footer>
    </div>
  );
};
