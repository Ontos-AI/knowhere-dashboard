"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { OAuthButtons } from "@/app/(auth)/_components/oauth-buttons";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth-client";

// Register page uses the same passwordless flow as login:
// Magic Link automatically creates the user if they do not already exist.
export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();
  const router = useRouter();
  const t = useTranslations("Auth");

  // Magic Link only requires an email address — no password needed
  const registerSchema = useMemo(
    () =>
      z.object({
        email: z.string().email(t("emailInvalid")),
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
      // Trigger Magic Link — creates account automatically if email is new
      const { error } = await authClient.signIn.magicLink({
        email: data.email,
        callbackURL: "/callback/magic-link",
        errorCallbackURL: "/register?error=magic",
        newUserCallbackURL: "/callback/magic-link",
      });

      if (error) {
        throw new Error(error.message || t("magicLinkFailed"));
      }

      toast.success(t("magicLinkSent"));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : t("registerFailed");
      toast.error(t("registerFailed"), errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuthSuccess = () => {
    router.push("/usage");
  };

  const handleOAuthError = (error: string) => {
    toast.error(t("oauthFailed"), error);
  };

  return (
    <Card className="w-full">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl text-center">{t("register")}</CardTitle>
        <CardDescription className="text-center">{t("registerDesc")}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* OAuth registration */}
        <OAuthButtons onSuccess={handleOAuthSuccess} onError={handleOAuthError} />

        {/* Magic Link registration form — email only */}
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

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{t("haveAccount")}</span>{" "}
          <Link href="/login" className="text-primary hover:underline">
            {t("loginNow")}
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
