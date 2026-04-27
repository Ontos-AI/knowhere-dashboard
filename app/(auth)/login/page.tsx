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
import { OAuthButtons } from "@/app/(auth)/_components/oauth-buttons";
import { useToast } from "@/hooks/use-toast";
import { authRedirect } from "@/lib/auth-redirect";
import { authClient } from "@/lib/better-auth-client";

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [isMagicLinkLoading, setIsMagicLinkLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const forgotPasswordPath = authRedirect.buildAuthPagePath("/forgot-password", {
    callbackURL: rawCallbackURL,
  });
  const registerPath = authRedirect.buildAuthPagePath("/register", {
    callbackURL: rawCallbackURL,
  });

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("emailInvalid")),
        password: z.string().min(8, t("passwordMinLength")),
      }),
    [t]
  );

  type LoginForm = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    getValues,
    trigger,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm): Promise<void> => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (error) {
        throw new Error(error.message || t("loginFailed"));
      }

      toast.success(t("loginSuccess"));
      router.push(callbackURL);
      router.refresh();
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("loginFailed");
      toast.error(t("loginFailed"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLinkSignIn = async (): Promise<void> => {
    const isEmailValid = await trigger("email");
    if (!isEmailValid) {
      return;
    }

    setIsMagicLinkLoading(true);
    try {
      const { error } = await authClient.signIn.magicLink({
        email: getValues("email"),
        callbackURL,
        errorCallbackURL: authRedirect.buildMagicLinkErrorCallbackURL("/login", {
          callbackURL: rawCallbackURL,
          error: "magic",
        }),
        newUserCallbackURL: callbackURL,
      });

      if (error) {
        throw new Error(error.message || t("magicLinkFailed"));
      }

      toast.success(t("magicLinkSent"));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("magicLinkFailed");
      toast.error(t("magicLinkFailed"), errorMessage);
    } finally {
      setIsMagicLinkLoading(false);
    }
  };

  const handleOAuthError = (error: string): void => {
    toast.error(t("oauthFailed"), error);
  };

  return (
    <Card className="w-full border-border/80 bg-card/95 shadow-[0_14px_44px_-24px_rgba(146,64,14,0.35)]">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t("login")}</CardTitle>
        <CardDescription className="text-center">{t("loginDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth登录 */}
        <OAuthButtons onError={handleOAuthError} />

        {/* Email/password login form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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
            <div className="flex items-center justify-between">
              <Label htmlFor="password">{t("password")}</Label>
              <Link href={forgotPasswordPath} className="text-xs text-primary hover:underline">
                {t("forgotPassword")}
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              placeholder={t("passwordPlaceholder")}
              autoComplete="current-password"
              {...register("password")}
              disabled={isLoading}
            />
            {errors.password && (
              <p className="text-sm text-destructive">{errors.password.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("signingIn") : t("signInWithPassword")}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full"
            disabled={isLoading || isMagicLinkLoading}
            onClick={handleMagicLinkSignIn}
          >
            {isMagicLinkLoading ? t("sending") : t("sendMagicLink")}
          </Button>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("noAccount")}</span>{" "}
          <Link href={registerPath} className="text-primary hover:underline">
            {t("registerNow")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
