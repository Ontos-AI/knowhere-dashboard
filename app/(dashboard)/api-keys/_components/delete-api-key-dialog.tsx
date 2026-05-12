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
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";

type DeleteApiKeyDialogProps = {
  isPending: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

export const DeleteApiKeyDialog = ({
  isPending,
  onConfirm,
  onOpenChange,
  open,
}: DeleteApiKeyDialogProps) => {
  const t = useTranslations("ApiKeys");

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className={cn(dashboardDesktopModalContentClassName, "p-0")}>
        <div className="flex flex-col items-end gap-[38px] px-[22px] pb-[38px] pt-[22px] sm:px-[46px] sm:py-[38px] lg:gap-10 lg:px-12 lg:py-10">
          <div className="flex w-full flex-col gap-3 lg:gap-[14px]">
            <h2 className="text-[20px] font-bold leading-[26px] text-[#09090b] lg:leading-7">
              {t("deleteConfirmTitle")}
            </h2>
            <p className="text-sm leading-[18px] text-[#71717b] lg:leading-5">
              {t("deleteConfirmDesc")}
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
                {t("delete")}
              </DashboardDesktopActionButton>
            </AlertDialogAction>
          </div>
        </div>
      </AlertDialogContent>
    </AlertDialog>
  );
};
