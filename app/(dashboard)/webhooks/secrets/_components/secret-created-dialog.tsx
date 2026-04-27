"use client";

import {
  DashboardCopyIcon,
  DashboardDesktopActionButton,
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
        <div className="flex flex-col items-end gap-8 px-6 pb-10 pt-8 sm:gap-[38px] sm:px-[46px] sm:pb-[54px] sm:pt-[38px] lg:gap-10 lg:px-12 lg:pb-14 lg:pt-10">
          <div className="flex w-full items-start gap-6 sm:gap-8">
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1">
                <DashboardSuccessCircleIcon />
                <h2 className="text-[20px] font-bold leading-7 text-[#09090b] sm:leading-[26px] lg:leading-7">
                  {t("secretCreatedTitle")}
                </h2>
              </div>
              <p className="mt-1 text-sm leading-5 text-[#71717b] sm:leading-[18px] lg:leading-5">
                {t("secretCreatedDescription")}
              </p>
            </div>

            <DashboardDesktopDialogCloseButton />
          </div>

          <div className="flex w-full flex-col gap-2">
            <p
              className={cn(dashboardDesktopFieldLabelClassName, "sm:leading-[18px] lg:leading-5")}
            >
              {t("yourSecret")}
            </p>
            <div
              className={cn(
                dashboardDesktopSecretFieldClassName,
                "break-all sm:min-h-[58px] sm:py-2.5 lg:min-h-[68px] lg:py-2.5"
              )}
            >
              {secret ?? ""}
            </div>
            <DashboardDesktopActionButton
              variant="secondary"
              className="w-fit sm:min-w-[105px] lg:min-w-[111px]"
              onClick={() => {
                void handleCopy();
              }}
              aria-label={t("copySecret")}
            >
              <DashboardCopyIcon />
              <span>{t("copyKey")}</span>
            </DashboardDesktopActionButton>
          </div>

          <div className="flex w-full flex-col gap-2 text-[#ff6900]">
            <div className="flex items-center gap-[6px] lg:gap-2">
              <DashboardWarningIcon />
              <p className="text-sm font-bold leading-5 sm:leading-[18px] lg:leading-5">
                {t("securityWarning")}
              </p>
            </div>
            <p className="pl-[30px] text-sm font-medium leading-5 sm:leading-[18px] lg:pl-8 lg:leading-5">
              {t("securityWarningDescription")}
            </p>
          </div>

          <div className="flex justify-end gap-2 sm:gap-[6px] lg:gap-2">
            <DashboardDesktopActionButton
              variant="secondary"
              onClick={handleClose}
              className="flex-1 sm:min-w-[67px] sm:flex-none lg:min-w-[71px]"
            >
              {t("cancel")}
            </DashboardDesktopActionButton>
            <DashboardDesktopActionButton
              variant="primary"
              onClick={handleClose}
              className="flex-1 sm:min-w-[60px] sm:flex-none lg:min-w-[64px]"
            >
              {t("create")}
            </DashboardDesktopActionButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
