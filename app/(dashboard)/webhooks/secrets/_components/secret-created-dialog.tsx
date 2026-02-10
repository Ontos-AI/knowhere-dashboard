"use client";

import { Button } from "@components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@components/ui/dialog";
import { AlertTriangle, Check, Copy } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

type SecretCreatedDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  secret: string | null;
};

export function SecretCreatedDialog({ open, onOpenChange, secret }: SecretCreatedDialogProps) {
  const t = useTranslations("Webhooks");
  const toast = useToast();
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!secret) return;

    try {
      await navigator.clipboard.writeText(secret);
      setCopied(true);
      toast.success(t("secretCopied"));

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (_error) {
      toast.error(t("copyFailed"));
    }
  };

  const handleClose = () => {
    setCopied(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Check className="h-5 w-5 text-green-500" />
            {t("secretCreatedTitle")}
          </DialogTitle>
          <DialogDescription>{t("secretCreatedDescription")}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Secret Display */}
          <div className="relative">
            <div className="flex items-center gap-2 rounded-md border bg-muted p-3">
              <code className="flex-1 break-all text-sm font-mono">{secret}</code>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleCopy}
                className="shrink-0"
                aria-label={t("copySecret")}
              >
                {copied ? (
                  <Check className="h-4 w-4 text-green-500" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {/* Warning Message */}
          <div className="flex items-start gap-3 rounded-md border border-orange-200 bg-orange-50 p-4 dark:border-orange-800 dark:bg-orange-950/30">
            <AlertTriangle className="h-5 w-5 text-orange-600 dark:text-orange-500 mt-0.5 shrink-0" />
            <div className="space-y-1">
              <p className="text-sm font-medium text-orange-900 dark:text-orange-100">
                {t("securityWarning")}
              </p>
              <p className="text-sm text-orange-800 dark:text-orange-200">
                {t("securityWarningDescription")}
              </p>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button onClick={handleClose}>{t("iHaveSavedIt")}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
