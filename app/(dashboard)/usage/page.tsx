"use client";

import { DashboardActionButton } from "@app/(dashboard)/_components/dashboard-action-button";
import { DatePickerWithRange } from "@app/(dashboard)/usage/_components/date-range-picker";
import { UsageFileUpload } from "@app/(dashboard)/usage/_components/usage-file-upload";
import { UsageTable } from "@app/(dashboard)/usage/_components/usage-table";
import { UsageWelcomeModal } from "@app/(dashboard)/usage/_components/usage-welcome-modal";
import { useExportAllJobs, useJobs } from "@app/(dashboard)/usage/_hooks/use-jobs";
import { useParseUsage } from "@app/(dashboard)/usage/_hooks/use-usage-stats";
import { useCredits } from "@hooks/use-credits";
import { useTimezone } from "@hooks/use-timezone";
import { trackBuyCreditsClicked, trackError, trackFeatureUsage } from "@lib/posthog";
import { cn } from "@lib/utils";
import { format, subDays } from "date-fns";
import { Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useQueryState } from "nuqs";
import { startTransition, useState } from "react";
import type { DateRange } from "react-day-picker";
import { useAppConfigContext } from "@/providers/config-provider";

type TimeRangePreset = 1 | 3 | 7;

type UsageSummaryCardProps = {
  title: string;
  value: string;
  unit: string;
  valueClassName: string;
  helper: React.ReactNode;
  icon: React.ReactNode;
};

type UsageTableDateInput = {
  readonly date: string;
  readonly locale: string;
  readonly timeZone: string;
};

const timezoneSuffixPattern: RegExp = /Z$|[+-]\d{2}:\d{2}$/;

const usageTableDateFormatterOptions: Intl.DateTimeFormatOptions = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
};

const getPresetDateRange = (days: TimeRangePreset): DateRange => {
  return {
    from: subDays(new Date(), days),
    to: new Date(),
  };
};

const normalizeUsageTableDate = (date: string): string => {
  return timezoneSuffixPattern.test(date) ? date : `${date}Z`;
};

const formatUsageTableDate = ({ date, locale, timeZone }: UsageTableDateInput): string => {
  const parsedDate: Date = new Date(normalizeUsageTableDate(date));

  if (Number.isNaN(parsedDate.getTime())) {
    return "-";
  }

  return new Intl.DateTimeFormat(locale, {
    ...usageTableDateFormatterOptions,
    timeZone,
  }).format(parsedDate);
};

const buildBuyCreditsHref = (pathname: string, searchParams: URLSearchParams) => {
  const params = new URLSearchParams(searchParams.toString());
  params.set("buy", "true");
  const nextSearch = params.toString();
  return nextSearch ? `${pathname}?${nextSearch}` : pathname;
};

const formatMetricNumber = (value: number, fractionDigits = 3) => {
  return value.toLocaleString(undefined, {
    maximumFractionDigits: fractionDigits,
  });
};

const SummaryIcon = ({
  className,
  height,
  src,
  width,
}: {
  className?: string;
  height: number;
  src: string;
  width: number;
}) => {
  return (
    <div className={cn("flex size-6 shrink-0 items-start justify-center", className)}>
      <Image src={src} alt="" aria-hidden width={width} height={height} />
    </div>
  );
};

const UsageSummaryCard = ({
  title,
  value,
  unit,
  valueClassName,
  helper,
  icon,
}: UsageSummaryCardProps) => {
  return (
    <article className="flex h-[98px] flex-col gap-2 overflow-hidden border border-[#f4f4f5] px-[14px] pb-[14px] pt-3 dark:border-[#3f3f46] dark:bg-[#18181b] sm:h-[120px] sm:px-[18px] sm:pb-5 sm:pt-4 lg:h-[132px] lg:px-5">
      <div className="flex min-h-6 items-start justify-between gap-6 sm:min-h-[40px]">
        <h2 className="text-[14px] font-medium leading-5 text-[#27272a] dark:text-[#fafafa] sm:text-base sm:leading-6">
          {title}
        </h2>
        {icon}
      </div>
      <div className="flex items-baseline gap-2 sm:gap-1.5">
        <span
          className={cn(
            "font-accent text-[18px] font-extrabold leading-none sm:text-[22px] lg:text-2xl",
            valueClassName
          )}
        >
          {value}
        </span>
        <span className="font-accent text-[12px] font-medium leading-none text-[#27272a] dark:text-[#fafafa] sm:text-[14px] lg:text-base">
          {unit}
        </span>
      </div>
      <div className="text-[12px] leading-[14px] sm:leading-4">{helper}</div>
    </article>
  );
};

const UsagePageSkeleton = () => {
  return (
    <div className="w-full space-y-[18px] sm:space-y-[22px] lg:space-y-5">
      <div className="h-6 w-[340px] animate-pulse bg-[#f4f4f5] dark:bg-[#27272a]" />
      <div className="grid grid-cols-1 gap-0 border border-[#e4e4e7] dark:border-[#3f3f46] lg:grid-cols-3">
        {["summary-1", "summary-2", "summary-3"].map((cardKey) => (
          <div
            key={cardKey}
            className="flex h-[98px] flex-col gap-3 border border-[#f4f4f5] px-[14px] pb-[14px] pt-3 dark:border-[#3f3f46] dark:bg-[#18181b] sm:h-[120px] sm:px-[18px] sm:pb-5 sm:pt-4 lg:h-[132px] lg:px-5"
          >
            <div className="h-6 w-32 animate-pulse bg-[#f4f4f5] dark:bg-[#3f3f46]" />
            <div className="h-8 w-24 animate-pulse bg-[#f4f4f5] dark:bg-[#3f3f46]" />
            <div className="h-4 w-40 animate-pulse bg-[#f4f4f5] dark:bg-[#3f3f46]" />
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-2">
        <div className="h-8 w-[288px] animate-pulse bg-[#f4f4f5] dark:bg-[#27272a]" />
        <div className="h-8 w-[220px] animate-pulse bg-[#f4f4f5] dark:bg-[#27272a]" />
        <div className="ml-auto h-8 w-[128px] animate-pulse bg-[#f4f4f5] dark:bg-[#27272a]" />
      </div>
      <div className="h-[560px] animate-pulse border border-[#e4e4e7] bg-[#fafafa] dark:border-[#3f3f46] dark:bg-[#18181b]" />
    </div>
  );
};

export default function UsagePage() {
  const t = useTranslations("Usage");
  const tTable = useTranslations("UsageTable");
  const locale: string = useLocale();
  const { billingEnabled } = useAppConfigContext();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const buyCreditsHref = buildBuyCreditsHref(
    pathname,
    new URLSearchParams(searchParams.toString())
  );
  const [date, setDate] = useState<DateRange | undefined>(getPresetDateRange(1));
  const [activeRange, setActiveRange] = useState<TimeRangePreset | null>(1);
  const { data: credits } = useCredits();
  const timezoneContext: ReturnType<typeof useTimezone> = useTimezone();
  const formatDate: ReturnType<typeof useTimezone>["formatDate"] = timezoneContext.formatDate;
  const timezone: string = timezoneContext.timezone;

  const [page, setPage] = useQueryState("page", { defaultValue: "1" });
  const [pageSize, setPageSize] = useQueryState("pageSize", { defaultValue: "30" });

  const currentPage = Number.parseInt(page, 10) || 1;
  const currentPageSize = Number.parseInt(pageSize, 10) || 30;

  const resolvedCustomEndTime =
    activeRange === 3 || (activeRange === null && date?.from)
      ? (() => {
          const dateForEnd = date?.to ?? date?.from;

          if (!dateForEnd) {
            return undefined;
          }

          const endOfDay = new Date(dateForEnd);
          endOfDay.setHours(23, 59, 59, 999);
          return endOfDay.toISOString();
        })()
      : undefined;

  const queryParams = {
    page: currentPage,
    pageSize: currentPageSize,
    recentDays: activeRange === 1 || activeRange === 7 ? activeRange : undefined,
    startTime:
      activeRange === 3 || (activeRange === null && date?.from)
        ? date?.from?.toISOString()
        : undefined,
    endTime: resolvedCustomEndTime,
  };

  const {
    data: jobsData,
    isPending: isPendingJobs,
    isFetching: isFetchingJobs,
  } = useJobs(queryParams);
  const {
    data: usageStats,
    isPending: isPendingUsageStats,
    isFetching: isFetchingUsageStats,
  } = useParseUsage();
  const { mutateAsync: exportAllJobs, isPending: isExporting } = useExportAllJobs();

  const jobs = jobsData?.jobs ?? [];
  const totalCount = jobsData?.total ?? 0;
  const pageCount = Math.max(Math.ceil(totalCount / currentPageSize), 1);

  const totalCreditsUsed = usageStats?.credits_used ?? jobs.reduce((sum, job) => sum + job.cost, 0);
  const estimatedCost =
    usageStats?.estimated_amount ?? jobs.reduce((sum, job) => sum + job.cost, 0) * 0.02;
  const estimatedCostLabel =
    typeof estimatedCost === "number" ? estimatedCost.toLocaleString() : String(estimatedCost);

  const doneJobs = jobs.filter((job) => job.statusKind === "done");
  const successRate =
    usageStats?.success_rate ??
    (jobs.length > 0 ? ((doneJobs.length / jobs.length) * 100).toFixed(2) : "0.00");
  const averageDuration =
    usageStats?.avg_processing_time ??
    (() => {
      if (doneJobs.length === 0) {
        return "0.00";
      }

      const totalDuration = doneJobs.reduce((sum, job) => {
        const numericValue = Number.parseFloat(String(job.duration).replace("s", ""));
        return Number.isNaN(numericValue) ? sum : sum + numericValue;
      }, 0);

      return (totalDuration / doneJobs.length).toFixed(2);
    })();

  const isInitialLoading = isPendingJobs || (billingEnabled && isPendingUsageStats);
  const isRefreshing = isFetchingJobs || (billingEnabled && isFetchingUsageStats);

  const handleExportCsv = async () => {
    if (totalCount === 0) {
      return;
    }

    try {
      trackFeatureUsage("usage_export_csv", { total_count: totalCount });
      const escapeCsvField = (value: string | number | undefined | null) => {
        const stringValue = String(value ?? "");

        if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
          return `"${stringValue.replace(/"/g, '""')}"`;
        }

        return stringValue;
      };

      const exportedJobs = await exportAllJobs({
        total: totalCount,
        recentDays:
          queryParams.recentDays === 1 || queryParams.recentDays === 7
            ? queryParams.recentDays
            : undefined,
        startTime: queryParams.startTime,
        endTime: queryParams.endTime,
      });

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

      const rows = exportedJobs.map((job) => [
        formatDate({ date: job.date, formatStr: "yyyy-MM-dd HH:mm:ss" }),
        job.jobId,
        job.fileName,
        job.model,
        job.pages,
        job.duration,
        job.cost,
        job.statusKind === "done"
          ? tTable("statusDone")
          : job.statusKind === "failed"
            ? tTable("statusFailed")
            : job.statusKind === "running"
              ? tTable("statusRunning")
              : job.statusKind === "pending"
                ? tTable("statusPending")
                : job.statusKind === "waiting-file"
                  ? tTable("statusWaitingFile")
                  : job.status,
        job.resultUrl ?? "",
      ]);

      const csvContent = [
        headers.map(escapeCsvField).join(","),
        ...rows.map((row) => row.map(escapeCsvField).join(",")),
      ].join("\n");

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
    } catch (error) {
      trackError("usage_export_csv_failed", {
        context: "usage_page",
        message: error instanceof Error ? error.message : "unknown",
      });
      throw error;
    }
  };

  if (isInitialLoading) {
    return (
      <>
        <UsageWelcomeModal />
        <UsagePageSkeleton />
      </>
    );
  }

  return (
    <>
      <UsageWelcomeModal />
      <div className="w-full space-y-[18px] sm:space-y-[22px] lg:space-y-5">
        <section className="space-y-1 sm:hidden">
          <h1 className="text-base font-bold leading-6 text-black dark:text-[#fafafa]">
            {billingEnabled ? t("title") : t("selfHostedTitle")}
          </h1>
          <p className="text-[14px] leading-5 text-[#52525c] dark:text-[#d4d4d8]">
            {billingEnabled ? t("description") : ""}
          </p>
        </section>
        <p className="hidden text-base leading-6 text-[#52525c] dark:text-[#d4d4d8] sm:block">
          {billingEnabled ? t("description") : ""}
        </p>

        <section
          className={cn(
            "grid grid-cols-1 gap-0 border border-[#e4e4e7]",
            "dark:border-[#3f3f46]",
            billingEnabled ? "lg:grid-cols-3" : "lg:grid-cols-2"
          )}
        >
          {billingEnabled ? (
            <UsageSummaryCard
              title={t("remainingCredits")}
              value={formatMetricNumber(credits ?? 0)}
              unit={tTable("pts")}
              valueClassName="text-[#ff6900]"
              icon={
                <SummaryIcon
                  src="/icons/usage/summary-remaining.svg"
                  width={21}
                  height={15}
                  className="pt-[2px]"
                />
              }
              helper={
                <Link
                  href={buyCreditsHref}
                  onClick={() => trackBuyCreditsClicked("usage_summary")}
                  className="text-[#ff6900] transition-opacity hover:opacity-80"
                >
                  Buy Knowhere API Credit &gt;&gt;
                </Link>
              }
            />
          ) : null}
          <UsageSummaryCard
            title={t("totalCreditsUsed")}
            value={formatMetricNumber(totalCreditsUsed)}
            unit={tTable("pts")}
            valueClassName="text-[#00a63e]"
            icon={<SummaryIcon src="/icons/usage/summary-used.svg" width={19} height={19} />}
            helper={
              <span className="text-[#27272a] dark:text-[#d4d4d8]">
                {billingEnabled ? t("estCost", { cost: `$${estimatedCostLabel}` }) : ""}
              </span>
            }
          />
          <UsageSummaryCard
            title={t("successRate")}
            value={formatMetricNumber(Number(successRate), 2)}
            unit="%"
            valueClassName="text-[#2b7fff]"
            icon={
              <SummaryIcon
                src="/icons/usage/summary-success-fill.svg"
                width={20.65}
                height={19.73}
              />
            }
            helper={
              <span className="text-[#27272a] dark:text-[#d4d4d8]">
                {t("avgProcessingTime", { time: `${averageDuration}s` })}
              </span>
            }
          />
        </section>

        <section className="space-y-6 sm:space-y-3">
          <div className="flex flex-wrap items-start gap-[6px] sm:gap-x-2 sm:gap-y-[6px] lg:gap-2">
            <DatePickerWithRange
              className="w-full max-w-[222px] sm:max-w-[224px] lg:max-w-[238px]"
              date={date}
              setDate={(nextDate) => {
                setDate(nextDate);
                setActiveRange(null);
                startTransition(() => {
                  setPage("1");
                });
              }}
            />

            <div className="flex h-9 w-[205px] items-center gap-px overflow-hidden sm:h-8">
              {[1, 3, 7].map((range) => {
                const isActive = activeRange === range;

                return (
                  <button
                    key={`range-${range}`}
                    type="button"
                    className={cn(
                      "flex h-9 w-[68px] items-center justify-center overflow-hidden bg-[#e4e4e7] px-4 pb-[10px] pt-2 font-mono-display text-[12px] font-light leading-4 tracking-normal whitespace-nowrap text-[#09090b] dark:bg-[#3f3f46] dark:text-[#fafafa] sm:h-8 sm:pb-[10px]",
                      isActive &&
                        "border-b-4 border-[#52525c] bg-[#71717b] font-bold text-white max-[639px]:pb-3 dark:border-[#a78bfa] dark:bg-[#7f22fe]"
                    )}
                    onClick={() => {
                      setActiveRange(range as TimeRangePreset);
                      setDate(getPresetDateRange(range as TimeRangePreset));
                      startTransition(() => {
                        setPage("1");
                      });
                    }}
                  >
                    {range} Day
                  </button>
                );
              })}
            </div>

            <UsageFileUpload className="h-9 min-w-[132px] whitespace-nowrap sm:h-8 lg:min-w-[136px]" />

            <DashboardActionButton
              type="button"
              variant="secondary"
              size="small"
              className="h-9 w-[121px] disabled:opacity-60 sm:h-8 lg:ml-auto lg:w-[127px]"
              onClick={() => void handleExportCsv()}
              disabled={isExporting || totalCount === 0}
            >
              {isExporting ? (
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                </span>
              ) : (
                <span className="flex size-5 shrink-0 items-center justify-center">
                  <Image
                    src="/icons/usage/export.svg"
                    alt=""
                    aria-hidden
                    width={13.33}
                    height={13.33}
                    className="h-[13.33px] w-[13.33px]"
                  />
                </span>
              )}
              {t("exportCSV")}
            </DashboardActionButton>
          </div>

          <UsageTable
            data={jobs}
            total={totalCount}
            page={currentPage}
            pageSize={currentPageSize}
            pageCount={pageCount}
            isLoading={isRefreshing}
            formatDateLabel={(value) =>
              formatUsageTableDate({
                date: value,
                locale,
                timeZone: timezone,
              })
            }
            onPageChange={(nextPage) => {
              startTransition(() => {
                setPage(String(nextPage));
              });
            }}
            onPageSizeChange={(nextPageSize) => {
              startTransition(() => {
                setPage("1");
                setPageSize(String(nextPageSize));
              });
            }}
            onDownloadResult={(_jobId, resultUrl) => {
              if (!resultUrl) {
                return;
              }

              window.open(resultUrl, "_blank", "noopener,noreferrer");
            }}
          />
        </section>
      </div>
    </>
  );
}
