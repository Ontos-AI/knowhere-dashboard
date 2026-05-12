"use client";

import {
  DashboardDesktopActionButton,
  dashboardDesktopModalContentClassName,
} from "@app/(dashboard)/_components/dashboard-modal-primitives";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
} from "@components/ui/alert-dialog";
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
            <AlertDialogCancel asChild>
              <DashboardDesktopActionButton
                variant="secondary"
                disabled={isPending}
                className="flex-1 sm:min-w-[67px] sm:flex-none lg:min-w-[71px]"
              >
                {t("cancel")}
              </DashboardDesktopActionButton>
            </AlertDialogCancel>
            <AlertDialogAction asChild>
              <DashboardDesktopActionButton
                variant="primary"
                disabled={isPending}
                className="flex-1 sm:min-w-[67px] sm:flex-none lg:min-w-[71px]"
                onClick={(event) => {
                  event.preventDefault();
                  onConfirm();
                }}
              >
                {isPending ? <Loader2 className="size-4 animate-spin" /> : null}
                <span>{isPending ? t("revoking") : t("revoke")}</span>
              </DashboardDesktopActionButton>
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
}
