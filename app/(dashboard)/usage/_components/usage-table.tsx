"use client";

import { Badge } from "@components/ui/badge";
import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@components/ui/table";
import {
  type ColumnDef,
  type ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  type PaginationState,
  type SortingState,
  useReactTable,
  type VisibilityState,
} from "@tanstack/react-table";
import { ArrowUpDown, CheckCircle, Clock, Download, FileText, XCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import * as React from "react";

export type UsageRecord = {
  id: string;
  date: string;
  jobId: string;
  fileName: string;
  fileType: string;
  model: string;
  pages: number;
  ocr: boolean;
  status: "Done" | "Failed" | "Running";
  duration: string;
  cost: number;
  apiKey: string;
  resultUrl?: string;
};

export function UsageTable({
  data,
  timeZone = "UTC",
  onDownload,
  pageCount,
  pageIndex,
  pageSize,
  onPageChange,
  total,
  isLoading = false,
}: {
  data: UsageRecord[];
  timeZone?: string;
  onDownload?: (jobId: string, resultUrl?: string) => void;
  pageCount?: number;
  pageIndex?: number;
  pageSize?: number;
  onPageChange?: (pagination: PaginationState) => void;
  total?: number;
  isLoading?: boolean;
}) {
  const t = useTranslations("UsageTable");

  const [loadingTarget, setLoadingTarget] = React.useState<"prev" | "next" | "pageSize" | null>(
    null
  );

  // Reset loading target when isLoading becomes false
  React.useEffect(() => {
    if (!isLoading) {
      setLoadingTarget(null);
    }
  }, [isLoading]);

  // Memoize formatter to avoid creating it for every row render
  const dateFormatter = React.useMemo(() => {
    try {
      return new Intl.DateTimeFormat("default", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        timeZone: timeZone,
      });
    } catch (_e) {
      return null;
    }
  }, [timeZone]);

  const columns = React.useMemo<ColumnDef<UsageRecord>[]>(
    () => [
      {
        accessorKey: "date",
        header: ({ column }) => {
          return (
            <Button
              variant="ghost"
              className="p-0 hover:bg-transparent"
              onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            >
              {t("date")}
              <ArrowUpDown className="ml-2 h-4 w-4" />
            </Button>
          );
        },
        cell: ({ row }) => {
          const dateStr = row.getValue("date") as string;
          const date = new Date(dateStr);
          // Handle invalid dates
          if (Number.isNaN(date.getTime())) {
            return (
              <div className="lowercase text-muted-foreground text-xs whitespace-nowrap">
                {dateStr}
              </div>
            );
          }

          try {
            if (dateFormatter) {
              const formattedDate = dateFormatter.format(date);
              return (
                <div className="lowercase text-muted-foreground text-xs whitespace-nowrap">
                  {formattedDate}
                </div>
              );
            }
            // Fallback if formatter failed
            return (
              <div className="lowercase text-muted-foreground text-xs whitespace-nowrap">
                {dateStr}
              </div>
            );
          } catch (_e) {
            // Fallback if timezone is invalid
            return (
              <div className="lowercase text-muted-foreground text-xs whitespace-nowrap">
                {dateStr}
              </div>
            );
          }
        },
      },
      {
        accessorKey: "jobId",
        header: t("jobId"),
        cell: ({ row }) => (
          <div className="font-mono text-xs text-muted-foreground">{row.getValue("jobId")}</div>
        ),
      },
      {
        accessorKey: "fileName",
        header: t("fileName"),
        cell: ({ row }) => (
          <div className="flex items-center gap-2 max-w-[200px]">
            <FileText className="h-4 w-4 text-muted-foreground shrink-0" />
            <span className="truncate text-sm font-medium" title={row.getValue("fileName")}>
              {row.getValue("fileName")}
            </span>
          </div>
        ),
      },
      {
        accessorKey: "fileType",
        header: t("type"),
        cell: ({ row }) => (
          <Badge variant="outline" className="text-xs px-1 py-0">
            {row.getValue("fileType")}
          </Badge>
        ),
      },
      {
        accessorKey: "model",
        header: t("model"),
        cell: ({ row }) => <div className="text-xs">{row.getValue("model")}</div>,
      },
      {
        accessorKey: "pages",
        header: t("pages"),
        cell: ({ row }) => <div className="text-xs text-right pr-4">{row.getValue("pages")}</div>,
      },
      {
        accessorKey: "ocr",
        header: t("ocr"),
        cell: ({ row }) => (
          <div className="text-xs text-center">{row.getValue("ocr") ? t("yes") : t("no")}</div>
        ),
      },
      {
        accessorKey: "status",
        header: t("status"),
        cell: ({ row }) => {
          const status = row.getValue("status") as string;
          let statusText = status;
          if (status === "Done") statusText = t("statusDone");
          if (status === "Failed") statusText = t("statusFailed");
          if (status === "Running") statusText = t("statusRunning");

          return (
            <div className="flex items-center gap-2">
              {status === "Done" && <CheckCircle className="h-4 w-4 text-amber-600" />}
              {status === "Failed" && <XCircle className="h-4 w-4 text-rose-600" />}
              {status === "Running" && <Clock className="h-4 w-4 text-primary animate-spin" />}
              <span className={status === "Failed" ? "text-rose-700" : ""}>{statusText}</span>
            </div>
          );
        },
      },
      {
        accessorKey: "duration",
        header: t("duration"),
        cell: ({ row }) => (
          <div className="text-xs text-muted-foreground">{row.getValue("duration")}</div>
        ),
      },
      {
        accessorKey: "cost",
        header: t("cost"),
        cell: ({ row }) => {
          const amount = Number.parseFloat(row.getValue("cost"));
          const status = row.original.status;
          if (status !== "Done") return <div className="text-xs text-muted-foreground">-</div>;

          return (
            <div className="text-xs font-medium">
              {amount} {t("pts")}
            </div>
          );
        },
      },
      {
        id: "actions",
        enableHiding: false,
        cell: ({ row }) => {
          const record = row.original;

          if (record.status !== "Done") return null;

          return (
            <Button
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0"
              onClick={(e) => {
                e.stopPropagation();
                if (record.resultUrl) {
                  window.open(record.resultUrl, "_blank");
                } else {
                  onDownload?.(record.jobId, record.resultUrl);
                }
              }}
            >
              <Download className="h-4 w-4 text-muted-foreground hover:text-foreground" />
              <span className="sr-only">{t("download")}</span>
            </Button>
          );
        },
      },
    ],
    [t, onDownload, dateFormatter]
  );

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    pageCount: pageCount ?? -1,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: pageIndex ?? 0,
        pageSize: pageSize ?? 10,
      },
    },
    onPaginationChange: (updater) => {
      if (typeof updater === "function") {
        const newState = updater({
          pageIndex: pageIndex ?? 0,
          pageSize: pageSize ?? 10,
        });
        onPageChange?.(newState);
      } else {
        onPageChange?.(updater);
      }
    },
    manualPagination: true,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
  });

  return (
    <div className="w-full">
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-muted/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="h-10 hover:bg-muted/50">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id} className="h-10 text-xs font-medium">
                      {header.isPlaceholder
                        ? null
                        : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="h-12 border-b"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {t("noResults")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-between py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {t("totalRows", { total: total || 0 })}
        </div>
        <div className="flex items-center space-x-6 lg:space-x-8">
          <div className="flex items-center space-x-2">
            <p className="text-sm font-medium">{t("rowsPerPage")}</p>
            <Select
              value={`${table.getState().pagination.pageSize}`}
              onValueChange={(value) => {
                setLoadingTarget("pageSize");
                table.setPageSize(Number(value));
              }}
              disabled={isLoading}
            >
              <SelectTrigger className="h-8 w-[70px]">
                <SelectValue placeholder={table.getState().pagination.pageSize} />
              </SelectTrigger>
              <SelectContent side="top">
                {[10, 20, 30, 40, 50].map((pageSize) => (
                  <SelectItem key={pageSize} value={`${pageSize}`}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoadingTarget("prev");
                table.previousPage();
              }}
              disabled={!table.getCanPreviousPage() || isLoading}
            >
              {isLoading && loadingTarget === "prev" && (
                <Clock className="mr-2 h-3 w-3 animate-spin" />
              )}
              {t("previous")}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                setLoadingTarget("next");
                table.nextPage();
              }}
              disabled={!table.getCanNextPage() || isLoading}
            >
              {isLoading && loadingTarget === "next" && (
                <Clock className="mr-2 h-3 w-3 animate-spin" />
              )}
              {t("next")}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
