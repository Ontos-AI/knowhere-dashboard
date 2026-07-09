"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import FileUploadFlow from "@components/features/jobs/file-upload-flow";
import { Dialog, DialogContent } from "@components/ui/dialog";
import { useQueryClient } from "@tanstack/react-query";
import { Upload } from "lucide-react";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";

type UsageFileUploadProps = {
  className?: string;
};

export function UsageFileUpload({ className }: UsageFileUploadProps) {
  const t = useTranslations("Usage");
  const queryClient = useQueryClient();
  const inputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleUploadSuccess = () => {
    setSelectedFile(null);
    void queryClient.invalidateQueries({ queryKey: ["jobs"] });
  };

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.webp,.txt,.md,.csv"
        onChange={(event) => {
          const file = event.target.files?.[0];
          event.target.value = "";
          if (file) {
            setSelectedFile(file);
          }
        }}
      />

      <DashboardActionButton
        type="button"
        variant="secondary"
        size="small"
        className={className}
        onClick={() => inputRef.current?.click()}
      >
        <span className="flex size-5 shrink-0 items-center justify-center">
          <Upload className="h-4 w-4" />
        </span>
        {t("uploadFile")}
      </DashboardActionButton>

      <Dialog
        open={selectedFile !== null}
        onOpenChange={(open) => {
          if (!open) {
            setSelectedFile(null);
          }
        }}
      >
        <DialogContent className="max-w-lg border-[#e4e4e7] bg-[#fafafa] p-0 sm:max-w-lg">
          {selectedFile ? (
            <FileUploadFlow
              file={selectedFile}
              onCancel={() => setSelectedFile(null)}
              onError={() => setSelectedFile(null)}
              onSuccess={handleUploadSuccess}
            />
          ) : null}
        </DialogContent>
      </Dialog>
    </>
  );
}
