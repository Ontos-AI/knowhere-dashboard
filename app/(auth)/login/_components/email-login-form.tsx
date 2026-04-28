"use client";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginButton } from "@/app/(auth)/login/_components/login-button";

type EmailLoginFormProps = {
  disabled?: boolean;
  forgotPasswordPath: string;
  isMagicLinkLoading?: boolean;
  isPasswordLoading?: boolean;
  onMagicLinkSubmit: (email: string) => Promise<boolean>;
  onPasswordSubmit: (email: string, password: string) => Promise<boolean>;
  passwordLoginEnabled: boolean;
};

type LoginFormValues = {
  email: string;
  password: string;
};

export const EmailLoginForm = ({
  disabled = false,
  forgotPasswordPath,
  isMagicLinkLoading = false,
  isPasswordLoading = false,
  onMagicLinkSubmit,
  onPasswordSubmit,
  passwordLoginEnabled,
}: EmailLoginFormProps) => {
  const t = useTranslations("Auth");
  const [isPasswordLoginEnabled, setIsPasswordLoginEnabled] = useState(false);
  const isSubmitting = isMagicLinkLoading || isPasswordLoading;

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().trim().email(t("emailInvalid")),
        password: z.string(),
      }),
    [t]
  );

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const togglePasswordLogin = () => {
    setIsPasswordLoginEnabled((currentValue) => !currentValue);
    form.clearErrors("password");
  };

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    if (passwordLoginEnabled && isPasswordLoginEnabled) {
      if (password.length < 8) {
        form.setError("password", {
          type: "manual",
          message: t("passwordMinLength"),
        });
        return;
      }

      await onPasswordSubmit(email, password);
      return;
    }

    await onMagicLinkSubmit(email);
  });

  return (
    <form className="space-y-4 max-[639px]:space-y-[14px]" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2 max-[639px]:space-y-1.5">
        <Label
          className="text-sm font-bold leading-5 text-[#09090b] max-[639px]:text-xs max-[639px]:leading-[18px]"
          htmlFor="login-email"
        >
          {t("email")}
        </Label>
        <Input
          aria-invalid={form.formState.errors.email ? "true" : "false"}
          className="h-10 border-[#e4e4e7] px-3 text-sm leading-5 text-[#09090b] placeholder:text-xs placeholder:leading-4 placeholder:text-[#9f9fa9] hover:border-[#d4d4d8] focus-visible:border-[#7f22fe] disabled:border-[#e4e4e7] disabled:bg-[#fafafa] max-[639px]:px-[10px] max-[639px]:text-xs max-[639px]:leading-[18px] max-[639px]:placeholder:leading-[14px] max-[374px]:px-3"
          disabled={disabled || isSubmitting}
          id="login-email"
          placeholder={t("emailPlaceholder")}
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs leading-4 text-destructive" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      {passwordLoginEnabled && isPasswordLoginEnabled ? (
        <div className="space-y-2 max-[639px]:space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label
              className="text-sm font-bold leading-5 text-[#09090b] max-[639px]:text-xs max-[639px]:leading-[18px]"
              htmlFor="login-password"
            >
              {t("password")}
            </Label>
            <Link
              className="text-xs leading-4 text-[#7f22fe] transition-opacity hover:opacity-80"
              href={forgotPasswordPath}
            >
              {t("forgotPassword")}
            </Link>
          </div>
          <Input
            aria-invalid={form.formState.errors.password ? "true" : "false"}
            autoComplete="current-password"
            className="h-10 border-[#e4e4e7] px-3 text-sm leading-5 text-[#09090b] placeholder:text-xs placeholder:leading-4 placeholder:text-[#9f9fa9] hover:border-[#d4d4d8] focus-visible:border-[#7f22fe] disabled:border-[#e4e4e7] disabled:bg-[#fafafa] max-[639px]:px-[10px] max-[639px]:text-xs max-[639px]:leading-[18px] max-[639px]:placeholder:leading-[14px] max-[374px]:px-3"
            disabled={disabled || isSubmitting}
            id="login-password"
            placeholder={t("passwordPlaceholder")}
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="text-xs leading-4 text-destructive" role="alert">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <LoginButton
        aria-busy={isSubmitting}
        disabled={disabled || isSubmitting}
        type="submit"
        variant="primary"
      >
        {passwordLoginEnabled && isPasswordLoginEnabled
          ? t("signInWithPassword")
          : isMagicLinkLoading
            ? t("sending")
            : t("sendMagicLink")}
      </LoginButton>

      {passwordLoginEnabled ? (
        <>
          <LoginButton
            disabled={disabled || isSubmitting}
            onClick={togglePasswordLogin}
            type="button"
            variant="secondary"
          >
            {isPasswordLoginEnabled ? t("useEmailLinkInstead") : t("loginWithPassword")}
          </LoginButton>

          <p className="text-center text-sm leading-5 text-[#71717a] max-[639px]:text-xs max-[639px]:leading-[18px]">
            {t("noAccount")}{" "}
            <Link
              className="font-medium text-[#7f22fe] transition-opacity hover:opacity-80"
              href="/register"
            >
              {t("signUpWithPassword")}
            </Link>
          </p>
        </>
      ) : null}
    </form>
  );
};
