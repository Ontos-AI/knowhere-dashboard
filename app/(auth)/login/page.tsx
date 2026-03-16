"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAppConfigContext } from "@providers/config-provider";
import { useSearchParams } from "next/navigation";
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
  const toast = useToast();
  const _appConfig = useAppConfigContext();
  const searchParams = useSearchParams();
  const t = useTranslations("Auth");
  const rawCallbackURL = searchParams.get("callbackURL");
  const callbackURL = authRedirect.resolveCallbackURL(rawCallbackURL);
  const errorCallbackURL = authRedirect.buildMagicLinkErrorCallbackURL("/login", {
    callbackURL: rawCallbackURL,
    error: "magic",
  });

  const loginSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("emailInvalid")),
      }),
    [t]
  );

  type LoginForm = z.infer<typeof loginSchema>;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginForm) => {
    setIsLoading(true);
    try {
      const { error } = await authClient.signIn.magicLink({
        email: data.email,
        callbackURL,
        errorCallbackURL,
        newUserCallbackURL: callbackURL,
      });

      if (error) {
        throw new Error(error.message || t("magicLinkFailed"));
      }

      toast.success(t("magicLinkSent"));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("loginFailed");
      toast.error(t("loginFailed"), errorMessage);
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
        <CardTitle className="text-2xl text-center">{t("login")}</CardTitle>
        <CardDescription className="text-center">{t("loginDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth登录 */}
        <OAuthButtons onError={handleOAuthError} />

        {/* 邮箱 Magic Link 登录表单 */}
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? t("sending") : t("sendMagicLink")}
          </Button>
        </form>

        {/* <div className="text-center text-sm">
          <span className="text-muted-foreground">还没有账户？</span>{' '}
          <Link href="/register" className="text-primary hover:underline">
            立即注册
          </Link>
        </div> */}
      </CardContent>
    </Card>
  );
}
