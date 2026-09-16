"use client";

import { LanguageSwitcher } from "@components/language-switcher";
import { ThemeSwitcher } from "@components/theme-switcher";
import { useAppConfigContext } from "@providers/config-provider";
import Image from "next/image";
import Link from "next/link";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { DataStream } from "@/app/(auth)/_components/data-stream";
import { FluidCover } from "@/app/(auth)/_components/fluid-cover";
import "@/app/(auth)/kh-login.css";

type LoginChromeProps = {
  children: ReactNode;
};

export function LoginChrome({ children }: LoginChromeProps) {
  const t = useTranslations("Auth");
  const common = useTranslations("Common");
  const appConfig = useAppConfigContext();

  return (
    <div className="kh-site kh-login login-page">
      <div className="login-background" aria-hidden="true">
        <FluidCover />
      </div>
      <DataStream />
      <header className="login-header">
        <Link className="brand" href="/" aria-label={t("homeAriaLabel")}>
          <Image
            className="login-brand"
            src="/images/site-chrome/knowhere-back-to-top.svg"
            width={132}
            height={52}
            alt="Knowhere"
            priority
            unoptimized
          />
        </Link>
        <div className="login-header-actions">
          <LanguageSwitcher
            align="end"
            contentClassName="kh-site kh-login-menu w-[152px] min-w-[152px] rounded-[8px] border p-1.5 shadow-none"
            sideOffset={8}
          >
            <button
              className="language-button"
              type="button"
              aria-label={t("chooseLanguage")}
              title={t("chooseLanguage")}
            >
              <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                <path d="M12 22C6.47715 22 2 17.5228 2 12C2 6.47715 6.47715 2 12 2C17.5228 2 22 6.47715 22 12C22 17.5228 17.5228 22 12 22ZM9.71002 19.6674C8.74743 17.6259 8.15732 15.3742 8.02731 13H4.06189C4.458 16.1765 6.71639 18.7747 9.71002 19.6674ZM10.0307 13C10.1811 15.4388 10.8778 17.7297 12 19.752C13.1222 17.7297 13.8189 15.4388 13.9693 13H10.0307ZM19.9381 13H15.9727C15.8427 15.3742 15.2526 17.6259 14.29 19.6674C17.2836 18.7747 19.542 16.1765 19.9381 13ZM4.06189 11H8.02731C8.15732 8.62577 8.74743 6.37407 9.71002 4.33256C6.71639 5.22533 4.458 7.8235 4.06189 11ZM10.0307 11H13.9693C13.8189 8.56122 13.1222 6.27025 12 4.24799C10.8778 6.27025 10.1811 8.56122 10.0307 11ZM14.29 4.33256C15.2526 6.37407 15.8427 8.62577 15.9727 11H19.9381C19.542 7.8235 17.2836 5.22533 14.29 4.33256Z" />
              </svg>
            </button>
          </LanguageSwitcher>
          <ThemeSwitcher
            align="end"
            contentClassName="kh-site kh-login-menu w-[152px] min-w-[152px] rounded-[8px] border p-1.5 shadow-none"
            sideOffset={8}
          >
            <button className="login-theme-button" type="button" aria-label={common("toggleTheme")}>
              <svg
                className="login-theme-icon login-theme-icon-sun"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <circle cx="12" cy="12" r="3.5" />
                <path d="M12 2v2M12 20v2M4.93 4.93l1.42 1.42M17.65 17.65l1.42 1.42M2 12h2M20 12h2M4.93 19.07l1.42-1.42M17.65 6.35l1.42-1.42" />
              </svg>
              <svg
                className="login-theme-icon login-theme-icon-moon"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M20 15.1A8.5 8.5 0 0 1 8.9 4a8.5 8.5 0 1 0 11.1 11.1Z" />
              </svg>
            </button>
          </ThemeSwitcher>
        </div>
      </header>
      <main className="login-panel">
        <div className="form-area">{children}</div>
      </main>
      <footer className="login-footer">
        <span>
          © {appConfig.copyrightYear} Knowhere
          {appConfig.showIcp ? (
            <>
              {" "}
              <a href={appConfig.icpUrl} target="_blank" rel="noopener noreferrer">
                {appConfig.icpNumber}
              </a>
            </>
          ) : null}
        </span>
      </footer>
    </div>
  );
}
