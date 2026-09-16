"use client";

import { useTranslations } from "next-intl";
import { EmailLoginForm } from "@/app/(auth)/login/_components/email-login-form";
import { SocialLoginButtons } from "@/app/(auth)/login/_components/social-login-buttons";
import { useLoginActions } from "@/app/(auth)/login/_hooks/use-login-actions";
import { useAppConfigContext } from "@/providers/config-provider";

export const LoginPageShell = () => {
  const t = useTranslations("Auth");
  const { passwordLoginEnabled } = useAppConfigContext();
  const {
    activeOAuthProvider,
    forgotPasswordPath,
    registerPath,
    isMagicLinkLoading,
    isOAuthLoading,
    isPasswordLoading,
    signInWithMagicLink,
    signInWithPassword,
    signInWithProvider,
  } = useLoginActions();

  return (
    <>
      <div className="form-heading">
        <div className="eyebrow">{t("eyebrow")}</div>
        <h1>{t("signInTitle")}</h1>
      </div>
      <SocialLoginButtons
        activeProvider={activeOAuthProvider}
        disabled={isMagicLinkLoading || isPasswordLoading}
        onSignIn={signInWithProvider}
      />
      <div className="divider">
        <span>{t("orContinueWithEmail")}</span>
      </div>
      <EmailLoginForm
        disabled={isOAuthLoading}
        forgotPasswordPath={forgotPasswordPath}
        isMagicLinkLoading={isMagicLinkLoading}
        isPasswordLoading={isPasswordLoading}
        onMagicLinkSubmit={signInWithMagicLink}
        onPasswordSubmit={signInWithPassword}
        passwordLoginEnabled={passwordLoginEnabled}
        registerPath={registerPath}
      />
    </>
  );
};
