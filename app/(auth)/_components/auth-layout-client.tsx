"use client";

import { KnowhereBrand } from "@components/brand/knowhere-brand";
import { ThemeToggle } from "@components/theme-toggle";
import { useAppConfigContext } from "@providers/config-provider";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { type ReactNode, useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { authRedirect } from "@/lib/auth-redirect";

export function AuthLayoutClient({ children }: { children: ReactNode }) {
  const appConfig = useAppConfigContext();
  const { isAuthenticated, isLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Common");
  const callbackURL = authRedirect.resolveCallbackURL(searchParams.get("callbackURL"));
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace(callbackURL);
    }
  }, [callbackURL, isAuthenticated, isLoading, router]);

  useEffect(() => {
    if (isLoginPage) {
      return;
    }

    document.body.classList.add("console-tone");
    return () => document.body.classList.remove("console-tone");
  }, [isLoginPage]);

  if (isLoading || isAuthenticated) {
    return (
      <div
        className={
          isLoginPage
            ? "min-h-screen flex items-center justify-center bg-[#fafafa] text-[#09090b]"
            : "landing-tone min-h-screen flex items-center justify-center bg-background"
        }
      >
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4" />
          <p>{t("loading")}</p>
        </div>
      </div>
    );
  }

  if (isLoginPage) {
    return <>{children}</>;
  }

  return (
    <div className="landing-tone relative min-h-screen flex flex-col bg-background text-foreground">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.12),transparent_55%)]" />
      <header className="relative z-10 flex items-center justify-between border-b border-border/70 bg-background/85 p-6 backdrop-blur-sm">
        <Link href="/" aria-label="Knowhere API home" className="inline-flex items-center">
          <KnowhereBrand className="w-[148px]" priority sizes="148px" tone="auto" />
        </Link>
        <ThemeToggle />
      </header>

      <main className="relative z-10 flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">{children}</div>
      </main>

      <footer className="relative z-10 border-t border-border/70 text-center text-sm text-muted-foreground p-6">
        <p>
          &copy; {appConfig.copyrightYear} {appConfig.companyName}
          {appConfig.showIcp && (
            <>
              {" "}
              <a
                href={appConfig.icpUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                {appConfig.icpNumber}
              </a>
            </>
          )}
        </p>
      </footer>
    </div>
  );
}
