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
import { Input } from "@components/ui/input";
import { Label } from "@components/ui/label";
import { Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { z } from "zod";

type CreateSecretDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateSecret: (endpoint?: string | null) => Promise<void>;
  isPending: boolean;
};

const endpointSchema = z.string().url("Invalid URL format").optional().nullable();

export function CreateSecretDialog({
  open,
  onOpenChange,
  onCreateSecret,
  isPending,
}: CreateSecretDialogProps) {
  const t = useTranslations("Webhooks");

  const [endpoint, setEndpoint] = useState<string>("");
  const [validationError, setValidationError] = useState<string>("");

  const handleCreate = async () => {
    // Clear previous validation error
    setValidationError("");

    // Validate endpoint if provided
    if (endpoint.trim()) {
      const result = endpointSchema.safeParse(endpoint.trim());
      if (!result.success) {
        setValidationError(result.error.issues[0].message);
        return;
      }
    }

    try {
      await onCreateSecret(endpoint.trim() || null);
      // Reset form on success
      setEndpoint("");
      setValidationError("");
    } catch (error) {
      // Error handling is done in parent component
      console.error("Create secret error:", error);
    }
  };

  const handleClose = () => {
    setEndpoint("");
    setValidationError("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{t("createSecret")}</DialogTitle>
          <DialogDescription>{t("createSecretDescription")}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="endpoint">{t("endpointUrl")}</Label>
            <Input
              id="endpoint"
              placeholder={t("endpointPlaceholder")}
              value={endpoint}
              onChange={(e) => setEndpoint(e.target.value)}
              disabled={isPending}
            />
            {validationError && <p className="text-sm text-destructive">{validationError}</p>}
            <p className="text-sm text-muted-foreground">{t("endpointHint")}</p>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isPending}>
            {t("cancel")}
          </Button>
          <Button onClick={handleCreate} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t("creating")}
              </>
            ) : (
              t("create")
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
