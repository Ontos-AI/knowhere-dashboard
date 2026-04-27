"use client";

import {
  DashboardDesktopActionButton,
  DashboardDesktopDialogCloseButton,
  dashboardDesktopFieldLabelClassName,
  dashboardDesktopModalContentClassName,
  dashboardDesktopTextFieldClassName,
} from "@app/(dashboard)/_components/dashboard-modal-primitives";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { cn } from "@lib/utils";
import { useTranslations } from "next-intl";
import { type FormEvent, useState } from "react";
import { z } from "zod";

type CreateSecretDialogProps = {
  isPending: boolean;
  onCreateSecret: (endpoint?: string | null) => Promise<void>;
  onOpenChange: (open: boolean) => void;
  open: boolean;
};

const endpointSchema = z.string().url("Invalid URL format").optional().nullable();

export const CreateSecretDialog = ({
  isPending,
  onCreateSecret,
  onOpenChange,
  open,
}: CreateSecretDialogProps) => {
  const t = useTranslations("Webhooks");
  const [endpoint, setEndpoint] = useState("");
  const [validationError, setValidationError] = useState("");

  const handleClose = () => {
    setEndpoint("");
    setValidationError("");
    onOpenChange(false);
  };

  const handleCreate = async () => {
    setValidationError("");

    if (endpoint.trim()) {
      const result = endpointSchema.safeParse(endpoint.trim());

      if (!result.success) {
        setValidationError(result.error.issues[0]?.message ?? "Invalid URL format");
        return;
      }
    }

    try {
      await onCreateSecret(endpoint.trim() || null);
      setEndpoint("");
      setValidationError("");
    } catch (error) {
      console.error("Create secret error:", error);
    }
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    void handleCreate();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={dashboardDesktopModalContentClassName}>
        <form
          className="flex flex-col gap-8 px-6 pb-10 pt-6 sm:gap-[38px] sm:px-[46px] sm:pb-[54px] sm:pt-[38px] lg:gap-10 lg:px-12 lg:pb-14 lg:pt-10"
          onSubmit={handleSubmit}
        >
          <div className="flex items-start gap-6 sm:gap-8">
            <div className="min-w-0 flex-1">
              <h2 className="text-[20px] font-bold leading-7 text-[#09090b] sm:leading-[26px] lg:leading-7">
                {t("createSecret")}
              </h2>
              <p className="mt-1 text-sm leading-5 text-[#71717b] sm:leading-[18px] lg:leading-5">
                {t("createSecretDescription")}
              </p>
            </div>

            <DashboardDesktopDialogCloseButton />
          </div>

          <div className="flex flex-col gap-6">
            <label htmlFor="webhook-endpoint-url" className="flex flex-col gap-2">
              <span
                className={cn(
                  dashboardDesktopFieldLabelClassName,
                  "sm:leading-[18px] lg:leading-5"
                )}
              >
                {t("endpointUrl")}
              </span>
              <input
                id="webhook-endpoint-url"
                value={endpoint}
                onChange={(event) => setEndpoint(event.target.value)}
                placeholder={t("endpointPlaceholder")}
                className={dashboardDesktopTextFieldClassName}
                disabled={isPending}
              />
            </label>

            <div className="min-h-5">
              <p
                className={cn(
                  "text-sm leading-5 sm:leading-[18px] lg:leading-5",
                  validationError ? "text-destructive" : "text-[#71717b]"
                )}
              >
                {validationError || t("endpointHint")}
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-2 sm:gap-[6px] lg:gap-2">
            <DashboardDesktopActionButton
              variant="secondary"
              onClick={handleClose}
              disabled={isPending}
              className="flex-1 sm:min-w-[67px] sm:flex-none lg:min-w-[71px]"
            >
              {t("cancel")}
            </DashboardDesktopActionButton>
            <DashboardDesktopActionButton
              variant="primary"
              type="submit"
              disabled={isPending}
              className="flex-1 sm:min-w-[60px] sm:flex-none lg:min-w-[64px]"
            >
              {isPending ? t("creating") : t("create")}
            </DashboardDesktopActionButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
