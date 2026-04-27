"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    <Card className="w-full border-border/80 bg-card/95 shadow-[0_14px_44px_-24px_rgba(146,64,14,0.35)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t("forgotPasswordTitle")}</CardTitle>
        <CardDescription className="text-center">{t("forgotPasswordDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              autoComplete="email"
              {...register("email")}
              disabled={isSending}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <Button type="submit" className="w-full" disabled={isSending}>
            {isSending ? t("sending") : t("sendPasswordReset")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <Link href={loginPath} className="text-primary hover:underline">
            {t("backToLogin")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
