"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTimezone } from "@hooks/use-timezone";
import { useToast } from "@hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";
import { formatDate } from "@utils/format";
import { Check, Loader2, Lock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { startTransition, useEffect, useMemo, useState } from "react";
import { type UseFormReturn, useForm } from "react-hook-form";
import { z } from "zod";
import { useLinkedAccounts } from "@/app/(dashboard)/settings/_hooks/use-accounts";
import { useUpdateEmail, useUpdateProfile } from "@/app/(dashboard)/settings/_hooks/use-user";
import { useSendVerificationEmail } from "@/app/(dashboard)/settings/_hooks/use-verification";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { type AuthUser, useAuth } from "@/hooks/use-auth";
import { authClient } from "@/lib/better-auth-client";
import { cn } from "@/lib/utils";
import { useAppConfigContext } from "@/providers/config-provider";
import { setCookie } from "@/utils/cookies";

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
] as const;

const SECTION_ELEMENT_IDS = {
  profile: "settings-profile",
  security: "settings-security",
  preferences: "settings-preferences",
} as const;

type SettingsSectionId = keyof typeof SECTION_ELEMENT_IDS;

const formInputClassName =
  "h-10 w-full border bg-card px-[10px] text-xs leading-[14px] text-[#083b3a] outline-none transition-colors placeholder:text-muted-foreground focus-visible:border-[#19a88b] focus-visible:ring-2 focus-visible:ring-[#19a88b]/15 dark:bg-[#083b3a] dark:text-[#f0f2e6] lg:px-3 lg:leading-4";

const formFieldLabelClassName =
  "text-xs leading-[18px] text-muted-foreground lg:text-sm lg:leading-5";
const infoFieldLabelClassName = "text-xs leading-[14px] text-muted-foreground lg:leading-4";
const fieldValueClassName = "text-xs leading-[18px] text-foreground lg:text-sm lg:leading-5";

const createProfileSchema = (messages: { emailInvalid: string; usernameMinLength: string }) =>
  z.object({
    email: z.string().email({ message: messages.emailInvalid }),
    username: z.string().min(2, { message: messages.usernameMinLength }),
  });

type ProfileFormValues = z.infer<ReturnType<typeof createProfileSchema>>;

const createSetPasswordSchema = (messages: {
  newPasswordMinLength: string;
  passwordMismatch: string;
}) =>
  z
    .object({
      confirmPassword: z.string().min(8, { message: messages.newPasswordMinLength }),
      newPassword: z.string().min(8, { message: messages.newPasswordMinLength }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ["confirmPassword"],
    });

type SetPasswordFormValues = z.infer<ReturnType<typeof createSetPasswordSchema>>;

const createChangePasswordSchema = (messages: {
  currentPasswordRequired: string;
  newPasswordMinLength: string;
  passwordMismatch: string;
}) =>
  z
    .object({
      confirmPassword: z.string().min(8, { message: messages.newPasswordMinLength }),
      currentPassword: z.string().min(1, { message: messages.currentPasswordRequired }),
      newPassword: z.string().min(8, { message: messages.newPasswordMinLength }),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: messages.passwordMismatch,
      path: ["confirmPassword"],
    });

type ChangePasswordFormValues = z.infer<ReturnType<typeof createChangePasswordSchema>>;

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

const SettingsPageSkeleton = () => {
  return (
    <div className="flex w-full flex-col gap-[22px] lg:gap-5" aria-busy="true">
      <div className="h-[42px] w-full animate-pulse bg-muted sm:h-[22px] sm:w-[420px] lg:h-6 lg:w-[360px]" />
      <div className="h-9 w-[198px] animate-pulse bg-border lg:h-8 lg:w-[205px]" />
      <div className="h-[622px] animate-pulse border border-border bg-background sm:h-[670px] lg:h-[624px]" />
      <div className="h-[270px] animate-pulse border border-border bg-background lg:h-[230px]" />
      <span className="sr-only">Loading settings</span>
    </div>
  );
};

export const SettingsPage = () => {
  const { user, isLoading } = useAuth();
  const { hasOAuthAccount, hasPasswordCredential, oAuthProviderName } = useLinkedAccounts();
  const updateProfileMutation = useUpdateProfile();
  const updateEmailMutation = useUpdateEmail();
  const sendVerificationMutation = useSendVerificationEmail();
  const queryClient = useQueryClient();
  const { timezone, setTimezone } = useTimezone();
  const { theme, setTheme } = useTheme();
  const toast = useToast();
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("Settings");
  const tCommon = useTranslations("Common");
  const tTimezones = useTranslations("Timezones");
  const { passwordLoginEnabled } = useAppConfigContext();
  const [activeSection, setActiveSection] = useState<SettingsSectionId>("profile");
  const [isPasswordSaving, setIsPasswordSaving] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const hasUser = Boolean(user);
  const userEmail = user?.email ?? "";
  const userName = user?.name ?? "";

  const profileForm = useForm<ProfileFormValues>({
    defaultValues: {
      email: "",
      username: "",
    },
    resolver: zodResolver(
      createProfileSchema({
        emailInvalid: t("emailInvalid"),
        usernameMinLength: t("usernameMinLength"),
      })
    ),
  });

  const setPasswordForm = useForm<SetPasswordFormValues>({
    defaultValues: {
      confirmPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(
      createSetPasswordSchema({
        newPasswordMinLength: t("newPasswordMinLength"),
        passwordMismatch: t("passwordMismatch"),
      })
    ),
  });

  const changePasswordForm = useForm<ChangePasswordFormValues>({
    defaultValues: {
      confirmPassword: "",
      currentPassword: "",
      newPassword: "",
    },
    resolver: zodResolver(
      createChangePasswordSchema({
        currentPasswordRequired: t("currentPasswordRequired"),
        newPasswordMinLength: t("newPasswordMinLength"),
        passwordMismatch: t("passwordMismatch"),
      })
    ),
  });

  const isSaving = updateProfileMutation.isPending || updateEmailMutation.isPending;
  const activeTheme =
    theme === "light" || theme === "dark" || theme === "system" ? theme : "system";
  const visibleSectionIds = useMemo<SettingsSectionId[]>(
    () =>
      passwordLoginEnabled
        ? (Object.keys(SECTION_ELEMENT_IDS) as SettingsSectionId[])
        : ["profile", "preferences"],
    [passwordLoginEnabled]
  );

  useEffect(() => {
    if (!hasUser) {
      return;
    }

    profileForm.reset({
      email: userEmail,
      username: userName,
    });
  }, [hasUser, profileForm, userEmail, userName]);

  useEffect(() => {
    if (!profileForm.formState.isDirty) {
      return;
    }

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [profileForm.formState.isDirty]);

  useEffect(() => {
    if (resendCooldown === 0) {
      return;
    }

    const timer = window.setTimeout(() => {
      setResendCooldown((currentCooldown) => Math.max(currentCooldown - 1, 0));
    }, 1000);

    return () => window.clearTimeout(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const syncActiveSection = () => {
      const nextActiveSection = visibleSectionIds.reduce<SettingsSectionId>(
        (currentSection, sectionId) => {
          const sectionElement = document.getElementById(SECTION_ELEMENT_IDS[sectionId]);

          if (!sectionElement) {
            return currentSection;
          }

          return sectionElement.getBoundingClientRect().top <= 140 ? sectionId : currentSection;
        },
        "profile"
      );

      setActiveSection(nextActiveSection);
    };

    syncActiveSection();

    window.addEventListener("scroll", syncActiveSection, { passive: true });
    return () => window.removeEventListener("scroll", syncActiveSection);
  }, [visibleSectionIds]);

  const handleSectionSelect = (sectionId: SettingsSectionId) => {
    setActiveSection(sectionId);
    const sectionElement = document.getElementById(SECTION_ELEMENT_IDS[sectionId]);
    sectionElement?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const handleProfileSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      return;
    }

    try {
      const usernameChanged = values.username !== user.name;
      const emailChanged = values.email !== user.email;

      if (!usernameChanged && !emailChanged) {
        toast.error(t("noChanges"));
        return;
      }

      if (usernameChanged) {
        await updateProfileMutation.mutateAsync({ name: values.username });
      }

      if (emailChanged && !hasOAuthAccount) {
        await updateEmailMutation.mutateAsync({ email: values.email });
      }

      profileForm.reset(values);
      toast.success(t("profileUpdated"));
    } catch (error) {
      console.error("Failed to update settings profile:", error);
      toast.error(error instanceof Error ? error.message : t("profileUpdateFailed"));
    }
  };

  const handleLocaleChange = async (nextLocale: string) => {
    await setCookie("NEXT_LOCALE", nextLocale);
    startTransition(() => router.refresh());
  };

  const handleTimezoneChange = (nextTimezone: string) => {
    setTimezone(nextTimezone);
    toast.success(t("timezoneUpdated"));
  };

  const refreshPasswordState = async (): Promise<void> => {
    await authClient.getSession({
      query: { disableCookieCache: true },
    });
    await queryClient.invalidateQueries({ queryKey: ["session"] });
    await queryClient.invalidateQueries({ queryKey: ["linked-accounts"] });
  };

  const handleSetPassword = async (values: SetPasswordFormValues): Promise<void> => {
    setIsPasswordSaving(true);

    try {
      await setPasswordWithCurrentSession(values.newPassword);
      setPasswordForm.reset();
      await refreshPasswordState();
      toast.success(t("passwordSet"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("passwordUpdateFailed");
      toast.error(message);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleChangePassword = async (values: ChangePasswordFormValues): Promise<void> => {
    setIsPasswordSaving(true);

    try {
      const { error } = await authClient.changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
        revokeOtherSessions: true,
      });

      if (error) {
        throw new Error(error.message || t("passwordUpdateFailed"));
      }

      changePasswordForm.reset();
      await refreshPasswordState();
      toast.success(t("passwordUpdated"));
    } catch (error) {
      const message = error instanceof Error ? error.message : t("passwordUpdateFailed");
      toast.error(message);
    } finally {
      setIsPasswordSaving(false);
    }
  };

  const handleResendVerification = async () => {
    if (!user?.email) {
      return;
    }

    try {
      await sendVerificationMutation.mutateAsync(user.email);
      setResendCooldown(60);
      toast.success(t("verificationEmailSent"));
    } catch (error: unknown) {
      const mutationError = error as { code?: string; message?: string };

      if (mutationError.code === "TOO_MANY_REQUESTS") {
        toast.error(t("tooManyRequests"));
        return;
      }

      if (
        mutationError.code === "BAD_REQUEST" &&
        mutationError.message?.toLowerCase().includes("already verified")
      ) {
        toast.info(t("alreadyVerified"));
        return;
      }

      toast.error(error instanceof Error ? error.message : t("failedToSendEmail"));
    }
  };

  if (isLoading && !user) {
    return <SettingsPageSkeleton />;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="flex w-full flex-col gap-[22px] font-sans text-[#083b3a] dark:text-[#f0f2e6] lg:gap-5">
      <div className="flex flex-col gap-0.5 sm:hidden">
        <h2 className="truncate text-sm font-medium leading-[22px] text-[#083b3a] dark:text-[#f0f2e6]">
          {t("title")}
        </h2>
        <p className="text-xs leading-[18px] text-muted-foreground">{t("subtitle")}</p>
      </div>

      <p className="hidden text-[14px] leading-[22px] text-foreground sm:block lg:text-base lg:leading-6">
        {t("subtitle")}
      </p>

      <SettingsSectionTabs
        activeSection={activeSection}
        onSectionSelect={handleSectionSelect}
        preferencesLabel={t("preferences")}
        profileLabel={t("profile")}
        securityLabel={t("security")}
        showSecurity={passwordLoginEnabled}
      />

      <SettingsProfileSection
        accountInformationLabel={t("accountInfo")}
        accountStatusLabel={t("accountStatus")}
        accountTypeLabel={t("accountType")}
        activeLabel={t("active")}
        checkSpamFolderLabel={t("checkSpamFolder")}
        emailLabel={t("email")}
        emailManagedByProviderLabel={
          hasOAuthAccount
            ? t("emailManagedByProvider", { provider: oAuthProviderName ?? "" })
            : null
        }
        emailStatusLabel={t("emailStatus")}
        form={profileForm}
        hasOAuthAccount={hasOAuthAccount}
        id={SECTION_ELEMENT_IDS.profile}
        isSaving={isSaving}
        locale={locale}
        onResendVerification={handleResendVerification}
        onSubmit={handleProfileSubmit}
        registerTimeLabel={t("registerTime")}
        resendLabel={
          resendCooldown > 0 ? t("resendIn", { seconds: resendCooldown }) : t("resendVerification")
        }
        resendPending={sendVerificationMutation.isPending}
        saveChangesLabel={t("saveChanges")}
        savingLabel={t("saving")}
        sendingLabel={t("sending")}
        standardLabel={t("standard")}
        timezone={timezone}
        unverifiedLabel={t("unverified")}
        user={user}
        userIdLabel={t("userId")}
        usernameLabel={t("username")}
        verifiedLabel={t("verified")}
      />

      {passwordLoginEnabled ? (
        <SettingsPasswordSection
          changePasswordForm={changePasswordForm}
          confirmPasswordLabel={t("confirmPassword")}
          currentPasswordLabel={t("currentPassword")}
          description={hasPasswordCredential ? t("passwordDesc") : t("setPasswordDesc")}
          hasPasswordCredential={hasPasswordCredential}
          id={SECTION_ELEMENT_IDS.security}
          isSaving={isPasswordSaving}
          newPasswordLabel={t("newPassword")}
          noPasswordCredentialDescription={t("noPasswordCredentialDesc")}
          onChangePassword={handleChangePassword}
          onSetPassword={handleSetPassword}
          setPasswordForm={setPasswordForm}
          setPasswordLabel={t("setPassword")}
          title={t("passwordSettings")}
          updatePasswordLabel={t("updatePassword")}
          updatingLabel={t("updating")}
        />
      ) : null}

      <SettingsPreferencesSection
        enLabel={t("enUS")}
        id={SECTION_ELEMENT_IDS.preferences}
        languageLabel={t("language")}
        locale={locale}
        onLocaleChange={handleLocaleChange}
        onThemeChange={(nextTheme) => setTheme(nextTheme)}
        onTimezoneChange={handleTimezoneChange}
        theme={activeTheme}
        themeDarkLabel={tCommon("themeDark")}
        themeLabel={t("theme")}
        themeLightLabel={tCommon("themeLight")}
        themeSystemLabel={tCommon("themeSystem")}
        timezone={timezone}
        timezoneLabel={t("timezone")}
        tTimezones={tTimezones}
        zhLabel={t("zhCN")}
      />
    </div>
  );
};

const SettingsSectionTabs = ({
  activeSection,
  onSectionSelect,
  preferencesLabel,
  profileLabel,
  securityLabel,
  showSecurity,
}: {
  activeSection: SettingsSectionId;
  onSectionSelect: (sectionId: SettingsSectionId) => void;
  preferencesLabel: string;
  profileLabel: string;
  securityLabel: string;
  showSecurity: boolean;
}) => {
  return (
    <nav aria-label="Settings sections" className="flex items-center gap-px">
      <button
        type="button"
        className={cn(
          "flex h-9 min-w-[83px] items-end justify-center px-[14px] pb-3 pt-[6px] font-mono-display text-xs leading-4 transition-colors lg:h-8 lg:min-w-[87px] lg:px-4 lg:pb-2 lg:pt-2",
          activeSection === "profile"
            ? "border-b-[3px] border-primary bg-primary font-bold text-primary-foreground lg:border-b-4"
            : "bg-muted font-light text-foreground"
        )}
        aria-current={activeSection === "profile" ? "page" : undefined}
        onClick={() => onSectionSelect("profile")}
      >
        {profileLabel}
      </button>
      {showSecurity ? (
        <button
          type="button"
          className={cn(
            "flex h-9 min-w-[83px] items-end justify-center px-[14px] pb-3 pt-[6px] font-mono-display text-xs leading-4 transition-colors lg:h-8 lg:min-w-[87px] lg:px-4 lg:pb-2 lg:pt-2",
            activeSection === "security"
              ? "border-b-[3px] border-primary bg-primary font-bold text-primary-foreground lg:border-b-4"
              : "bg-muted font-light text-foreground"
          )}
          aria-current={activeSection === "security" ? "page" : undefined}
          onClick={() => onSectionSelect("security")}
        >
          {securityLabel}
        </button>
      ) : null}
      <button
        type="button"
        className={cn(
          "flex h-9 min-w-[114px] items-end justify-center px-[14px] pb-[10px] pt-[6px] font-mono-display text-xs leading-4 transition-colors lg:h-8 lg:min-w-[118px] lg:px-4 lg:pb-2 lg:pt-2",
          activeSection === "preferences"
            ? "border-b-[3px] border-primary bg-primary font-bold text-primary-foreground lg:border-b-4"
            : "bg-muted font-light text-foreground"
        )}
        aria-current={activeSection === "preferences" ? "page" : undefined}
        onClick={() => onSectionSelect("preferences")}
      >
        {preferencesLabel}
      </button>
    </nav>
  );
};

const SettingsProfileSection = ({
  accountInformationLabel,
  accountStatusLabel,
  accountTypeLabel,
  activeLabel,
  checkSpamFolderLabel,
  emailLabel,
  emailManagedByProviderLabel,
  emailStatusLabel,
  form,
  hasOAuthAccount,
  id,
  isSaving,
  locale,
  onResendVerification,
  onSubmit,
  registerTimeLabel,
  resendLabel,
  resendPending,
  saveChangesLabel,
  savingLabel,
  sendingLabel,
  standardLabel,
  timezone,
  unverifiedLabel,
  user,
  userIdLabel,
  usernameLabel,
  verifiedLabel,
}: {
  accountInformationLabel: string;
  accountStatusLabel: string;
  accountTypeLabel: string;
  activeLabel: string;
  checkSpamFolderLabel: string;
  emailLabel: string;
  emailManagedByProviderLabel: string | null;
  emailStatusLabel: string;
  form: UseFormReturn<ProfileFormValues>;
  hasOAuthAccount: boolean;
  id: string;
  isSaving: boolean;
  locale: string;
  onResendVerification: () => void;
  onSubmit: (values: ProfileFormValues) => void | Promise<void>;
  registerTimeLabel: string;
  resendLabel: string;
  resendPending: boolean;
  saveChangesLabel: string;
  savingLabel: string;
  sendingLabel: string;
  standardLabel: string;
  timezone: string;
  unverifiedLabel: string;
  user: AuthUser;
  userIdLabel: string;
  usernameLabel: string;
  verifiedLabel: string;
}) => {
  return (
    <section
      id={id}
      className="scroll-mt-6 border border-border bg-background px-[38px] pb-[38px] pt-[30px] dark:border-border dark:bg-card sm:px-[26px] sm:pb-[26px] sm:pt-[22px] lg:px-10 lg:pb-10 lg:pt-8"
    >
      <div className="flex flex-col gap-[46px] sm:gap-[62px] lg:gap-16">
        <form
          className="flex w-full flex-col gap-[14px] sm:gap-[22px] lg:w-[300px] lg:gap-6"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <div className="flex flex-col gap-[6px] lg:gap-2">
            <label className={formFieldLabelClassName} htmlFor="settings-username">
              {usernameLabel}
            </label>
            <input
              id="settings-username"
              className={cn(formInputClassName, "border-border")}
              disabled={isSaving}
              {...form.register("username")}
            />
            {form.formState.errors.username ? (
              <p className="text-xs leading-4 text-destructive">
                {form.formState.errors.username.message}
              </p>
            ) : null}
          </div>

          <div className="flex flex-col gap-[6px] pb-[14px] lg:gap-2 lg:pb-4">
            <label className={formFieldLabelClassName} htmlFor="settings-email">
              {emailLabel}
            </label>
            <input
              id="settings-email"
              className={cn(
                formInputClassName,
                hasOAuthAccount
                  ? "border-border text-muted-foreground dark:border-border"
                  : "border-border text-foreground dark:border-border dark:text-foreground"
              )}
              readOnly={hasOAuthAccount}
              disabled={isSaving && !hasOAuthAccount}
              {...form.register("email")}
            />
            {emailManagedByProviderLabel ? (
              <p className="flex items-center gap-0.5 text-xs leading-[14px] text-muted-foreground lg:gap-1 lg:leading-4">
                <Lock className="size-3.5 shrink-0" />
                <span>{emailManagedByProviderLabel}</span>
              </p>
            ) : form.formState.errors.email ? (
              <p className="text-xs leading-4 text-destructive">
                {form.formState.errors.email.message}
              </p>
            ) : null}
          </div>

          <DashboardActionButton
            variant="primary"
            size="compact"
            className="w-fit min-w-[114px] lg:min-w-[118px]"
            disabled={isSaving}
            type="submit"
          >
            {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
            <span>{isSaving ? savingLabel : saveChangesLabel}</span>
          </DashboardActionButton>
        </form>

        <div className="flex flex-col gap-[22px] sm:gap-[38px] lg:gap-10">
          <h2 className="text-xs font-bold leading-[18px] text-foreground lg:text-sm lg:leading-5">
            {accountInformationLabel}
          </h2>

          <div className="grid gap-y-[18px] sm:gap-y-[22px] lg:grid-cols-2 lg:gap-x-8 lg:gap-y-6">
            <SettingsInfoField label={userIdLabel} value={user.id} />
            <SettingsInfoField label={accountTypeLabel} value={standardLabel} />

            <div className="space-y-0.5 lg:space-y-1">
              <p className={infoFieldLabelClassName}>{emailStatusLabel}</p>
              <div className="flex flex-wrap items-center gap-[10px]">
                <p className={cn(fieldValueClassName, "break-all")}>{user.email}</p>
                {user.emailVerified ? (
                  <span className="inline-flex items-center gap-px border border-[#7efedd] bg-[#caffee] px-0.5 py-px text-xs font-medium leading-[14px] text-[#0a6351] lg:gap-0.5 lg:px-1 lg:py-0.5 lg:leading-4 dark:border-[#054437] dark:bg-[#01251d] dark:text-[#27efc6]">
                    <Check className="size-3.5" strokeWidth={2.25} />
                    <span>{verifiedLabel}</span>
                  </span>
                ) : (
                  <span className="inline-flex items-center border border-[#ffe1df] bg-[#fff0ef] px-1 py-0.5 text-xs font-medium leading-4 text-[#a42900] dark:border-[#731a00] dark:bg-[#420b00] dark:text-[#ffa79f]">
                    {unverifiedLabel}
                  </span>
                )}
              </div>

              {!user.emailVerified ? (
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  <DashboardActionButton
                    type="button"
                    variant="secondary"
                    size="small"
                    disabled={resendPending}
                    onClick={onResendVerification}
                  >
                    {resendPending ? <Loader2 className="size-3.5 animate-spin" /> : null}
                    <span>{resendPending ? sendingLabel : resendLabel}</span>
                  </DashboardActionButton>
                  <p className="text-xs leading-4 text-muted-foreground">{checkSpamFolderLabel}</p>
                </div>
              ) : null}
            </div>

            <SettingsInfoField
              label={registerTimeLabel}
              value={
                user.createdAt
                  ? formatDate({
                      date: user.createdAt,
                      format: "long",
                      locale,
                      timeZone: timezone,
                    })
                  : "-"
              }
            />

            <SettingsInfoField
              label={accountStatusLabel}
              value={activeLabel}
              valueClassName="text-primary"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const SettingsPasswordSection = ({
  changePasswordForm,
  confirmPasswordLabel,
  currentPasswordLabel,
  description,
  hasPasswordCredential,
  id,
  isSaving,
  newPasswordLabel,
  noPasswordCredentialDescription,
  onChangePassword,
  onSetPassword,
  setPasswordForm,
  setPasswordLabel,
  title,
  updatePasswordLabel,
  updatingLabel,
}: {
  changePasswordForm: UseFormReturn<ChangePasswordFormValues>;
  confirmPasswordLabel: string;
  currentPasswordLabel: string;
  description: string;
  hasPasswordCredential: boolean;
  id: string;
  isSaving: boolean;
  newPasswordLabel: string;
  noPasswordCredentialDescription: string;
  onChangePassword: (values: ChangePasswordFormValues) => void | Promise<void>;
  onSetPassword: (values: SetPasswordFormValues) => void | Promise<void>;
  setPasswordForm: UseFormReturn<SetPasswordFormValues>;
  setPasswordLabel: string;
  title: string;
  updatePasswordLabel: string;
  updatingLabel: string;
}) => {
  return (
    <section
      id={id}
      className="scroll-mt-6 border border-border bg-background px-6 py-8 sm:px-10 sm:py-8"
    >
      <div className="flex flex-col gap-6">
        <div className="space-y-2">
          <h2 className="text-sm font-bold leading-5 text-foreground">{title}</h2>
          <p className="max-w-[520px] text-sm leading-5 text-muted-foreground">{description}</p>
        </div>

        {hasPasswordCredential ? (
          <form
            className="flex w-full flex-col gap-5 lg:w-[420px]"
            onSubmit={changePasswordForm.handleSubmit(onChangePassword)}
          >
            <SettingsPasswordField
              autoComplete="current-password"
              error={changePasswordForm.formState.errors.currentPassword?.message}
              id="settings-current-password"
              isSaving={isSaving}
              label={currentPasswordLabel}
              registration={changePasswordForm.register("currentPassword")}
            />
            <SettingsPasswordField
              autoComplete="new-password"
              error={changePasswordForm.formState.errors.newPassword?.message}
              id="settings-new-password"
              isSaving={isSaving}
              label={newPasswordLabel}
              registration={changePasswordForm.register("newPassword")}
            />
            <SettingsPasswordField
              autoComplete="new-password"
              error={changePasswordForm.formState.errors.confirmPassword?.message}
              id="settings-confirm-password"
              isSaving={isSaving}
              label={confirmPasswordLabel}
              registration={changePasswordForm.register("confirmPassword")}
            />

            <DashboardActionButton
              variant="primary"
              size="compact"
              className="w-fit min-w-[132px]"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              <span>{isSaving ? updatingLabel : updatePasswordLabel}</span>
            </DashboardActionButton>
          </form>
        ) : (
          <form
            className="flex w-full flex-col gap-5 lg:w-[420px]"
            onSubmit={setPasswordForm.handleSubmit(onSetPassword)}
          >
            <div className="border border-border bg-card px-4 py-3 text-sm leading-5 text-muted-foreground">
              {noPasswordCredentialDescription}
            </div>
            <SettingsPasswordField
              autoComplete="new-password"
              error={setPasswordForm.formState.errors.newPassword?.message}
              id="settings-set-new-password"
              isSaving={isSaving}
              label={newPasswordLabel}
              registration={setPasswordForm.register("newPassword")}
            />
            <SettingsPasswordField
              autoComplete="new-password"
              error={setPasswordForm.formState.errors.confirmPassword?.message}
              id="settings-set-confirm-password"
              isSaving={isSaving}
              label={confirmPasswordLabel}
              registration={setPasswordForm.register("confirmPassword")}
            />

            <DashboardActionButton
              variant="primary"
              size="compact"
              className="w-fit min-w-[118px]"
              disabled={isSaving}
              type="submit"
            >
              {isSaving ? <Loader2 className="size-4 animate-spin" /> : null}
              <span>{isSaving ? updatingLabel : setPasswordLabel}</span>
            </DashboardActionButton>
          </form>
        )}
      </div>
    </section>
  );
};

const SettingsPasswordField = ({
  autoComplete,
  error,
  id,
  isSaving,
  label,
  registration,
}: {
  autoComplete: string;
  error?: string;
  id: string;
  isSaving: boolean;
  label: string;
  registration: ReturnType<UseFormReturn<ChangePasswordFormValues>["register"]>;
}) => {
  return (
    <div className="space-y-2">
      <label className={formFieldLabelClassName} htmlFor={id}>
        {label}
      </label>
      <input
        autoComplete={autoComplete}
        className={cn(formInputClassName, "border-border")}
        disabled={isSaving}
        id={id}
        type="password"
        {...registration}
      />
      {error ? <p className="text-xs leading-4 text-destructive">{error}</p> : null}
    </div>
  );
};

const SettingsPreferencesSection = ({
  enLabel,
  id,
  languageLabel,
  locale,
  onLocaleChange,
  onThemeChange,
  onTimezoneChange,
  theme,
  themeDarkLabel,
  themeLabel,
  themeLightLabel,
  themeSystemLabel,
  timezone,
  timezoneLabel,
  tTimezones,
  zhLabel,
}: {
  enLabel: string;
  id: string;
  languageLabel: string;
  locale: string;
  onLocaleChange: (nextLocale: string) => void | Promise<void>;
  onThemeChange: (nextTheme: "light" | "dark" | "system") => void;
  onTimezoneChange: (nextTimezone: string) => void;
  theme: "light" | "dark" | "system";
  themeDarkLabel: string;
  themeLabel: string;
  themeLightLabel: string;
  themeSystemLabel: string;
  timezone: string;
  timezoneLabel: string;
  tTimezones: (key: string) => string;
  zhLabel: string;
}) => {
  const triggerClassName =
    "h-10 w-full rounded-none border-border bg-card pl-2 pr-[6px] text-xs leading-[14px] text-[#083b3a] shadow-none hover:border-muted-foreground/40 focus:border-[#19a88b] focus:ring-2 focus:ring-[#19a88b]/15 dark:border-[#156462] dark:bg-[#083b3a] dark:text-[#f0f2e6] lg:w-[340px] lg:pl-[10px] lg:pr-2 lg:leading-4 [&>svg]:h-4 [&>svg]:w-4";

  const contentClassName = "rounded-none border-border shadow-none dark:border-[#156462]";
  const itemClassName = "px-3 py-2 text-xs leading-4 text-[#083b3a] dark:text-[#f0f2e6]";

  return (
    <section
      id={id}
      className="scroll-mt-6 border border-border bg-background dark:border-[#156462] dark:bg-[#083b3a]"
    >
      <SettingsPreferenceRow label={themeLabel} layout="stacked">
        <Select
          value={theme}
          onValueChange={(nextTheme) => {
            if (nextTheme === "light" || nextTheme === "dark" || nextTheme === "system") {
              onThemeChange(nextTheme);
            }
          }}
        >
          <SelectTrigger className={triggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className={contentClassName}>
            <SelectItem className={itemClassName} value="light">
              {themeLightLabel}
            </SelectItem>
            <SelectItem className={itemClassName} value="dark">
              {themeDarkLabel}
            </SelectItem>
            <SelectItem className={itemClassName} value="system">
              {themeSystemLabel}
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingsPreferenceRow>

      <SettingsPreferenceRow label={languageLabel} layout="stacked">
        <Select defaultValue={locale} onValueChange={onLocaleChange}>
          <SelectTrigger className={triggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className={contentClassName}>
            <SelectItem className={itemClassName} value="en">
              {enLabel}
            </SelectItem>
            <SelectItem className={itemClassName} value="zh">
              {zhLabel}
            </SelectItem>
          </SelectContent>
        </Select>
      </SettingsPreferenceRow>

      <SettingsPreferenceRow label={timezoneLabel} layout="stacked">
        <Select value={timezone} onValueChange={onTimezoneChange}>
          <SelectTrigger className={triggerClassName}>
            <SelectValue />
          </SelectTrigger>
          <SelectContent align="end" className={contentClassName}>
            {TIMEZONES.map((timezoneOption) => (
              <SelectItem className={itemClassName} key={timezoneOption} value={timezoneOption}>
                {tTimezones(timezoneOption)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </SettingsPreferenceRow>
    </section>
  );
};

const SettingsPreferenceRow = ({
  children,
  label,
  layout,
}: {
  children: React.ReactNode;
  label: string;
  layout: "inline" | "stacked";
}) => {
  return (
    <div
      className={cn(
        "border-t border-border px-[26px] py-[18px] first:border-t-0 dark:border-border lg:px-10 lg:py-5",
        layout === "inline"
          ? "flex h-[66px] items-center gap-[30px] lg:h-[70px] lg:gap-8"
          : "flex h-[102px] flex-col items-start justify-center gap-2 lg:h-20 lg:flex-row lg:items-center lg:gap-8"
      )}
    >
      <p className="flex-1 text-xs font-medium leading-[18px] text-[#083b3a] dark:text-[#f0f2e6] lg:text-sm lg:leading-5">
        {label}
      </p>
      <div className={cn(layout === "inline" ? "shrink-0" : "w-full lg:w-auto")}>{children}</div>
    </div>
  );
};

const SettingsInfoField = ({
  label,
  value,
  valueClassName,
}: {
  label: string;
  value: string;
  valueClassName?: string;
}) => {
  return (
    <div className="space-y-0.5 lg:space-y-1">
      <p className={infoFieldLabelClassName}>{label}</p>
      <p className={cn(fieldValueClassName, "break-words", valueClassName)}>{value}</p>
    </div>
  );
};
