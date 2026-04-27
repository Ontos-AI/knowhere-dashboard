"use client";

import { useLinkedAccounts } from "@app/(dashboard)/settings/_hooks/use-accounts";
import { useUpdateEmail, useUpdateProfile } from "@app/(dashboard)/settings/_hooks/use-user";
import { useSendVerificationEmail } from "@app/(dashboard)/settings/_hooks/use-verification";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@components/ui/card";
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Separator } from "@components/ui/separator";
import { Skeleton } from "@components/ui/skeleton";
import { Switch } from "@components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTimezone } from "@hooks/use-timezone";
import { useQueryClient } from "@tanstack/react-query";
import { setCookie } from "@utils/cookies";
import { formatDate } from "@utils/format";
import {
  AlertCircle,
  CheckCircle,
  KeyRound,
  Loader2,
  Lock,
  Mail,
  Save,
  Settings as SettingsIcon,
  User as UserIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";
import { authClient } from "@/lib/better-auth-client";

function SettingsPageSkeleton() {
  return (
    <output className="space-y-6" aria-busy="true">
      {/* Page Header */}
      <div>
        <Skeleton className="h-9 w-32 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Tabs */}
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />

        {/* Profile Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-96" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </div>
              <div className="flex justify-end">
                <Skeleton className="h-10 w-32" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Info Card */}
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-5 w-40" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <span className="sr-only">Loading settings...</span>
    </output>
  );
}

const TIMEZONES = [
  "UTC",
  "Asia/Shanghai",
  "Asia/Tokyo",
  "Asia/Singapore",
  "Asia/Seoul",
  "Asia/Dubai",
  "Asia/Kolkata",
  "Europe/London",
  "Europe/Paris",
  "Europe/Berlin",
  "Europe/Moscow",
  "Europe/Rome",
  "Europe/Madrid",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Toronto",
  "America/Vancouver",
  "America/Sao_Paulo",
  "Australia/Sydney",
  "Australia/Melbourne",
  "Pacific/Auckland",
];

// Profile form schema factory
const createProfileSchema = (t: (key: string) => string) =>
  z.object({
    username: z.string().min(2, { message: t("usernameMinLength") }),
    email: z.string().email({ message: t("emailInvalid") }),
  });

type ProfileForm = z.infer<ReturnType<typeof createProfileSchema>>;

const createSetPasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      newPassword: z.string().min(8, { message: t("newPasswordMinLength") }),
      confirmPassword: z.string().min(8, { message: t("newPasswordMinLength") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });

type SetPasswordForm = z.infer<ReturnType<typeof createSetPasswordSchema>>;

const createChangePasswordSchema = (t: (key: string) => string) =>
  z
    .object({
      currentPassword: z.string().min(1, { message: t("currentPasswordRequired") }),
      newPassword: z.string().min(8, { message: t("newPasswordMinLength") }),
      confirmPassword: z.string().min(8, { message: t("newPasswordMinLength") }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: t("passwordMismatch"),
      path: ["confirmPassword"],
    });

type ChangePasswordForm = z.infer<ReturnType<typeof createChangePasswordSchema>>;

type PasswordApiErrorResponse = {
  readonly message?: string;
};

async function setPasswordWithCurrentSession(newPassword: string): Promise<void> {
  const response = await fetch("/api/account/password", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ newPassword }),
  });

  if (!response.ok) {
    const errorPayload = (await response
      .json()
      .catch(() => null)) as PasswordApiErrorResponse | null;
    throw new Error(errorPayload?.message || "Failed to set password");
  }
}

export default function SettingsPage() {
  const { user, isLoading } = useAuth();
  const toast = useToast();
  const t = useTranslations("Settings");
  const tTimezones = useTranslations("Timezones");
  const locale = useLocale();
  const { setTheme, theme } = useTheme();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { timezone, setTimezone } = useTimezone();

  const updateProfileMutation = useUpdateProfile();
  const updateEmailMutation = useUpdateEmail();
  const sendVerificationMutation = useSendVerificationEmail();
  const { hasOAuthAccount, hasPasswordCredential, oAuthProviderName } = useLinkedAccounts();
  const isSaving = updateProfileMutation.isPending || updateEmailMutation.isPending;
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);

  const [resendCooldown, setResendCooldown] = useState(0);

  const profileSchema = useMemo(() => createProfileSchema(t), [t]);
  const setPasswordSchema = useMemo(() => createSetPasswordSchema(t), [t]);
  const changePasswordSchema = useMemo(() => createChangePasswordSchema(t), [t]);

  const profileForm = useForm<ProfileForm>({
    resolver: zodResolver(profileSchema),
    values: {
      username: user?.name || "",
      email: user?.email || "",
    },
  });
  const setPasswordForm = useForm<SetPasswordForm>({
    resolver: zodResolver(setPasswordSchema),
    defaultValues: {
      newPassword: "",
      confirmPassword: "",
    },
  });
  const changePasswordForm = useForm<ChangePasswordForm>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  const handleUpdateProfile = async (data: ProfileForm) => {
    try {
      // Check if any field has changed
      const usernameChanged = data.username !== user?.name;
      const emailChanged = data.email !== user?.email;

      // Show warning if nothing changed
      if (!usernameChanged && !emailChanged) {
        toast.error(t("noChanges"));
        return;
      }

      // Update profile only if username changed
      if (usernameChanged) {
        await updateProfileMutation.mutateAsync({
          name: data.username,
        });
      }

      // Update email separately if changed (not allowed for OAuth users)
      if (emailChanged && !hasOAuthAccount) {
        await updateEmailMutation.mutateAsync({ email: data.email });
      }

      // No need to manually refresh - mutations auto-invalidate ['user'] query
      toast.success(t("profileUpdated"));
    } catch (error: unknown) {
      console.error("Failed to update profile:", error);
      const message = error instanceof Error ? error.message : t("profileUpdateFailed");
      toast.error(message);
    }
  };

  const handleTimezoneChange = (value: string) => {
    setTimezone(value);
    toast.success(t("timezoneUpdated"));
  };

  const refreshPasswordState = async (): Promise<void> => {
    await authClient.getSession({
      query: { disableCookieCache: true },
    });
    await queryClient.invalidateQueries({ queryKey: ["session"] });
    await queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
  };

  const handleSetPassword = async (data: SetPasswordForm): Promise<void> => {
    setIsPasswordSaving(true);
    try {
      await setPasswordWithCurrentSession(data.newPassword);
      setPasswordForm.reset();
      await refreshPasswordState();
      toast.success(t("passwordSet"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("passwordUpdateFailed");
      toast.error(message);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleChangePassword = async (data: ChangePasswordForm): Promise<void> => {
    setIsPasswordSaving(true);
    try {
      const { error } = await authClient.changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message || t("passwordUpdateFailed"));
      }

      changePasswordForm.reset();
      await refreshPasswordState();
      toast.success(t("passwordUpdated"));
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : t("passwordUpdateFailed");
      toast.error(message);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleResendVerification = async () => {
    try {
      await sendVerificationMutation.mutateAsync(user?.email || "", {
        onSuccess: () => {
          toast.success(t("verificationEmailSent"));
        },
        onError: (error) => {
          toast.error(error.message);
        },
      });

      // Start 60-second cooldown
      setResendCooldown(60);
      const interval = setInterval(() => {
        setResendCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      if (err.code === "TOO_MANY_REQUESTS") {
        toast.error(t("tooManyRequests"));
      } else if (err.code === "BAD_REQUEST" && err.message?.includes("already verified")) {
        toast.info(t("alreadyVerified"));
      } else {
        const message = error instanceof Error ? error.message : t("failedToSendEmail");
        toast.error(message);
      }
    }
  };

  // Warn before browser close/refresh when there are unsaved changes
  useEffect(() => {
    const isDirty = profileForm.formState.isDirty;

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirty) {
        e.preventDefault();
        e.returnValue = ""; // Required for Chrome
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [profileForm.formState.isDirty]);

  // Only show skeleton when initially loading and no user data
  if (isLoading && !user) {
    return <SettingsPageSkeleton />;
  }

  // If not loading but still no user, something is wrong - let layout handle redirect
  if (!user) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("subtitle")}</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList>
          <TabsTrigger value="profile">{t("profile")}</TabsTrigger>
          <TabsTrigger value="security">{t("security")}</TabsTrigger>
          <TabsTrigger value="preferences">{t("preferences")}</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5" />
                {t("profile")}
              </CardTitle>
              <CardDescription>{t("profileDesc")}</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(handleUpdateProfile)} className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="username">{t("username")}</Label>
                    <Input
                      id="username"
                      {...profileForm.register("username")}
                      disabled={isSaving}
                    />
                    {profileForm.formState.errors.username && (
                      <p className="text-sm text-destructive">
                        {profileForm.formState.errors.username.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">{t("email")}</Label>
                    <Input
                      id="email"
                      type="email"
                      {...profileForm.register("email")}
                      disabled={hasOAuthAccount || isSaving}
                      readOnly={hasOAuthAccount}
                    />
                    {hasOAuthAccount ? (
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Lock className="h-3 w-3" />
                        {t("emailManagedByProvider", { provider: oAuthProviderName ?? "" })}
                      </p>
                    ) : (
                      profileForm.formState.errors.email && (
                        <p className="text-sm text-destructive">
                          {profileForm.formState.errors.email.message}
                        </p>
                      )
                    )}
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={isSaving}>
                    <Save className="mr-2 h-4 w-4" />
                    {isSaving ? t("saving") : t("saveChanges")}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card>
            <CardHeader>
              <CardTitle>{t("accountInfo")}</CardTitle>
              <CardDescription>{t("accountInfoDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <Label className="text-sm text-muted-foreground">{t("userId")}</Label>
                  <p className="font-mono text-sm">{user?.id}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t("accountType")}</Label>
                  <p className="text-sm">{user?.role || t("standard")}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t("emailStatus")}</Label>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-mono">{user?.email}</p>
                      {user?.emailVerified ? (
                        <Badge variant="secondary" className="text-xs bg-amber-100 text-amber-800">
                          <CheckCircle className="mr-1 h-3 w-3" />
                          {t("verified")}
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="text-xs border-amber-500/70 text-amber-700"
                        >
                          <AlertCircle className="mr-1 h-3 w-3" />
                          {t("unverified")}
                        </Badge>
                      )}
                    </div>

                    {!user?.emailVerified && (
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResendVerification}
                          disabled={sendVerificationMutation.isPending || resendCooldown > 0}
                        >
                          {sendVerificationMutation.isPending ? (
                            <>
                              <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                              {t("sending")}
                            </>
                          ) : (
                            <>
                              <Mail className="mr-2 h-3 w-3" />
                              {resendCooldown > 0
                                ? t("resendIn", { seconds: resendCooldown })
                                : t("resendVerification")}
                            </>
                          )}
                        </Button>
                        <p className="text-xs text-muted-foreground">{t("checkSpamFolder")}</p>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t("registerTime")}</Label>
                  <p className="text-sm">
                    {user?.createdAt
                      ? formatDate({
                          date: user.createdAt,
                          format: "long",
                          locale,
                          timeZone: timezone,
                        })
                      : "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">{t("accountStatus")}</Label>
                  <p className="text-sm">{t("active")}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <KeyRound className="mr-2 h-5 w-5" />
                {t("passwordSettings")}
              </CardTitle>
              <CardDescription>
                {hasPasswordCredential ? t("passwordDesc") : t("setPasswordDesc")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {hasPasswordCredential ? (
                <form
                  onSubmit={changePasswordForm.handleSubmit(handleChangePassword)}
                  className="space-y-4"
                >
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">{t("currentPassword")}</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      autoComplete="current-password"
                      {...changePasswordForm.register("currentPassword")}
                      disabled={isPasswordSaving}
                    />
                    {changePasswordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-destructive">
                        {changePasswordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">{t("newPassword")}</Label>
                      <Input
                        id="newPassword"
                        type="password"
                        autoComplete="new-password"
                        {...changePasswordForm.register("newPassword")}
                        disabled={isPasswordSaving}
                      />
                      {changePasswordForm.formState.errors.newPassword && (
                        <p className="text-sm text-destructive">
                          {changePasswordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">{t("confirmPassword")}</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        autoComplete="new-password"
                        {...changePasswordForm.register("confirmPassword")}
                        disabled={isPasswordSaving}
                      />
                      {changePasswordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {changePasswordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPasswordSaving}>
                      {isPasswordSaving ? t("updating") : t("updatePassword")}
                    </Button>
                  </div>
                </form>
              ) : (
                <form
                  onSubmit={setPasswordForm.handleSubmit(handleSetPassword)}
                  className="space-y-4"
                >
                  <div className="rounded-md border border-border/70 bg-muted/30 p-4 text-sm text-muted-foreground">
                    {t("noPasswordCredentialDesc")}
                  </div>

                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label htmlFor="setNewPassword">{t("newPassword")}</Label>
                      <Input
                        id="setNewPassword"
                        type="password"
                        autoComplete="new-password"
                        {...setPasswordForm.register("newPassword")}
                        disabled={isPasswordSaving}
                      />
                      {setPasswordForm.formState.errors.newPassword && (
                        <p className="text-sm text-destructive">
                          {setPasswordForm.formState.errors.newPassword.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="setConfirmPassword">{t("confirmPassword")}</Label>
                      <Input
                        id="setConfirmPassword"
                        type="password"
                        autoComplete="new-password"
                        {...setPasswordForm.register("confirmPassword")}
                        disabled={isPasswordSaving}
                      />
                      {setPasswordForm.formState.errors.confirmPassword && (
                        <p className="text-sm text-destructive">
                          {setPasswordForm.formState.errors.confirmPassword.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isPasswordSaving}>
                      {isPasswordSaving ? t("updating") : t("setPassword")}
                    </Button>
                  </div>
                </form>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Preferences Tab */}
        <TabsContent value="preferences" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <SettingsIcon className="mr-2 h-5 w-5" />
                {t("interface")}
              </CardTitle>
              <CardDescription>{t("interfaceDesc")}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>{t("darkMode")}</Label>
                  <p className="text-sm text-muted-foreground">{t("darkModeDesc")}</p>
                </div>
                <Switch
                  checked={theme === "dark"}
                  onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                />
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{t("language")}</Label>
                <Select
                  defaultValue={locale}
                  onValueChange={async (val) => {
                    await setCookie("NEXT_LOCALE", val);
                    router.refresh();
                  }}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="zh">{t("zhCN")}</SelectItem>
                    <SelectItem value="en">{t("enUS")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <Separator />

              <div className="space-y-2">
                <Label>{t("timezone")}</Label>
                <Select value={timezone} onValueChange={handleTimezoneChange}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {TIMEZONES.map((tz) => (
                      <SelectItem key={tz} value={tz}>
                        {tTimezones(tz)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
