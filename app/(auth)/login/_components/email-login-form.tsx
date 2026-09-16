"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthButton, AuthInput } from "@/app/(auth)/_components/form-controls";

type EmailLoginFormProps = {
  disabled?: boolean;
  forgotPasswordPath: string;
  isMagicLinkLoading?: boolean;
  isPasswordLoading?: boolean;
  onMagicLinkSubmit: (email: string) => Promise<boolean>;
  onPasswordSubmit: (email: string, password: string) => Promise<boolean>;
  passwordLoginEnabled: boolean;
  registerPath: string;
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
  registerPath,
}: EmailLoginFormProps) => {
  const t = useTranslations("Auth");
  const [isPasswordLoginEnabled, setIsPasswordLoginEnabled] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const isSubmitting = isMagicLinkLoading || isPasswordLoading;
  const passwordMode = passwordLoginEnabled && isPasswordLoginEnabled;

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
    setMagicLinkSent(false);
    form.clearErrors("password");
  };

  const handleSubmit = form.handleSubmit(async ({ email, password }) => {
    if (passwordMode) {
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

    const sent = await onMagicLinkSubmit(email);
    setMagicLinkSent(sent);
  });

  return (
    <form noValidate onSubmit={handleSubmit}>
      <div className="auth-field">
        <label htmlFor="login-email">{t("email")}</label>
        <AuthInput
          aria-invalid={form.formState.errors.email ? "true" : "false"}
          aria-describedby={form.formState.errors.email ? "login-email-feedback" : undefined}
          autoComplete="email"
          disabled={disabled || isSubmitting}
          id="login-email"
          placeholder={t("emailPlaceholder")}
          readOnly={isMagicLinkLoading}
          spellCheck={false}
          type="email"
          {...form.register("email", {
            onChange: () => {
              setMagicLinkSent(false);
            },
          })}
        />
        {form.formState.errors.email ? (
          <p className="email-feedback" id="login-email-feedback" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      {passwordMode ? (
        <div className="auth-field">
          <div className="auth-field-header">
            <label htmlFor="login-password">{t("password")}</label>
            <Link className="auth-text-link" href={forgotPasswordPath}>
              {t("forgotPassword")}
            </Link>
          </div>
          <AuthInput
            aria-invalid={form.formState.errors.password ? "true" : "false"}
            autoComplete="current-password"
            disabled={disabled || isSubmitting}
            id="login-password"
            placeholder={t("passwordPlaceholder")}
            type="password"
            {...form.register("password")}
          />
          {form.formState.errors.password ? (
            <p className="auth-feedback" role="alert">
              {form.formState.errors.password.message}
            </p>
          ) : null}
        </div>
      ) : null}

      <AuthButton
        className="submit-button"
        disabled={disabled || isSubmitting}
        loading={isSubmitting}
        type="submit"
      >
        {passwordMode
          ? t("signInWithPassword")
          : isMagicLinkLoading
            ? t("sending")
            : magicLinkSent
              ? t("resendEmail")
              : t("sendMagicLink")}
        <ArrowRight size={17} aria-hidden="true" />
      </AuthButton>

      {passwordMode ? null : (
        <output className="email-delivery-slot">
          {magicLinkSent ? (
            <div className="email-delivery">
              <CheckCircle2 className="email-delivery-icon" size={20} aria-hidden="true" />
              <p className="email-delivery-title">{t("magicLinkSent")}</p>
            </div>
          ) : null}
        </output>
      )}

      {passwordLoginEnabled ? (
        <>
          <AuthButton
            className="submit-button"
            disabled={disabled || isSubmitting}
            onClick={togglePasswordLogin}
            type="button"
            variant="white"
          >
            {isPasswordLoginEnabled ? t("useEmailLinkInstead") : t("loginWithPassword")}
          </AuthButton>

          <p className="auth-aux">
            {t("noAccount")} <Link href={registerPath}>{t("signUpWithPassword")}</Link>
          </p>
        </>
      ) : null}
    </form>
  );
};
