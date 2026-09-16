"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthButton, AuthInput } from "@/app/(auth)/_components/form-controls";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export default function ForgotPasswordPage() {
  const [isSending, setIsSending] = useState(false);
  const toast = useToast();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const loginPath = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
  });

  const forgotPasswordSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("emailInvalid")),
      }),
    [t]
  );

  type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordForm): Promise<void> => {
    setIsSending(true);
    try {
      const { error } = await authClient.requestPasswordReset({
        email: data.email,
        redirectTo: "/reset-password",
      });

      if (error) {
        throw new Error(error.message || t("passwordResetEmailFailed"));
      }

      toast.success(t("passwordResetEmailSent"));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("passwordResetEmailFailed");
      toast.error(t("passwordResetEmailFailed"), errorMessage);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      <div className="form-heading">
        <h1>{t("forgotPasswordTitle")}</h1>
        <p className="form-heading-desc">{t("forgotPasswordDesc")}</p>
      </div>
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label htmlFor="email">{t("email")}</label>
          <AuthInput
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
            disabled={isSending}
          />
          {errors.email ? (
            <p className="auth-feedback" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <AuthButton
          className="submit-button"
          type="submit"
          disabled={isSending}
          loading={isSending}
        >
          {isSending ? t("sending") : t("sendPasswordReset")}
        </AuthButton>
      </form>

      <p className="auth-aux">
        <Link href={loginPath}>{t("backToLogin")}</Link>
      </p>
    </>
  );
}
