"use client";

import { Button } from "@components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@components/ui/card";
import { Separator } from "@components/ui/separator";
import { Skeleton } from "@components/ui/skeleton";
import { useCredits } from "@hooks/use-credits";
import { useTimezone } from "@hooks/use-timezone";
import { cn } from "@lib/utils";
import { format, subDays } from "date-fns";
import { CheckCircle2, CreditCard, Download, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { useMemo, useState } from "react";
import type { DateRange } from "react-day-picker";
import { BuyCreditsDialog } from "@/app/(dashboard)/billing/_components/buy-credits-dialog";
import { DatePickerWithRange } from "@/app/(dashboard)/usage/_components/date-range-picker";
import { UsageTable } from "@/app/(dashboard)/usage/_components/usage-table";
import { useExportAllJobs, useJobs } from "@/app/(dashboard)/usage/_hooks/use-jobs";
import { useParseUsage } from "@/app/(dashboard)/usage/_hooks/use-usage-stats";
import { useToast } from "@/hooks/use-toast";
import { useAppConfigContext } from "@/providers/config-provider";

function UsagePageSkeleton() {
  return (
    <output className="flex flex-col gap-6 p-6" aria-busy="true">
      {/* 标题行 */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-full max-w-96" />
        </div>
        <Skeleton className="h-10 w-32 self-start sm:self-auto" />
      </div>

      {/* 统计卡片 */}
      <div className="grid gap-4 md:grid-cols-2">
        {[1, 2].map((i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4 rounded-full" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-20 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Separator />

      {/* 控制栏 */}
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Skeleton className="h-10 w-full sm:w-64" />
          <Skeleton className="h-10 w-full sm:w-48" />
        </div>
        <Skeleton className="h-9 w-32 self-start lg:self-auto" />
      </div>

      {/* 表格 */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-14 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>

      <span className="sr-only">Loading usage data...</span>
    </output>
  );
}

export default function UsagePage() {
  const t = useTranslations("Usage");
  const tTable = useTranslations("UsageTable");
  const _toast = useToast();
  const { billingEnabled } = useAppConfigContext();
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [activeRange, setActiveRange] = useState<"1d" | "7d" | "30d" | null>("30d");
  const { timezone, formatDate } = useTimezone();
  const { data: credits } = useCredits();

  // Use URL state for pagination
  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [pageSize, setPageSize] = useQueryState("pageSize", { defaultValue: "10" });

  // Build query params
  const queryParams = useMemo(() => {
    const params: {
      page: number;
      pageSize: number;
      recentDays?: number;
      startTime?: string;
      endTime?: string;
    } = {
      page: Number(page),
      pageSize: Number(pageSize),
    };

    if (activeRange) {
      if (activeRange === "1d") params.recentDays = 1;
      else if (activeRange === "7d") params.recentDays = 7;
      else if (activeRange === "30d") params.recentDays = 30;
    } else if (date?.from) {
      params.startTime = date.from.toISOString();
      if (date.to) {
        const endOfDay = new Date(date.to);
        endOfDay.setHours(23, 59, 59, 999);
        params.endTime = endOfDay.toISOString();
      } else {
        const endOfDay = new Date(date.from);
        endOfDay.setHours(23, 59, 59, 999);
        params.endTime = endOfDay.toISOString();
      }
    }

    return params;
  }, [page, pageSize, activeRange, date]);

  // Fetch data with TanStack Query
  const { data: jobsData, isPending: isPendingJobs } = useJobs(queryParams);
  const { data: usageStats, isPending: isPendingStats } = useParseUsage();
  const { mutateAsync: fetchAllJobs, isPending: isExporting } = useExportAllJobs();

  const isPending = isPendingJobs || (billingEnabled && isPendingStats);
  const jobs = jobsData?.jobs || [];
  const totalCount = jobsData?.total || 0;

  const handlePageChange = (newPagination: { pageIndex: number; pageSize: number }) => {
    setPage((newPagination.pageIndex + 1).toString());
    setPageSize(newPagination.pageSize.toString());
  };

  // Calculate stats from filtered data
  const totalCost = jobs.reduce((acc, item) => acc + item.cost, 0);
  // Assuming 1 credit = $0.02
  const estimatedCost = totalCost * 0.02;

  const doneJobs = jobs.filter((i) => i.statusKind === "done");
  const successRate = jobs.length > 0 ? ((doneJobs.length / jobs.length) * 100).toFixed(1) : "0";

  const avgDuration =
    doneJobs.length > 0
      ? (
          doneJobs.reduce((acc, item) => {
            const durationStr = String(item.duration).replace("s", "");
            return acc + (Number.parseFloat(durationStr) || 0);
          }, 0) / doneJobs.length
        ).toFixed(1)
      : "0";

  const handleExportCSV = async () => {
    // RFC 4180: wrap field in quotes if it contains comma, quote, or newline
    const escapeCSVField = (value: string | number | undefined | null): string => {
      const str = String(value ?? "");
      if (str.includes(",") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    };

    // Fetch all records (not just the current page) for a complete export
    const allJobs = await fetchAllJobs({
      total: totalCount,
      recentDays: queryParams.recentDays,
      startTime: queryParams.startTime,
      endTime: queryParams.endTime,
    });

    // Define headers
    const headers = [
      tTable("date"),
      tTable("jobId"),
      tTable("fileName"),
      tTable("model"),
      tTable("pages"),
      tTable("duration"),
      tTable("cost"),
      tTable("status"),
      tTable("resultUrl"),
    ];

    // Map data to rows
    const rows = allJobs.map((item) => [
      formatDate({ date: item.date, formatStr: "yyyy-MM-dd HH:mm:ss" }),
      item.jobId,
      item.fileName || "",
      item.model,
      item.pages,
      item.duration,
      item.cost,
      item.statusKind === "done"
        ? tTable("statusDone")
        : item.statusKind === "failed"
          ? tTable("statusFailed")
          : item.statusKind === "running"
            ? tTable("statusRunning")
            : item.statusKind === "pending"
              ? tTable("statusPending")
              : item.statusKind === "waiting-file"
                ? tTable("statusWaitingFile")
                : item.status,
      item.statusKind === "done" ? item.resultUrl || "" : "",
    ]);

    // Combine headers and rows, applying consistent escaping to all fields
    const csvContent = [
      headers.map(escapeCSVField).join(","),
      ...rows.map((row) => row.map(escapeCSVField).join(",")),
    ].join("\n");

    // Create blob with UTF-8 BOM so Excel recognizes the encoding correctly
    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `usage_export_${format(new Date(), "yyyyMMdd")}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  if (isPending) {
    return <UsagePageSkeleton />;
  }

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
            {billingEnabled ? t("title") : t("selfHostedTitle")}
          </h1>
          <p className="text-muted-foreground">
            {billingEnabled ? t("description") : t("selfHostedDescription")}
          </p>
        </div>
        {billingEnabled ? (
          <div className="self-start sm:self-auto">
            <BuyCreditsDialog currentCredits={credits || 0} />
          </div>
        ) : null}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("totalCreditsUsed")}</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats ? usageStats.credits_used.toLocaleString() : totalCost.toLocaleString()}{" "}
              pts
            </div>
            <p className="text-xs text-muted-foreground">
              {billingEnabled
                ? usageStats
                  ? t("estCost", { cost: `$${usageStats.estimated_amount}` })
                  : t("estCost", { cost: `$${estimatedCost.toFixed(2)}` })
                : t("billingDisabled")}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t("successRate")}</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {usageStats ? usageStats.success_rate : successRate}%
            </div>
            <p className="text-xs text-muted-foreground">
              {usageStats
                ? t("avgProcessingTime", { time: `${usageStats.avg_processing_time}s` })
                : t("avgProcessingTime", { time: `${avgDuration}s` })}
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:gap-4">
            <DatePickerWithRange
              className="w-full sm:w-auto"
              date={date}
              setDate={(newDate) => {
                setDate(newDate);
                setActiveRange(null);
              }}
            />
            <div className="grid w-full grid-cols-3 items-center rounded-lg border bg-card p-1 text-card-foreground shadow-sm sm:flex sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-xs hover:bg-muted sm:h-7 sm:px-3",
                  activeRange === "1d" && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => {
                  setDate({ from: subDays(new Date(), 1), to: new Date() });
                  setActiveRange("1d");
                }}
              >
                {t("1d")}
              </Button>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-xs hover:bg-muted sm:h-7 sm:px-3",
                  activeRange === "7d" && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => {
                  setDate({ from: subDays(new Date(), 7), to: new Date() });
                  setActiveRange("7d");
                }}
              >
                {t("7d")}
              </Button>
              <Separator orientation="vertical" className="hidden h-4 sm:block" />
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2 text-xs hover:bg-muted sm:h-7 sm:px-3",
                  activeRange === "30d" && "bg-primary text-primary-foreground hover:bg-primary/90"
                )}
                onClick={() => {
                  setDate({ from: subDays(new Date(), 30), to: new Date() });
                  setActiveRange("30d");
                }}
              >
                {t("30d")}
              </Button>
            </div>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="self-start lg:self-auto"
            onClick={handleExportCSV}
            disabled={isExporting || totalCount === 0}
          >
            {isExporting ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Download className="mr-2 h-4 w-4" />
            )}
            {t("exportCSV")}
          </Button>
        </div>

        <div className="w-full">
          <UsageTable
            data={jobs}
            timeZone={timezone}
            pageCount={Math.ceil(totalCount / Number(pageSize))}
            pageIndex={Number(page) - 1}
            pageSize={Number(pageSize)}
            onPageChange={handlePageChange}
            total={totalCount}
            isLoading={isPending}
          />
        </div>
      </div>
    </div>
  );
}
