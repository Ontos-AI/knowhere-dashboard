"use client";

import Link from "next/link";
import { useTranslations } from "next-intl";
import { LoginBrand } from "@/app/(auth)/login/_components/login-brand";
import { UsernameLoginForm } from "@/app/(auth)/login/_components/username-login-form";
import { useLoginActions } from "@/app/(auth)/login/_hooks/use-login-actions";

export const LoginPageShell = () => {
  const t = useTranslations("Auth");
  const { forgotPasswordPath, registerPath, isPasswordLoading, signInWithPassword } =
    useLoginActions();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#09090b]">
      <header className="h-12 border-b border-[#d4d4d8] bg-[#fafafa] px-[30px] lg:h-16 lg:px-8">
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

      <main className="flex min-h-[calc(100vh-48px)] items-start justify-center bg-[#fafafa] px-0 py-[18px] sm:items-center sm:bg-[#f4f4f5] sm:px-[62px] sm:py-[30px] lg:min-h-[calc(100vh-64px)] lg:px-16 lg:py-8">
        <section className="w-full bg-transparent px-[30px] pb-[54px] pt-[22px] sm:min-h-[468px] sm:max-w-[402px] sm:border sm:border-[#e4e4e7] sm:bg-[#fafafa] sm:px-[46px] sm:pb-[54px] sm:pt-[22px] lg:min-h-[492px] lg:px-12 lg:pb-14 lg:pt-6">
          <div className="flex flex-col gap-[22px] lg:gap-6">
            <LoginBrand className="h-16 max-[639px]:hidden" variant="card" />

            <div className="space-y-[14px] lg:space-y-4">
              <h1 className="text-base font-bold leading-[26px] text-[#09090b] sm:text-lg lg:text-xl lg:leading-7">
                {t("login")}
              </h1>
            </div>

            <UsernameLoginForm
              forgotPasswordPath={forgotPasswordPath}
              isPasswordLoading={isPasswordLoading}
              onPasswordSubmit={signInWithPassword}
              registerPath={registerPath}
            />
          </div>
        </section>
      </main>
    </div>
  );
};
