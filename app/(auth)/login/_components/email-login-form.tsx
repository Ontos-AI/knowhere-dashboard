"use client";

import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { LoginButton } from "@/app/(auth)/login/_components/login-button";

type EmailLoginFormProps = {
  disabled?: boolean;
  isLoading?: boolean;
  onSubmit: (email: string) => Promise<boolean>;
};

type LoginFormValues = {
  email: string;
};

export const EmailLoginForm = ({
  disabled = false,
  isLoading = false,
  onSubmit,
}: EmailLoginFormProps) => {
  const t = useTranslations("Auth");

  const form = useForm<LoginFormValues>({
    defaultValues: {
      email: "",
    },
    resolver: zodResolver(
      z.object({
        email: z.string().trim().email(t("emailInvalid")),
      })
    ),
  });

  const handleSubmit = form.handleSubmit(async ({ email }) => {
    await onSubmit(email);
  });

  return (
    <form className="space-y-4 max-[639px]:space-y-[14px]" noValidate onSubmit={handleSubmit}>
      <div className="space-y-2 max-[639px]:space-y-1.5">
        <Label
          className="text-sm font-bold leading-5 text-[#09090b] max-[639px]:text-xs max-[639px]:leading-[18px]"
          htmlFor="login-email"
        >
          {t("email")}
        </Label>
        <Input
          aria-invalid={form.formState.errors.email ? "true" : "false"}
          className="h-10 border-[#e4e4e7] px-3 text-sm leading-5 text-[#09090b] placeholder:text-xs placeholder:leading-4 placeholder:text-[#9f9fa9] hover:border-[#d4d4d8] focus-visible:border-[#7f22fe] disabled:border-[#e4e4e7] disabled:bg-[#fafafa] max-[639px]:px-[10px] max-[639px]:text-xs max-[639px]:leading-[18px] max-[639px]:placeholder:leading-[14px] max-[374px]:px-3"
          disabled={disabled || isLoading}
          id="login-email"
          placeholder={t("emailPlaceholder")}
          type="email"
          {...form.register("email")}
        />
        {form.formState.errors.email ? (
          <p className="text-xs leading-4 text-destructive" role="alert">
            {form.formState.errors.email.message}
          </p>
        ) : null}
      </div>

      <LoginButton
        aria-busy={isLoading}
        disabled={disabled || isLoading}
        type="submit"
        variant="primary"
      >
        {isLoading ? t("sending") : t("sendMagicLink")}
      </LoginButton>
    </form>
  );
};
