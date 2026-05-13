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

type SecretCreatedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secret: string | null;
};

export const SecretCreatedDialog = ({ open, onOpenChange, secret }: SecretCreatedDialogProps) => {
  const t = useTranslations("Webhooks");
  const toast = useToast();

  const handleCopy = async () => {
    if (!secret) {
      return;
    }

    const isCopied = await copyToClipboard(secret);

    if (!isCopied) {
      toast.error(t("copyFailed"));
      return;
    }

    toast.success(t("secretCopied"));
  };

  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dashboardDesktopModalContentClassName}>
        <div className="flex flex-col items-end gap-[38px] px-[22px] pb-[38px] pt-[22px] sm:px-[46px] sm:pb-[54px] sm:pt-[38px] lg:gap-10 lg:px-12 lg:pb-14 lg:pt-10">
          <div className="flex w-full items-start gap-6 sm:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <DashboardSuccessCircleIcon />
                <h2 className="text-[20px] font-bold leading-[26px] text-[#09090b] lg:leading-7">
                  {t("secretCreatedTitle")}
                </h2>
              </div>
              <p className="mt-0.5 text-sm leading-[18px] text-[#71717b] lg:mt-1 lg:leading-5">
                {t("secretCreatedDescription")}
              </p>
            </div>

            <DashboardDesktopDialogCloseButton />
          </div>

          <div className="flex w-full flex-col gap-[6px] lg:gap-2">
            <p className={dashboardDesktopFieldLabelClassName}>{t("yourSecret")}</p>
            <div className={cn(dashboardDesktopSecretFieldClassName, "break-all")}>
              {secret ?? ""}
            </div>
            <DashboardActionButton
              variant="secondary"
              size="dialog"
              className="h-9 w-fit sm:min-w-[105px] lg:min-w-[111px]"
              onClick={() => {
                void handleCopy();
              }}
              aria-label={t("copySecret")}
            >
              <DashboardCopyIcon />
              <span>{t("copyKey")}</span>
            </DashboardActionButton>
          </div>

          <div className="flex w-full flex-col gap-2 text-[#ff6900]">
            <div className="flex items-center gap-[6px] lg:gap-2">
              <DashboardWarningIcon />
              <p className="text-sm font-bold leading-[18px] lg:leading-5">
                {t("securityWarning")}
              </p>
            </div>
            <p className="pl-[30px] text-sm font-medium leading-[18px] lg:pl-8 lg:leading-5">
              {t("securityWarningDescription")}
            </p>
          </div>

          <div className="flex w-full justify-end gap-[6px] lg:gap-2">
            <DashboardActionButton
              variant="secondary"
              size="dialog"
              onClick={handleClose}
              className="flex-1 justify-center sm:min-w-[67px] sm:flex-none sm:justify-start lg:min-w-[71px]"
            >
              {t("cancel")}
            </DashboardActionButton>
            <DashboardActionButton
              variant="primary"
              size="dialog"
              onClick={handleClose}
              className="flex-1 justify-center sm:min-w-[60px] sm:flex-none sm:justify-start lg:min-w-[64px]"
            >
              {t("create")}
            </DashboardActionButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
