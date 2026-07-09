"use client";

import { Alert, AlertDescription } from "@components/ui/alert";
import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import { Card, CardContent } from "@components/ui/card";
import { Progress } from "@components/ui/progress";
import {
  notifyFileUploadedFromUpload,
  notifyJobCreatedFromUpload,
  notifyJobFailedFromUpload,
} from "@lib/job-posthog-tracking";
import type { JobCreate, JobResponse, ParsingParams } from "@server/external-api/jobs";
import { uploadFileToS3 } from "@utils/upload";
import {
  AlertCircle,
  CheckCircle,
  Clock,
  FileText,
  RefreshCw,
  Upload,
  XCircle,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { useCallback, useState } from "react";
import {
  useConfirmUpload,
  useCreateJob,
  useGetJobStatus,
} from "@/app/(dashboard)/usage/_hooks/use-jobs";
import { useToast } from "@/hooks/use-toast";

type FileUploadFlowProps = {
  file: File;
  dataId?: string;
  parsingParams?: ParsingParams;
  webhook?: {
    url: string;
    secret: string;
  };
  resultMode?: "auto" | "inline" | "url";
  onSuccess: (job: JobResponse) => void;
  onError: (error: string) => void;
  onCancel?: () => void;
};

type UploadStep = "idle" | "creating" | "uploading" | "confirming" | "success" | "error";

export default function FileUploadFlow({
  file,
  dataId,
  parsingParams,
  webhook,
  resultMode = "auto",
  onSuccess,
  onError,
  onCancel,
}: FileUploadFlowProps) {
  const t = useTranslations("FileUpload");
  const toast = useToast();

  // Hooks
  const createJobMutation = useCreateJob();
  const confirmUploadMutation = useConfirmUpload();
  const getStatusMutation = useGetJobStatus();

  // State
  const [step, setStep] = useState<UploadStep>("idle");
  const [progress, setProgress] = useState(0);
  const [job, setJob] = useState<JobResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  // Unified pending state
  const isPending =
    createJobMutation.isPending || confirmUploadMutation.isPending || getStatusMutation.isPending;

  const handleStartUpload = useCallback(async () => {
    let activeJobId: string | null = null;

    try {
      setStep("creating");
      setError(null);
      setRetryCount(0);

      // 1. Create job (type-safe)
      const jobCreate: JobCreate = {
        source_type: "file",
        file_name: file.name,
        data_id: dataId,
        parsing_params: parsingParams,
        webhook: webhook,
        result_mode: resultMode,
      };

      const jobResponse = await createJobMutation.mutateAsync(jobCreate);
      activeJobId = jobResponse.job_id;
      setJob(jobResponse);
      notifyJobCreatedFromUpload(jobResponse.job_id, "direct_upload");

      if (jobResponse.status === "waiting-file" && jobResponse.upload_url) {
        // 2. Upload to S3 (keep as-is)
        setStep("uploading");
        setProgress(0);

        await uploadFileToS3({
          uploadUrl: jobResponse.upload_url,
          file,
          headers: jobResponse.upload_headers || {},
          onProgress: setProgress,
        });
        notifyFileUploadedFromUpload(file.type || "unknown", file.size, "direct");

        // 3. Wait for S3 event
        setStep("confirming");
        await new Promise((resolve) => setTimeout(resolve, 5000));

        // 4. Confirm upload (type-safe)
        await confirmUploadMutation.mutateAsync({ jobId: jobResponse.job_id });

        // 5. Get latest status (type-safe)
        const confirmedJob = await getStatusMutation.mutateAsync({ jobId: jobResponse.job_id });
        setJob(confirmedJob);

        if (confirmedJob.status === "pending" || confirmedJob.status === "running") {
          setStep("success");
          onSuccess(confirmedJob);
        } else {
          throw new Error(t("errors.taskStatusAbnormal", { status: confirmedJob.status }));
        }
      } else {
        // Direct processing (URL mode)
        setStep("success");
        onSuccess(jobResponse);
      }
    } catch (err) {
      console.error("Upload failed:", err);
      const errorMessage = err instanceof Error ? err.message : t("errors.uploadFailed");
      if (activeJobId) {
        notifyJobFailedFromUpload(activeJobId, errorMessage);
      }
      setError(errorMessage);
      setStep("error");
      onError(errorMessage);
    }
  }, [
    file,
    dataId,
    parsingParams,
    webhook,
    resultMode,
    onSuccess,
    onError,
    t,
    createJobMutation,
    confirmUploadMutation,
    getStatusMutation,
  ]);

  const handleRetry = useCallback(() => {
    if (retryCount < 3) {
      setRetryCount((prev) => prev + 1);
      setError(null);
      setStep("idle");
    } else {
      toast.error(t("errors.tooManyRetries"));
    }
  }, [retryCount, toast, t]);

  const getStepIcon = () => {
    switch (step) {
      case "idle":
        return <Upload className="h-8 w-8 text-blue-500" />;
      case "creating":
        return <RefreshCw className="h-8 w-8 text-blue-500 animate-spin" />;
      case "uploading":
        return <Upload className="h-8 w-8 text-blue-500" />;
      case "confirming":
        return <Clock className="h-8 w-8 text-orange-500" />;
      case "success":
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      case "error":
        return <XCircle className="h-8 w-8 text-red-500" />;
      default:
        return <AlertCircle className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStepText = () => {
    switch (step) {
      case "idle":
        return t("status.idle");
      case "creating":
        return t("status.creating");
      case "uploading":
        return t("status.uploading", { progress });
      case "confirming":
        return t("status.confirming");
      case "success":
        return t("status.success");
      case "error":
        return t("status.error");
      default:
        return t("status.unknown");
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "idle":
        return t("description.idle");
      case "creating":
        return t("description.creating");
      case "uploading":
        return t("description.uploading");
      case "confirming":
        return t("description.confirming");
      case "success":
        return job
          ? t("description.successWithId", { jobId: job.job_id })
          : t("description.success");
      case "error":
        return error || t("description.errorDefault");
      default:
        return "";
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="p-6 space-y-4">
        {/* 文件信息 */}
        <div className="flex items-center space-x-3">
          <FileText className="h-10 w-10 text-blue-500" />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{file.name}</p>
            <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
          </div>
        </div>

        {/* 步骤指示器 */}
        <div className="flex items-center space-x-3">
          {getStepIcon()}
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium">{getStepText()}</p>
              {step === "success" && job && (
                <Badge variant="outline" className="text-green-600 border-green-600">
                  {job.status}
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 mt-1">{getStepDescription()}</p>
          </div>
        </div>

        {/* 进度条 */}
        {(step === "uploading" || step === "confirming") && (
          <div className="space-y-2">
            <Progress value={step === "uploading" ? progress : 100} className="h-2" />
            {step === "uploading" && (
              <p className="text-xs text-center text-gray-500">{progress}% 完成</p>
            )}
          </div>
        )}

        {/* 错误信息 */}
        {step === "error" && error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* 操作按钮 */}
        <div className="flex space-x-2">
          {step === "idle" && (
            <Button onClick={handleStartUpload} className="flex-1" disabled={isPending}>
              <Upload className="mr-2 h-4 w-4" />
              {t("buttons.startUpload")}
            </Button>
          )}

          {step === "error" && retryCount < 3 && (
            <Button onClick={handleRetry} variant="outline" className="flex-1" disabled={isPending}>
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("buttons.retry")} ({retryCount}/3)
            </Button>
          )}

          {onCancel && step !== "success" && (
            <Button onClick={onCancel} variant="outline" disabled={isPending}>
              {t("buttons.cancel")}
            </Button>
          )}
        </div>

        {/* 成功后的任务信息 */}
        {step === "success" && job && (
          <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
            <p className="text-sm text-green-800">
              <strong>{t("result.jobId")}</strong> {job.job_id}
            </p>
            <p className="text-sm text-green-800">
              <strong>{t("result.status")}</strong> {job.status}
            </p>
            <p className="text-xs text-green-600 mt-1">{t("result.checkProgress")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
