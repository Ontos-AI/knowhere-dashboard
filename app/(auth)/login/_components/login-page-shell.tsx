"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { EmailLoginForm } from "@/app/(auth)/login/_components/email-login-form";
import { LoginBrand } from "@/app/(auth)/login/_components/login-brand";
import { SocialLoginButtons } from "@/app/(auth)/login/_components/social-login-buttons";
import { useLoginActions } from "@/app/(auth)/login/_hooks/use-login-actions";

export const LoginPageShell = () => {
  const t = useTranslations("Auth");
  const {
    activeOAuthProvider,
    forgotPasswordPath,
    isMagicLinkLoading,
    isOAuthLoading,
    isPasswordLoading,
    signInWithMagicLink,
    signInWithPassword,
    signInWithProvider,
  } = useLoginActions();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b]">
      <header className="h-16 border-b border-[#d4d4d8] bg-[#fafafa] px-6 lg:px-8 max-[639px]:h-12 max-[639px]:px-[30px] max-[374px]:px-4">
        <div className="flex h-full items-center">
          <Link
            aria-label="Knowhere homepage"
            className="rounded-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7f22fe]/20 focus-visible:ring-offset-2"
            href="/"
          >
            <LoginBrand variant="header" />
          </Link>
        </div>
      </header>

      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-[#f4f4f5] px-4 py-8 sm:px-6 lg:px-16 lg:py-8 max-[639px]:min-h-[calc(100vh-48px)] max-[639px]:items-start max-[639px]:bg-[#fafafa] max-[639px]:px-0 max-[639px]:py-[18px] max-[374px]:py-4">
        <section className="w-full max-w-[402px] border border-[#e4e4e7] bg-[#fafafa] px-8 pb-12 pt-6 lg:min-h-[492px] lg:px-12 lg:pb-14 max-[639px]:max-w-none max-[639px]:border-none max-[639px]:bg-transparent max-[639px]:px-[30px] max-[639px]:pb-[54px] max-[639px]:pt-[22px] max-[639px]:min-h-0 max-[374px]:px-4 max-[374px]:pb-10 max-[374px]:pt-5">
          <div className="flex flex-col gap-6">
            <LoginBrand className="h-16 max-[639px]:hidden" variant="card" />

            <div className="space-y-4 max-[639px]:space-y-[14px]">
              <h1 className="text-xl font-bold leading-7 text-[#09090b] max-[639px]:text-base max-[639px]:leading-[26px]">
                {t("login")}
              </h1>
              <SocialLoginButtons
                activeProvider={activeOAuthProvider}
                disabled={isMagicLinkLoading}
                onSignIn={signInWithProvider}
              />
            </div>

            <div
              aria-hidden="true"
              className="flex items-center justify-center gap-5 text-sm font-normal leading-5 text-[#9f9fa9] max-[639px]:gap-[18px] max-[639px]:text-xs max-[639px]:leading-[18px]"
            >
              <span className="h-px flex-1 bg-[#e4e4e7]" />
              <span>or</span>
              <span className="h-px flex-1 bg-[#e4e4e7]" />
            </div>

            <EmailLoginForm
              disabled={isOAuthLoading}
              forgotPasswordPath={forgotPasswordPath}
              isMagicLinkLoading={isMagicLinkLoading}
              isPasswordLoading={isPasswordLoading}
              onMagicLinkSubmit={signInWithMagicLink}
              onPasswordSubmit={signInWithPassword}
            />
          </div>
        </section>
      </main>
    </div>
  );
};
