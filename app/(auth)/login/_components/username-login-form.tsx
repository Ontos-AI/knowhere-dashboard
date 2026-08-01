"use client";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginButton } from "@/app/(auth)/login/_components/login-button";

type UsernameLoginFormProps = {
  disabled?: boolean;
  forgotPasswordPath: string;
  isPasswordLoading?: boolean;
  onPasswordSubmit: (username: string, password: string) => Promise<boolean>;
  registerPath: string;
};

type LoginFormValues = {
  username: string;
  password: string;
};

export const UsernameLoginForm = ({
  disabled = false,
  forgotPasswordPath,
  isPasswordLoading = false,
  onPasswordSubmit,
  registerPath,
}: UsernameLoginFormProps) => {
  const t = useTranslations("Auth");
  const isSubmitting = isPasswordLoading;

  const loginSchema = useMemo(
    () =>
      z.object({
        username: z.string().trim().min(2, t("usernameMinLength")),
        password: z.string(),
      }),
    [t]
  );

  const form = useForm<LoginFormValues>({
    defaultValues: {
      username: "",
      password: "",
    },
    resolver: zodResolver(loginSchema),
  });

  const handleSubmit = form.handleSubmit(async ({ username, password }) => {
    if (password.length < 8) {
      form.setError("password", {
        type: "manual",
        message: t("passwordMinLength"),
      });
      return;
    }

    await onPasswordSubmit(username, password);
  });

  return (
    <form className="space-y-[14px] lg:space-y-4" noValidate onSubmit={handleSubmit}>
      <div className="space-y-1.5 lg:space-y-2">
        <Label
          className="text-xs font-bold leading-[18px] text-[#09090b] lg:text-sm lg:leading-5"
          htmlFor="login-username"
        >
          {t("username")}
        </Label>
        <Input
          aria-invalid={form.formState.errors.username ? "true" : "false"}
          autoComplete="username"
          className="h-10 border-[#e4e4e7] px-[10px] text-xs leading-[14px] text-[#09090b] placeholder:text-xs placeholder:leading-[14px] placeholder:text-[#9f9fa9] hover:border-[#d4d4d8] focus-visible:border-[#7f22fe] disabled:border-[#e4e4e7] disabled:bg-[#fafafa] lg:px-3 lg:leading-4 lg:placeholder:leading-4"
          disabled={disabled || isSubmitting}
          id="login-username"
          placeholder={t("usernamePlaceholder")}
          type="text"
          {...form.register("username")}
        />
        {form.formState.errors.username ? (
          <p className="text-xs leading-4 text-destructive" role="alert">
            {form.formState.errors.username.message}
          </p>
        ) : null}
      </div>

      <div className="space-y-1.5 lg:space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label
            className="text-xs font-bold leading-[18px] text-[#09090b] lg:text-sm lg:leading-5"
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
          className="h-10 border-[#e4e4e7] px-[10px] text-xs leading-[14px] text-[#09090b] placeholder:text-xs placeholder:leading-[14px] placeholder:text-[#9f9fa9] hover:border-[#d4d4d8] focus-visible:border-[#7f22fe] disabled:border-[#e4e4e7] disabled:bg-[#fafafa] lg:px-3 lg:leading-4 lg:placeholder:leading-4"
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

      <LoginButton
        aria-busy={isSubmitting}
        disabled={disabled || isSubmitting}
        type="submit"
        variant="primary"
      >
        {t("signInWithPassword")}
      </LoginButton>

      <p className="text-center text-xs leading-[18px] text-[#71717a] lg:text-sm lg:leading-5">
        {t("noAccount")}{" "}
        <Link
          className="font-medium text-[#7f22fe] transition-opacity hover:opacity-80"
          href={registerPath}
        >
          {t("signUpWithPassword")}
        </Link>
      </p>
    </form>
  );
};
