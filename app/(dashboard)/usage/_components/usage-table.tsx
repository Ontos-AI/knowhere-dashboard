"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { cn } from "@lib/utils";
import {
  ArrowUp,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Loader2,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useEffect, useRef, useState } from "react";
import type { UsageStatusKind } from "@/app/(dashboard)/usage/_lib/job-status";

export type UsageRecord = {
  id: string;
  date: string;
  jobId: string;
  fileName: string;
  fileType: string;
  model: string;
  pages: number;
  status: string;
  statusKind: UsageStatusKind;
  duration: string;
  durationSeconds?: number;
  sourceType?: string;
  cost: number;
  apiKey: string;
  resultUrl?: string;
};

type UsageTableProps = {
  data: UsageRecord[];
  total: number;
  page: number;
  pageSize: number;
  pageCount: number;
  isLoading?: boolean;
  formatDateLabel: (value: string) => string;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
  onDownloadResult?: (jobId: string, resultUrl?: string) => void;
};

type PaginationItem = number | "ellipsis";
type FileTypeTheme = {
  readonly background: string;
  readonly border: string;
  readonly text: string;
  readonly darkBackground: string;
  readonly darkBorder: string;
  readonly darkText: string;
};

type FileTypeBadgeStyle = React.CSSProperties & {
  readonly "--file-type-background": string;
  readonly "--file-type-border": string;
  readonly "--file-type-text": string;
  readonly "--file-type-dark-background": string;
  readonly "--file-type-dark-border": string;
  readonly "--file-type-dark-text": string;
};

const tableHeaders = [
  { key: "date", labelKey: "date", width: "210px" },
  { key: "jobId", labelKey: "jobId", width: "140px" },
  { key: "fileName", labelKey: "fileName", width: "170px" },
  { key: "type", labelKey: "type", width: "80px" },
  { key: "model", labelKey: "model", width: "144px" },
  { key: "pages", labelKey: "pages", width: "60px" },
  { key: "status", labelKey: "status", width: "80px" },
  { key: "duration", labelKey: "duration", width: "100px" },
  { key: "cost", labelKey: "cost", width: "120px" },
] as const;

const rowActionColumnWidth = "48px";
const tableGridTemplate = [
  ...tableHeaders.map((header) => header.width),
  rowActionColumnWidth,
].join(" ");
const tableMinWidth = tableHeaders.reduce(
  (total, header) => total + Number.parseInt(header.width, 10),
  Number.parseInt(rowActionColumnWidth, 10)
);
const tableScrollThumbWidth: number = 151;

const fileTypeColorMap = {
  pdf: {
    background: "#fef2f2",
    border: "#ffe2e2",
    text: "#c10007",
    darkBackground: "#450a0a",
    darkBorder: "#7f1d1d",
    darkText: "#fca5a5",
  },
  docx: {
    background: "#eff6ff",
    border: "#dbeafe",
    text: "#1447e6",
    darkBackground: "#172554",
    darkBorder: "#1d4ed8",
    darkText: "#93c5fd",
  },
  jpg: {
    background: "#fdf4ff",
    border: "#fae8ff",
    text: "#a800b7",
    darkBackground: "#4a044e",
    darkBorder: "#86198f",
    darkText: "#f0abfc",
  },
  jpeg: {
    background: "#fdf4ff",
    border: "#fae8ff",
    text: "#a800b7",
    darkBackground: "#4a044e",
    darkBorder: "#86198f",
    darkText: "#f0abfc",
  },
  pptx: {
    background: "#fff7ed",
    border: "#ffedd4",
    text: "#ca3500",
    darkBackground: "#431407",
    darkBorder: "#9a3412",
    darkText: "#fdba74",
  },
  xlsx: {
    background: "#ecfdf5",
    border: "#d0fae5",
    text: "#007a55",
    darkBackground: "#052e16",
    darkBorder: "#047857",
    darkText: "#86efac",
  },
  csv: {
    background: "#ecfeff",
    border: "#cefafe",
    text: "#007595",
    darkBackground: "#083344",
    darkBorder: "#0e7490",
    darkText: "#67e8f9",
  },
  png: {
    background: "#caffee",
    border: "#7efedd",
    text: "#0a6351",
    darkBackground: "#01251d",
    darkBorder: "#054437",
    darkText: "#27efc6",
  },
  md: {
    background: "#f7fee7",
    border: "#ecfcca",
    text: "#497d00",
    darkBackground: "#1a2e05",
    darkBorder: "#4d7c0f",
    darkText: "#bef264",
  },
  json: {
    background: "#fefce8",
    border: "#fef9c2",
    text: "#a65f00",
    darkBackground: "#422006",
    darkBorder: "#a16207",
    darkText: "#fde68a",
  },
  txt: {
    background: "#eef2ff",
    border: "#e0e7ff",
    text: "#432dd7",
    darkBackground: "#1e1b4b",
    darkBorder: "#4338ca",
    darkText: "#a5b4fc",
  },
} satisfies Readonly<Record<string, FileTypeTheme>>;

const buildFileTypeBadgeStyle = (theme: FileTypeTheme): FileTypeBadgeStyle => ({
  "--file-type-background": theme.background,
  "--file-type-border": theme.border,
  "--file-type-text": theme.text,
  "--file-type-dark-background": theme.darkBackground,
  "--file-type-dark-border": theme.darkBorder,
  "--file-type-dark-text": theme.darkText,
});

const buildPaginationItems = (page: number, pageCount: number): PaginationItem[] => {
  if (pageCount <= 6) {
    return Array.from({ length: pageCount }, (_, index) => index + 1);
  }

  if (page <= 3) {
    return [1, 2, 3, "ellipsis", pageCount - 1, pageCount];
  }

  if (page >= pageCount - 2) {
    return [1, 2, "ellipsis", pageCount - 2, pageCount - 1, pageCount];
  }

  return [1, "ellipsis", page - 1, page, page + 1, "ellipsis", pageCount];
};

const normalizeFileType = (fileType: string) => {
  const normalized = fileType.trim().replace(/^\./, "").toLowerCase();
  return normalized || "txt";
};

const formatFileTypeLabel = (fileType: string) => {
  return `.${normalizeFileType(fileType)}`;
};

const formatCostLabel = (cost: number) => {
  return `${cost.toLocaleString(undefined, {
    maximumFractionDigits: 4,
  })} pts`;
};

const getStatusLabel = (
  t: ReturnType<typeof useTranslations>,
  statusKind: UsageStatusKind,
  fallback: string
) => {
  if (statusKind === "done") return t("statusDone");
  if (statusKind === "failed") return t("statusFailed");
  if (statusKind === "running") return t("statusRunning");
  if (statusKind === "pending") return t("statusPending");
  if (statusKind === "waiting-file") return t("statusWaitingFile");
  return fallback;
};

const StatusIcon = ({ statusKind }: { statusKind: UsageStatusKind }) => {
  if (statusKind === "done") {
    return <CheckCircle2 className="h-[14px] w-[14px] text-[#00a63e]" />;
  }

  if (statusKind === "failed") {
    return <XCircle className="h-[14px] w-[14px] text-[#e7000b]" />;
  }

  if (statusKind === "running") {
    return <Loader2 className="h-[14px] w-[14px] animate-spin text-[#fd9a00]" />;
  }

  if (statusKind === "pending" || statusKind === "waiting-file") {
    return <Clock3 className="h-[14px] w-[14px] text-muted-foreground" />;
  }

  return <Clock3 className="h-[14px] w-[14px] text-muted-foreground" />;
};

const TableCell = ({ children, className }: { children: React.ReactNode; className?: string }) => {
  return (
    <div
      className={cn(
        "flex h-10 items-center overflow-hidden border-r border-border px-3 py-2 text-[12px] leading-4 dark:border-border sm:h-[22px] sm:px-[10px] sm:py-1 lg:h-8",
        className
      )}
    >
      {children}
    </div>
  );
};

export function UsageTable({
  data,
  total,
  page,
  pageSize,
  pageCount,
  isLoading = false,
  formatDateLabel,
  onPageChange,
  onPageSizeChange,
  onDownloadResult,
}: UsageTableProps) {
  const t = useTranslations("UsageTable");
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [scrollThumbWidth, setScrollThumbWidth] = useState(0);
  const [scrollThumbOffset, setScrollThumbOffset] = useState(0);
  const [goToPageValue, setGoToPageValue] = useState(String(page));

  useEffect(() => {
    setGoToPageValue(String(page));
  }, [page]);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const updateScrollMetrics = () => {
      const { clientWidth, scrollLeft, scrollWidth } = scrollContainer;

      if (scrollWidth <= clientWidth) {
        setScrollThumbWidth(clientWidth);
        setScrollThumbOffset(0);
        return;
      }

      const nextThumbWidth = Math.min(tableScrollThumbWidth, clientWidth);
      const maxThumbOffset = clientWidth - nextThumbWidth;
      const maxScrollLeft = scrollWidth - clientWidth;
      const nextThumbOffset = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxThumbOffset : 0;

      setScrollThumbWidth(nextThumbWidth);
      setScrollThumbOffset(nextThumbOffset);
    };

    updateScrollMetrics();
    scrollContainer.addEventListener("scroll", updateScrollMetrics);
    window.addEventListener("resize", updateScrollMetrics);

    return () => {
      scrollContainer.removeEventListener("scroll", updateScrollMetrics);
      window.removeEventListener("resize", updateScrollMetrics);
    };
  }, []);

  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;

    if (!scrollContainer) {
      return;
    }

    const { clientWidth, scrollLeft, scrollWidth } = scrollContainer;

    if (scrollWidth <= clientWidth) {
      setScrollThumbWidth(clientWidth);
      setScrollThumbOffset(0);
      return;
    }

    const nextThumbWidth = Math.min(tableScrollThumbWidth, clientWidth);
    const maxThumbOffset = clientWidth - nextThumbWidth;
    const maxScrollLeft = scrollWidth - clientWidth;
    const nextThumbOffset = maxScrollLeft > 0 ? (scrollLeft / maxScrollLeft) * maxThumbOffset : 0;

    setScrollThumbWidth(nextThumbWidth);
    setScrollThumbOffset(nextThumbOffset);
  });

  const paginationItems = buildPaginationItems(page, Math.max(pageCount, 1));

  return (
    <div className="w-full space-y-[18px] sm:space-y-3">
      <div className="overflow-hidden border border-border bg-card dark:bg-card">
        <div ref={scrollContainerRef} className="overflow-x-auto overflow-y-hidden">
          <div className="min-w-[1160px]" style={{ minWidth: tableMinWidth }}>
            <div
              className="grid h-[30px] bg-muted sm:h-[26px] lg:h-8"
              style={{ gridTemplateColumns: tableGridTemplate }}
            >
              {tableHeaders.map((header) => (
                <div
                  key={header.key}
                  className="flex h-full items-center gap-1.5 border-r border-border px-3 py-[7px] text-[12px] font-semibold leading-4 text-foreground sm:py-[5px] lg:py-2"
                >
                  <span>{t(header.labelKey)}</span>
                  {header.key === "date" ? (
                    <ArrowUp className="h-3 w-3 text-muted-foreground" />
                  ) : null}
                </div>
              ))}
              <div
                aria-hidden="true"
                className="sticky right-0 z-10 h-full border-l border-border bg-muted dark:border-border dark:bg-muted"
              />
            </div>

            {data.length > 0 ? (
              data.map((row) => {
                const fileTypeKey = normalizeFileType(row.fileType);
                const fileTypeTheme =
                  fileTypeColorMap[fileTypeKey as keyof typeof fileTypeColorMap] ??
                  fileTypeColorMap.txt;
                const statusLabel = getStatusLabel(t, row.statusKind, row.status);

                return (
                  <div
                    key={row.id}
                    className={cn("relative grid", isLoading && "opacity-70")}
                    style={{ gridTemplateColumns: tableGridTemplate }}
                  >
                    <TableCell className="font-mono-display leading-4 whitespace-nowrap text-foreground">
                      {formatDateLabel(row.date)}
                    </TableCell>
                    <TableCell className="text-muted-foreground">{row.jobId}</TableCell>
                    <TableCell className="gap-1.5">
                      <Image
                        src="/icons/usage/file.svg"
                        alt=""
                        aria-hidden
                        width={15}
                        height={19}
                        className="h-[14px] w-[11px] shrink-0"
                      />
                      <span className="truncate font-medium text-foreground" title={row.fileName}>
                        {row.fileName}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span
                        className="inline-flex items-center border border-[var(--file-type-border)] bg-[var(--file-type-background)] px-[6px] font-mono-display text-[12px] leading-4 text-[var(--file-type-text)] dark:border-[var(--file-type-dark-border)] dark:bg-[var(--file-type-dark-background)] dark:text-[var(--file-type-dark-text)]"
                        style={buildFileTypeBadgeStyle(fileTypeTheme)}
                      >
                        {formatFileTypeLabel(row.fileType)}
                      </span>
                    </TableCell>
                    <TableCell className="text-foreground">{row.model}</TableCell>
                    <TableCell className="font-mono-display leading-4 text-foreground">
                      {row.pages}
                    </TableCell>
                    <TableCell className="gap-1.5">
                      <StatusIcon statusKind={row.statusKind} />
                      <span
                        className={cn(
                          row.statusKind === "done" && "text-[#00a63e]",
                          row.statusKind === "failed" && "text-[#e7000b]",
                          row.statusKind === "running" && "text-[#fd9a00]",
                          (row.statusKind === "pending" || row.statusKind === "waiting-file") &&
                            "text-muted-foreground"
                        )}
                      >
                        {statusLabel}
                      </span>
                    </TableCell>
                    <TableCell className="font-mono-display leading-4 text-muted-foreground">
                      {row.duration}
                    </TableCell>
                    <TableCell className="font-mono-display leading-4 text-foreground">
                      {formatCostLabel(row.cost)}
                    </TableCell>

                    <button
                      type="button"
                      className="sticky right-0 z-10 flex h-10 w-12 items-center justify-center border-l border-border bg-background text-[#ff8904] transition-colors hover:bg-[#fff7ed] disabled:cursor-not-allowed disabled:text-muted-foreground dark:border-border dark:bg-muted dark:hover:bg-muted sm:h-[22px] lg:h-8"
                      onClick={() => onDownloadResult?.(row.jobId, row.resultUrl)}
                      disabled={!row.resultUrl}
                      aria-label={row.resultUrl ? t("download") : row.status}
                    >
                      <span className="flex size-6 items-center justify-center overflow-hidden rounded-full">
                        <Image
                          src="/icons/usage/row-action.svg"
                          alt=""
                          aria-hidden
                          width={16}
                          height={16}
                          className="h-4 w-4"
                        />
                      </span>
                    </button>
                  </div>
                );
              })
            ) : (
              <div className="flex h-24 items-center justify-center bg-card text-sm text-muted-foreground dark:bg-card dark:text-muted-foreground">
                {t("noResults")}
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border">
          <div className="relative h-2 border-b border-border bg-muted dark:border-border dark:bg-muted">
            <div
              className="absolute inset-y-0 left-0 bg-border dark:bg-muted"
              style={{
                transform: `translateX(${scrollThumbOffset}px)`,
                width: `${scrollThumbWidth}px`,
              }}
            />
          </div>
          <div className="px-3 py-2 text-[12px] leading-[18px] text-muted-foreground sm:py-1.5 lg:py-2">
            {t("totalRows", { total })}
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center gap-[6px] sm:grid sm:grid-cols-[161px_244px] sm:justify-center sm:gap-x-4 sm:gap-y-2 lg:flex lg:flex-row lg:items-center lg:gap-4">
        <div className="flex items-center justify-center gap-1.5">
          <span className="text-[12px] leading-[14px] text-muted-foreground sm:leading-4">
            {t("rowsPerPage")}
          </span>
          <Select
            value={String(pageSize)}
            onValueChange={(value) => {
              onPageSizeChange(Number(value));
            }}
          >
            <SelectTrigger className="h-8 w-[72px] rounded-none border-border px-[10px] text-[12px] leading-[14px] text-foreground focus:ring-0 dark:border-border dark:bg-card dark:text-foreground">
              <SelectValue />
            </SelectTrigger>
            <SelectContent sideOffset={4} className="w-[200px]">
              {["10", "20", "30", "40", "50"].map((option) => (
                <SelectItem key={option} value={option}>
                  {option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-center sm:justify-self-center">
          <button
            type="button"
            className="flex h-8 w-[26px] items-center justify-center border border-border bg-card px-1 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground dark:border-border dark:bg-card dark:hover:bg-muted lg:w-7"
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label={t("previous")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          {paginationItems.map((item, index) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${String(paginationItems[index - 1])}-${String(paginationItems[index + 1])}`}
                  className="flex h-8 w-8 items-center justify-center border border-border bg-card text-[12px] leading-[14px] text-foreground"
                >
                  ...
                </span>
              );
            }

            const isActive = item === page;

            return (
              <button
                key={item}
                type="button"
                className={cn(
                  "flex h-8 w-8 items-center justify-center border border-border bg-card text-[12px] leading-[14px] text-foreground transition-colors hover:bg-muted",
                  isActive &&
                    "font-bold text-[#19a88b] underline decoration-solid underline-offset-4"
                )}
                onClick={() => onPageChange(item)}
              >
                {item}
              </button>
            );
          })}
          <button
            type="button"
            className="flex h-8 w-[26px] items-center justify-center border border-border bg-card px-1 text-muted-foreground transition-colors hover:bg-muted disabled:cursor-not-allowed disabled:text-muted-foreground dark:border-border dark:bg-card dark:hover:bg-muted lg:w-7"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= pageCount}
            aria-label={t("next")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        <form
          className="flex items-center justify-center sm:col-span-2 sm:justify-self-center lg:col-auto"
          onSubmit={(event) => {
            event.preventDefault();
            const nextPage = Number.parseInt(goToPageValue, 10);

            if (Number.isNaN(nextPage)) {
              setGoToPageValue(String(page));
              return;
            }

            const safePage = Math.min(Math.max(nextPage, 1), Math.max(pageCount, 1));
            onPageChange(safePage);
            setGoToPageValue(String(safePage));
          }}
        >
          <input
            type="number"
            min={1}
            max={Math.max(pageCount, 1)}
            value={goToPageValue}
            onChange={(event) => setGoToPageValue(event.target.value)}
            className="h-8 w-[77px] border border-border px-3 text-[12px] leading-[14px] text-foreground placeholder:text-muted-foreground focus:outline-none dark:border-border dark:bg-card dark:text-foreground"
            placeholder="Number"
          />
          <button
            type="submit"
            className="flex h-8 w-10 items-center justify-center border border-border bg-muted text-[12px] font-medium leading-[14px] text-[#19a88b] transition-colors hover:bg-[#caffee] dark:border-border dark:bg-muted dark:text-[#27efc6] dark:hover:bg-muted"
          >
            Go
          </button>
        </form>
      </div>
    </div>
  );
}
