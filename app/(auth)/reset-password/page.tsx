"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
      <Card className="w-full border-border/80 bg-card/95 shadow-[0_14px_44px_-24px_rgba(146,64,14,0.35)]">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl text-center">{t("invalidResetLinkTitle")}</CardTitle>
          <CardDescription className="text-center">{t("invalidResetLinkDesc")}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button asChild className="w-full">
            <Link href={forgotPasswordPath}>{t("requestNewResetLink")}</Link>
          </Button>
          <div className="text-center text-sm">
            <Link href={loginPath} className="text-primary hover:underline">
              {t("backToLogin")}
            </Link>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full border-border/80 bg-card/95 shadow-[0_14px_44px_-24px_rgba(146,64,14,0.35)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t("resetPasswordTitle")}</CardTitle>
        <CardDescription className="text-center">{t("resetPasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">{t("newPassword")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("newPasswordPlaceholder")}
              autoComplete="new-password"
              {...register("password")}
              disabled={isSaving}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder={t("confirmPasswordPlaceholder")}
              autoComplete="new-password"
              {...register("confirmPassword")}
              disabled={isSaving}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isSaving}>
            {isSaving ? t("updatingPassword") : t("resetPassword")}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
