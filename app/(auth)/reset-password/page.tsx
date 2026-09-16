"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthButton, AuthInput } from "@/app/(auth)/_components/form-controls";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export default function ResetPasswordPage() {
  const [isSaving, setIsSaving] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const token = searchParams.get("token");
  const resetError = searchParams.get("error");
  const rawCallbackURL = searchParams.get("callbackURL");
  const forgotPasswordPath = authRedirect.buildAuthPagePath("/forgot-password", {
    callbackURL: rawCallbackURL,
  });
  const loginPath = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
  });

  const resetPasswordSchema = useMemo(
    () =>
      z
        .object({
          password: z.string().min(8, t("passwordMinLength")),
          confirmPassword: z.string().min(8, t("passwordMinLength")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("passwordMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  type ResetPasswordForm = z.infer<typeof resetPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordForm>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordForm): Promise<void> => {
    if (!token) {
      toast.error(t("invalidResetLink"));
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await authClient.resetPassword({
        newPassword: data.password,
        token,
      });

      if (error) {
        throw new Error(error.message || t("passwordResetFailed"));
      }

      toast.success(t("passwordResetSuccess"));
      router.push(loginPath);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("passwordResetFailed");
      toast.error(t("passwordResetFailed"), errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  if (!token || resetError) {
    return (
      <>
        <div className="form-heading">
          <h1>{t("invalidResetLinkTitle")}</h1>
          <p className="form-heading-desc">{t("invalidResetLinkDesc")}</p>
        </div>
        <Link className="control-button control-button--black" href={forgotPasswordPath}>
          <span className="control-button-content">{t("requestNewResetLink")}</span>
        </Link>
        <p className="auth-aux">
          <Link href={loginPath}>{t("backToLogin")}</Link>
        </p>
      </>
    );
  }

  return (
    <>
      <div className="form-heading">
        <h1>{t("resetPasswordTitle")}</h1>
        <p className="form-heading-desc">{t("resetPasswordDesc")}</p>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label htmlFor="password">{t("newPassword")}</label>
          <AuthInput
            id="password"
            type="password"
            placeholder={t("newPasswordPlaceholder")}
            autoComplete="new-password"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
            disabled={isSaving}
          />
          {errors.password ? (
            <p className="auth-feedback" role="alert">
              {errors.password.message}
            </p>
          ) : null}
        </div>

        <div className="auth-field">
          <label htmlFor="confirmPassword">{t("confirmPassword")}</label>
          <AuthInput
            id="confirmPassword"
            type="password"
            placeholder={t("confirmPasswordPlaceholder")}
            autoComplete="new-password"
            aria-invalid={errors.confirmPassword ? "true" : "false"}
            {...register("confirmPassword")}
            disabled={isSaving}
          />
          {errors.confirmPassword ? (
            <p className="auth-feedback" role="alert">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <AuthButton className="submit-button" type="submit" disabled={isSaving} loading={isSaving}>
          {isSaving ? t("updatingPassword") : t("resetPassword")}
        </AuthButton>
      </form>
    </>
  );
}
