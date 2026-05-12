"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import {
  DashboardDesktopDialogCloseButton,
  dashboardDesktopFieldLabelClassName,
  dashboardDesktopModalContentClassName,
  dashboardDesktopTextFieldClassName,
} from "@app/(dashboard)/_components/dashboard-modal-primitives";
import { LoadingSpinner } from "@components/common/loading-spinner";
import { Dialog, DialogContent } from "@components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";
import type { FormEvent } from "react";

type CreateApiKeyDialogProps = {
  expirationDuration: string;
  expirationOptions: Array<{ label: string; value: string }>;
  isPending: boolean;
  name: string;
  onExpirationChange: (value: string) => void;
  onNameChange: (value: string) => void;
  onOpenChange: (open: boolean) => void;
  onSubmit: () => void;
  open: boolean;
};

export const CreateApiKeyDialog = ({
  expirationDuration,
  expirationOptions,
  isPending,
  name,
  onExpirationChange,
  onNameChange,
  onOpenChange,
  onSubmit,
  open,
}: CreateApiKeyDialogProps) => {
  const t = useTranslations("ApiKeys");

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSubmit();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={dashboardDesktopModalContentClassName}>
        <form
          className="flex flex-col gap-[30px] px-[22px] pb-[38px] pt-[22px] sm:gap-[38px] sm:px-[46px] sm:pb-[54px] sm:pt-[38px] lg:gap-10 lg:px-12 lg:pb-14 lg:pt-10"
          onSubmit={handleSubmit}
        >
          <div className="flex items-start gap-6 sm:gap-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-bold leading-[26px] text-[#09090b] lg:leading-7">
                {t("createDialogTitle")}
              </h2>
              <p className="mt-0.5 text-sm leading-[18px] text-[#71717b] lg:mt-1 lg:leading-5">
                {t("createDialogDesc")}
              </p>
            </div>

            <DashboardDesktopDialogCloseButton />
          </div>

          <div className="flex flex-col gap-6">
            <label htmlFor="api-key-name" className="flex flex-col gap-[6px] lg:gap-2">
              <span className={dashboardDesktopFieldLabelClassName}>{t("name")}</span>
              <input
                id="api-key-name"
                value={name}
                onChange={(event) => onNameChange(event.target.value)}
                placeholder={t("namePlaceholder")}
                className={dashboardDesktopTextFieldClassName}
                disabled={isPending}
              />
            </label>

            <label htmlFor="api-key-expiration" className="flex flex-col gap-[10px]">
              <span className={dashboardDesktopFieldLabelClassName}>{t("expiration")}</span>
              <Select value={expirationDuration} onValueChange={onExpirationChange}>
                <SelectTrigger
                  id="api-key-expiration"
                  className={cn(
                    dashboardDesktopTextFieldClassName,
                    "px-[10px] pr-2 text-left hover:border-[#e4e4e7] focus:border-[#e4e4e7] [&>span]:line-clamp-1 [&>svg]:size-4 [&>svg]:text-[#71717b]"
                  )}
                  disabled={isPending}
                >
                  <SelectValue placeholder={t("selectExpiration")} />
                </SelectTrigger>
                <SelectContent className="w-[var(--radix-select-trigger-width)] rounded-none border-[#e4e4e7]">
                  {expirationOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </label>
          </div>

          <div className="flex justify-end gap-[6px] lg:gap-2">
            <DashboardActionButton
              variant="secondary"
              size="dialog"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="flex-1 justify-center sm:min-w-[67px] sm:flex-none sm:justify-start lg:min-w-[71px]"
            >
              {t("cancel")}
            </DashboardActionButton>
            <DashboardActionButton
              variant="primary"
              size="dialog"
              type="submit"
              disabled={isPending || name.trim().length === 0}
              className="flex-1 justify-center sm:min-w-[60px] sm:flex-none sm:justify-start lg:min-w-[64px]"
            >
              {isPending ? <LoadingSpinner className="size-4" /> : null}
              <span>{isPending ? t("creating") : t("create")}</span>
            </DashboardActionButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
