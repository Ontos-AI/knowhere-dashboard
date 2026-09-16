"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { trackSignUp } from "@lib/posthog";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { AuthButton, AuthInput } from "@/app/(auth)/_components/form-controls";
import { OAuthButtons } from "@/app/(auth)/_components/oauth-buttons";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const loginPath = authRedirect.buildAuthPagePath("/login", {
    callbackURL: rawCallbackURL,
  });
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);

  const registerSchema = useMemo(
    () =>
      z
        .object({
          username: z.string().min(2, t("usernameMinLength")),
          email: z.string().email(t("emailInvalid")),
          password: z.string().min(8, t("passwordMinLength")),
          confirmPassword: z.string().min(8, t("passwordMinLength")),
        })
        .refine((data) => data.password === data.confirmPassword, {
          message: t("passwordMismatch"),
          path: ["confirmPassword"],
        }),
    [t]
  );

  type RegisterForm = z.infer<typeof registerSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterForm) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        name: data.username,
        email: data.email,
        callbackURL,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message || t("registerFailed"));
      }

      const session = await authClient.getSession();
      if (session.data?.user?.id) {
        trackSignUp("email", session.data.user.id);
      }

      toast.success(t("registerSuccess"));
      router.push(callbackURL);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("registerFailed");
      toast.error(t("registerFailed"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthError = (error: string) => {
    toast.error(t("oauthFailed"), error);
  };

  return (
    <>
      <div className="form-heading">
        <h1>{t("register")}</h1>
        <p className="form-heading-desc">{t("registerDesc")}</p>
      </div>
      <OAuthButtons onError={handleOAuthError} />
      <form noValidate onSubmit={handleSubmit(onSubmit)}>
        <div className="auth-field">
          <label htmlFor="username">{t("username")}</label>
          <AuthInput
            id="username"
            type="text"
            placeholder={t("usernamePlaceholder")}
            autoComplete="name"
            aria-invalid={errors.username ? "true" : "false"}
            {...register("username")}
            disabled={isLoading}
          />
          {errors.username ? (
            <p className="auth-feedback" role="alert">
              {errors.username.message}
            </p>
          ) : null}
        </div>

        <div className="auth-field">
          <label htmlFor="email">{t("email")}</label>
          <AuthInput
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            autoComplete="email"
            aria-invalid={errors.email ? "true" : "false"}
            {...register("email")}
            disabled={isLoading}
          />
          {errors.email ? (
            <p className="auth-feedback" role="alert">
              {errors.email.message}
            </p>
          ) : null}
        </div>

        <div className="auth-field">
          <label htmlFor="password">{t("password")}</label>
          <AuthInput
            id="password"
            type="password"
            placeholder={t("passwordPlaceholder")}
            autoComplete="new-password"
            aria-invalid={errors.password ? "true" : "false"}
            {...register("password")}
            disabled={isLoading}
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
            disabled={isLoading}
          />
          {errors.confirmPassword ? (
            <p className="auth-feedback" role="alert">
              {errors.confirmPassword.message}
            </p>
          ) : null}
        </div>

        <AuthButton
          className="submit-button"
          type="submit"
          disabled={isLoading}
          loading={isLoading}
        >
          {isLoading ? t("registering") : t("signUpWithPassword")}
        </AuthButton>
      </form>

      <p className="auth-aux">
        {t("haveAccount")} <Link href={loginPath}>{t("loginNow")}</Link>
      </p>
    </>
  );
}
