"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackSignUp } from "@lib/posthog";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
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
    <Card className="w-full border-border/80 bg-card/95 shadow-[0_14px_44px_-24px_rgba(146,64,14,0.35)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t("register")}</CardTitle>
        <CardDescription className="text-center">{t("registerDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <OAuthButtons onError={handleOAuthError} />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="username">{t("username")}</Label>
            <Input
              id="username"
              type="text"
              placeholder={t("usernamePlaceholder")}
              autoComplete="name"
              {...register("username")}
              disabled={isLoading}
            />
            {errors.username && (
              <p className="text-sm text-destructive">{errors.username.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">{t("email")}</Label>
            <Input
              id="email"
              type="email"
              placeholder={t("emailPlaceholder")}
              {...register("email")}
              disabled={isLoading}
            />
            {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">{t("password")}</Label>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              autoComplete="new-password"
              {...register("password")}
              disabled={isLoading}
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
              disabled={isLoading}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("registering") : t("signUpWithPassword")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("haveAccount")}</span>{" "}
          <Link href={loginPath} className="text-primary hover:underline">
            {t("loginNow")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
