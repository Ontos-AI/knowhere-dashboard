"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import {
  DashboardCopyIcon,
  DashboardDesktopDialogCloseButton,
  DashboardSuccessCircleIcon,
  DashboardWarningIcon,
  dashboardDesktopFieldLabelClassName,
  dashboardDesktopModalContentClassName,
  dashboardDesktopSecretFieldClassName,
} from "@app/(dashboard)/_components/dashboard-modal-primitives";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { useToast } from "@hooks/use-toast";
import { cn } from "@lib/utils";
import { copyToClipboard } from "@utils/format";
import { useTranslations } from "next-intl";

type ApiKeyCreatedDialogProps = {
  apiKey: string | null;
  onOpenChange: (open: boolean) => void;
};

export const ApiKeyCreatedDialog = ({ apiKey, onOpenChange }: ApiKeyCreatedDialogProps) => {
  const t = useTranslations("ApiKeys");
  const toast = useToast();

  const handleCopy = async () => {
    if (!apiKey) {
      return;
    }

    const isCopied = await copyToClipboard(apiKey);

    if (isCopied) {
      toast.success(t("copySuccess"));
      return;
    }

    toast.error(t("copyFailed"));
  };

  return (
    <Dialog open={Boolean(apiKey)} onOpenChange={onOpenChange}>
      <DialogContent className={dashboardDesktopModalContentClassName}>
        <div className="flex flex-col items-end gap-[38px] px-[22px] pb-[38px] pt-[22px] sm:px-[46px] sm:pb-[54px] sm:pt-[38px] lg:gap-10 lg:px-12 lg:pb-14 lg:pt-10">
          <div className="flex w-full items-start gap-6 sm:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <DashboardSuccessCircleIcon />
                <h2 className="text-[20px] font-bold leading-[26px] text-[#09090b] lg:leading-7">
                  {t("createSuccess")}
                </h2>
              </div>
              <p className="mt-0.5 text-sm leading-[18px] text-[#71717b] lg:mt-1 lg:leading-5">
                {t("copyAndSave")}
              </p>
            </div>

            <DashboardDesktopDialogCloseButton />
          </div>

          <div className="flex w-full flex-col gap-[6px] lg:gap-2">
            <p className={dashboardDesktopFieldLabelClassName}>{t("yourApiKey")}</p>
            <div className={cn(dashboardDesktopSecretFieldClassName, "break-all")}>
              {apiKey ?? ""}
            </div>
            <DashboardActionButton
              variant="secondary"
              size="dialog"
              className="h-9 w-fit sm:min-w-[105px] lg:min-w-[111px]"
              onClick={() => {
                void handleCopy();
              }}
              aria-label={t("copyKey")}
            >
              <DashboardCopyIcon />
              <span>{t("copyKey")}</span>
            </DashboardActionButton>
          </div>

          <div className="flex w-full items-start gap-[6px] text-[#ff6900] lg:gap-2">
            <DashboardWarningIcon />
            <p className="flex-1 text-sm font-medium leading-[18px] lg:leading-5">
              {t("securityWarning")}
            </p>
          </div>

          <DashboardActionButton
            variant="primary"
            size="dialog"
            onClick={() => onOpenChange(false)}
            className="w-full justify-center sm:min-w-[138px] sm:w-auto sm:justify-start lg:min-w-[142px]"
          >
            {t("iHaveSaved")}
          </DashboardActionButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};
