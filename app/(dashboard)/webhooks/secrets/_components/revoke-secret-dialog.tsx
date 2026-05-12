"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import { dashboardDesktopModalContentClassName } from "@app/(dashboard)/_components/dashboard-modal-primitives";
import { AlertDialog, AlertDialogContent } from "@components/ui/alert-dialog";
import * as AlertDialogPrimitive from "@radix-ui/react-alert-dialog";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

type RevokeSecretDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isPending: boolean;
};

export function RevokeSecretDialog({
  open,
  onOpenChange,
  onConfirm,
  isPending,
}: RevokeSecretDialogProps) {
  const t = useTranslations("Webhooks");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={dashboardDesktopModalContentClassName}>
        <div className="flex flex-col items-end gap-[38px] px-[22px] pb-[38px] pt-[22px] sm:px-[46px] sm:py-[38px] lg:gap-10 lg:px-12 lg:py-10">
          <div className="flex w-full flex-col gap-3 lg:gap-[14px]">
            <h2 className="text-[20px] font-bold leading-[26px] text-[#09090b] lg:leading-7">
              {t("revokeSecretTitle")}
            </h2>
            <p className="text-sm leading-[18px] text-[#71717b] lg:leading-5">
              {t("revokeSecretDescription")}
            </p>
          </div>

          <div className="flex w-full justify-end gap-[6px] lg:gap-2">
            <DashboardActionButton
              asChild
              variant="secondary"
              size="dialog"
              className="flex-1 justify-center sm:min-w-[67px] sm:flex-none sm:justify-start lg:min-w-[71px]"
            >
              <AlertDialogPrimitive.Cancel disabled={isPending}>
                {t("cancel")}
              </AlertDialogPrimitive.Cancel>
            </DashboardActionButton>
            <DashboardActionButton
              asChild
              variant="primary"
              size="dialog"
              className="flex-1 justify-center sm:min-w-[67px] sm:flex-none sm:justify-start lg:min-w-[71px]"
            >
              <AlertDialogPrimitive.Action
                disabled={isPending}
                onClick={(event) => {
                  event.preventDefault();
                  onConfirm();
                }}
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                <span>{isPending ? t("revoking") : t("revoke")}</span>
              </AlertDialogPrimitive.Action>
            </DashboardActionButton>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
