"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import {
  type ComparisonStatus,
  type ComparisonTab,
  comparisonRows,
  comparisonTabs,
} from "@app/(landing)/_components/landing-home-data";
import { StatefulTab } from "@app/(landing)/_components/stateful-tab";
import { KnowhereBrand } from "@components/brand/knowhere-brand";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import { type CSSProperties, type JSX, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  type TooltipProps,
  XAxis,
  YAxis,
} from "recharts";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const comparisonTableGridClassName =
  "min-w-[720px] grid grid-cols-[1.35fr_0.9fr_0.9fr] min-[769px]:min-w-0";
const comparisonTabTone = {
  selectedBg: "#71717b",
  selectedBorder: "#52525c",
  selectedText: "#ffffff",
  enabledBg: "#f4f4f5",
  enabledText: "#27272a",
  hoverBg: "#e4e4e7",
  hoverBorder: "#d4d4d8",
  activeBg: "#d4d4d8",
  activeBorder: "#a1a1aa",
} as const;
const MINERU_LOGO_SRC =
  "https://webpub.shlab.tech/dps/mineru/mineru-seo-fe/mineru-seo-prod.153/_next/static/media/logo.8cddbe47.svg";
const RAW_PATTERN_BASE_COLOR = "#e4e4e7";
const RAW_PATTERN_LINE_COLOR = "#f4f4f5";
const RAW_PATTERN_LINE_CSS_COLOR = "#f4f4f5";
const RAW_PATTERN_LINE_OPACITY = 1;
const RAW_PATTERN_LINE_WIDTH = 0.7;
const RAW_PATTERN_SIZE = 6;
const AXIS_NUMBER_GAP = 2;
const VALUE_LABEL_COLOR = "#52525b";
const VALUE_LABEL_GAP = 3;
const VALUE_LABEL_X_OFFSET = -3;

type BenchmarkSeries = {
  color: string;
  id: "raw" | "knowhere" | "mineru";
  label: string;
  pattern?: boolean;
};

type BenchmarkMetric = {
  label: string;
  values: Record<BenchmarkSeries["id"], number>;
};

type BenchmarkSeriesId = BenchmarkSeries["id"];

type BenchmarkChartLayout = "compact" | "medium" | "wide";

type BenchmarkDatum = {
  compactLabel: string;
  knowhere: number;
  knowhereValue: number;
  label: string;
  mineru: number;
  mineruValue: number;
  raw: number;
  rawValue: number;
};

type BenchmarkLabelProps = {
  index?: number;
  payload?: unknown;
  width?: number | string;
  x?: number | string;
  y?: number | string;
};

type BenchmarkAxisTickProps = {
  layout: BenchmarkChartLayout;
  payload?: {
    value?: unknown;
  };
  x?: number | string;
  y?: number | string;
};

type BenchmarkBarShapeProps = {
  height?: number | string;
  width?: number | string;
  x?: number | string;
  y?: number | string;
};

const benchmarkSeries: readonly BenchmarkSeries[] = [
  { color: RAW_PATTERN_BASE_COLOR, id: "raw", label: "Agent + Raw Docs", pattern: true },
  { color: "#9b7af8", id: "knowhere", label: "Agent + Knowhere" },
  { color: "#3f3f3f", id: "mineru", label: "Agent + MinerU" },
] as const;

const benchmarkMetrics: readonly BenchmarkMetric[] = [
  { label: "token used", values: { raw: 1629.55, knowhere: 1573.86, mineru: 1502.65 } },
  { label: "time used", values: { raw: 20.57, knowhere: 15.25, mineru: 15.2 } },
  { label: "agent loops", values: { raw: 2.61, knowhere: 2.14, mineru: 2.18 } },
  { label: "first-time acc", values: { raw: 0.5, knowhere: 0.68, mineru: 0.59 } },
  { label: "acc with user feedback", values: { raw: 0.53, knowhere: 0.79, mineru: 0.54 } },
  { label: "recall", values: { raw: 0.74, knowhere: 0.82, mineru: 0.76 } },
] as const;

const getBenchmarkMetricScaleMax = (label: string): number => {
  switch (label) {
    case "token used":
      return 1800;
    case "time used":
      return 25;
    case "agent loops":
      return 5;
    default:
      return 1;
  }
};

const benchmarkData: readonly BenchmarkDatum[] = benchmarkMetrics.map((metric) => {
  const maxValue = getBenchmarkMetricScaleMax(metric.label);
  const scaleValue = (value: number): number => Number(((value / maxValue) * 100).toFixed(2));

  return {
    compactLabel: metric.label,
    knowhere: scaleValue(metric.values.knowhere),
    knowhereValue: metric.values.knowhere,
    label: metric.label,
    mineru: scaleValue(metric.values.mineru),
    mineruValue: metric.values.mineru,
    raw: scaleValue(metric.values.raw),
    rawValue: metric.values.raw,
  };
});

const stripePattern = (color: string, thickness = 1, size = 8): CSSProperties => ({
  backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 ${size - thickness}px, ${color} ${size - thickness}px ${size}px)`,
});

const getRawHatchPattern = (): CSSProperties => ({
  backgroundColor: RAW_PATTERN_BASE_COLOR,
  backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 ${RAW_PATTERN_SIZE - RAW_PATTERN_LINE_WIDTH}px, ${RAW_PATTERN_LINE_CSS_COLOR} ${RAW_PATTERN_SIZE - RAW_PATTERN_LINE_WIDTH}px ${RAW_PATTERN_SIZE}px)`,
});

const getMineruLogoMaskStyle = (): CSSProperties => ({
  backgroundColor: "#18181b",
  maskImage: `url(${MINERU_LOGO_SRC})`,
  maskPosition: "left center",
  maskRepeat: "no-repeat",
  maskSize: "contain",
  WebkitMaskImage: `url(${MINERU_LOGO_SRC})`,
  WebkitMaskPosition: "left center",
  WebkitMaskRepeat: "no-repeat",
  WebkitMaskSize: "contain",
});

const formatBenchmarkValue = (value: number): string => {
  if (value >= 100) {
    return value.toFixed(2);
  }

  if (value >= 10) {
    return value.toFixed(2).replace(/0$/, "");
  }

  return value.toFixed(2);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isBenchmarkSeriesId = (value: unknown): value is BenchmarkSeriesId =>
  value === "raw" || value === "knowhere" || value === "mineru";

const isBenchmarkDatum = (value: unknown): value is BenchmarkDatum =>
  isRecord(value) &&
  typeof value.label === "string" &&
  typeof value.rawValue === "number" &&
  typeof value.knowhereValue === "number" &&
  typeof value.mineruValue === "number";

const getBenchmarkDatumValue = (datum: BenchmarkDatum, seriesId: BenchmarkSeriesId): number => {
  switch (seriesId) {
    case "raw":
      return datum.rawValue;
    case "knowhere":
      return datum.knowhereValue;
    case "mineru":
      return datum.mineruValue;
  }
};

const getBenchmarkSeries = (seriesId: BenchmarkSeriesId): BenchmarkSeries =>
  benchmarkSeries.find((series) => series.id === seriesId) ?? benchmarkSeries[0];

const getBenchmarkSeriesSwatchBorderColor = (series: BenchmarkSeries): string => {
  switch (series.id) {
    case "raw":
      return "#d4d4d8";
    case "knowhere":
      return "#8b5cf6";
    case "mineru":
      return "#27272a";
  }
};

const BenchmarkSeriesSwatch = ({
  className,
  series,
}: {
  readonly className?: string;
  readonly series: BenchmarkSeries;
}): JSX.Element => (
  <span
    className={cn("border", className)}
    style={{
      backgroundColor: series.color,
      borderColor: getBenchmarkSeriesSwatchBorderColor(series),
      ...(series.pattern ? getRawHatchPattern() : {}),
    }}
  />
);

const BenchmarkSeriesLabel = ({
  compact = false,
  series,
}: {
  readonly compact?: boolean;
  readonly series: BenchmarkSeries;
}): JSX.Element => {
  if (series.id === "knowhere") {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        <span>Agent +</span>
        <KnowhereBrand
          className={compact ? "w-[68px]" : "w-[78px]"}
          sizes={compact ? "68px" : "78px"}
          tone="light"
        />
      </span>
    );
  }

  if (series.id === "mineru") {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        <span>Agent +</span>
        <span
          aria-hidden="true"
          className={cn("block shrink-0", compact ? "h-[14px] w-[58px]" : "h-[16px] w-[66px]")}
          style={getMineruLogoMaskStyle()}
        />
      </span>
    );
  }

  return <span className="whitespace-nowrap">{series.label}</span>;
};

const getBenchmarkLabelDatum = (
  payload: unknown,
  index: number | undefined
): BenchmarkDatum | null => {
  if (isBenchmarkDatum(payload)) {
    return payload;
  }

  if (typeof index !== "number") {
    return null;
  }

  return benchmarkData[index] ?? null;
};

const BenchmarkTooltip = ({ active, payload }: TooltipProps<number, string>) => {
  const datum = payload?.find((item) => isBenchmarkDatum(item.payload))?.payload;

  if (!active || !isBenchmarkDatum(datum)) {
    return null;
  }

  const visiblePayload = payload?.filter((item) => isBenchmarkSeriesId(item.dataKey)) ?? [];

  return (
    <div className="min-w-[19rem] border border-zinc-200 bg-white px-4 py-3 text-xs shadow-[4px_4px_0_0_rgba(24,24,27,0.12)]">
      <p className="mb-2 text-sm font-semibold leading-5 text-zinc-950">{datum.label}</p>
      <div className="grid gap-2">
        {visiblePayload.map((item) => {
          const seriesId = item.dataKey as BenchmarkSeriesId;
          const series = getBenchmarkSeries(seriesId);

          return (
            <div key={series.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
              <span className="flex min-w-0 items-center gap-2.5 text-zinc-950">
                <BenchmarkSeriesSwatch className="h-4 w-8 shrink-0" series={series} />
                <BenchmarkSeriesLabel series={series} />
              </span>
              <span className="font-mono font-semibold tabular-nums text-zinc-950">
                {formatBenchmarkValue(getBenchmarkDatumValue(datum, series.id))}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const getNumber = (value: number | string | undefined): number | null => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : null;
  }

  if (typeof value === "string") {
    const parsedValue = Number(value);
    return Number.isFinite(parsedValue) ? parsedValue : null;
  }

  return null;
};

const BenchmarkRawBarShape = ({ height, width, x, y }: BenchmarkBarShapeProps): JSX.Element => {
  const xValue = getNumber(x);
  const yValue = getNumber(y);
  const widthValue = getNumber(width);
  const heightValue = getNumber(height);

  if (
    xValue === null ||
    yValue === null ||
    widthValue === null ||
    heightValue === null ||
    widthValue <= 0 ||
    heightValue <= 0
  ) {
    return <g />;
  }

  const lineCount = Math.ceil((heightValue + widthValue) / RAW_PATTERN_SIZE) + 2;
  const lineOffsets = Array.from(
    { length: lineCount },
    (_, index) => -heightValue + index * RAW_PATTERN_SIZE
  );

  return (
    <svg
      aria-hidden="true"
      focusable="false"
      height={heightValue}
      overflow="hidden"
      width={widthValue}
      x={xValue}
      y={yValue}
    >
      <rect fill={RAW_PATTERN_BASE_COLOR} height={heightValue} width={widthValue} x={0} y={0} />
      {lineOffsets.map((offset) => (
        <line
          key={offset}
          stroke={RAW_PATTERN_LINE_COLOR}
          strokeOpacity={RAW_PATTERN_LINE_OPACITY}
          strokeWidth={RAW_PATTERN_LINE_WIDTH}
          x1={offset}
          x2={offset + heightValue}
          y1={heightValue}
          y2={0}
        />
      ))}
    </svg>
  );
};

const renderBenchmarkValueLabel =
  (seriesId: BenchmarkSeriesId) =>
  ({ index, payload, width, x, y }: BenchmarkLabelProps) => {
    const datum = getBenchmarkLabelDatum(payload, index);

    if (!datum) {
      return <g />;
    }

    const xValue = getNumber(x);
    const yValue = getNumber(y);
    const widthValue = getNumber(width);

    if (xValue === null || yValue === null || widthValue === null) {
      return <g />;
    }

    const labelX = xValue + widthValue / 2 + VALUE_LABEL_X_OFFSET;
    const labelY = yValue - VALUE_LABEL_GAP;

    return (
      <text
        fill={VALUE_LABEL_COLOR}
        fontFamily="var(--font-mono-display)"
        fontSize={11}
        textAnchor="start"
        transform={`rotate(-60 ${labelX} ${labelY})`}
        x={labelX}
        y={labelY}
      >
        {formatBenchmarkValue(getBenchmarkDatumValue(datum, seriesId))}
      </text>
    );
  };

const BenchmarkXAxisTick = ({ layout, payload, x, y }: BenchmarkAxisTickProps) => {
  const xValue = getNumber(x);
  const yValue = getNumber(y);
  const label = typeof payload?.value === "string" ? payload.value : "";

  if (xValue === null || yValue === null || !label) {
    return <g />;
  }

  return (
    <g transform={`translate(${xValue},${yValue + 12})`}>
      {getBenchmarkTickLines(label, layout).map((line, index) => (
        <text
          fill="#3f3f46"
          fontFamily="var(--font-mono-display)"
          fontSize={getBenchmarkTickFontSize(layout)}
          key={line}
          textAnchor="middle"
          x={0}
          y={index * 14}
        >
          {line}
        </text>
      ))}
    </g>
  );
};

const leftAxisTicks = [0, 16.6667, 33.3333, 50, 66.6667, 83.3333, 100] as const;
const percentAxisTicks = [0, 20, 40, 60, 80, 100] as const;

const formatTokenScaleTick = (value: number): string => `${Math.round(value * 18)}`;
const formatTimeScaleTick = (value: number): string => `${Math.round(value / 4)}`;
const formatLoopScaleTick = (value: number): string => `${Math.round(value / 20)}`;

const getBenchmarkChartLayout = (): BenchmarkChartLayout => {
  if (typeof window === "undefined") {
    return "wide";
  }

  if (window.matchMedia("(min-width: 769px)").matches) {
    return "wide";
  }

  if (window.matchMedia("(min-width: 768px)").matches) {
    return "medium";
  }

  return "compact";
};

const useBenchmarkChartLayout = (): BenchmarkChartLayout => {
  const [chartLayout, setChartLayout] = useState<BenchmarkChartLayout>("wide");

  useEffect(() => {
    const handleResize = (): void => {
      setChartLayout(getBenchmarkChartLayout());
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return chartLayout;
};

const getBenchmarkTickLines = (
  label: string,
  chartLayout: BenchmarkChartLayout
): readonly string[] => {
  if (chartLayout === "compact") {
    switch (label) {
      case "token used":
        return ["token", "used"];
      case "time used":
        return ["time", "used"];
      case "agent loops":
        return ["agent", "loops"];
      case "first-time acc":
        return ["first-time", "acc"];
      case "acc with user feedback":
        return ["acc with", "user", "feedback"];
      default:
        return [label];
    }
  }

  if (chartLayout === "medium") {
    switch (label) {
      case "first-time acc":
        return ["first-time", "acc"];
      case "acc with user feedback":
        return ["acc with", "user", "feedback"];
      default:
        return [label];
    }
  }

  if (label === "acc with user feedback") {
    return ["acc with user", "feedback"];
  }

  return [label];
};

const getBenchmarkTickFontSize = (chartLayout: BenchmarkChartLayout): number =>
  chartLayout === "compact" ? 10 : 11;

const BenchmarkChart = () => {
  const [hiddenSeriesIds, setHiddenSeriesIds] = useState<readonly BenchmarkSeriesId[]>([]);
  const chartLayout = useBenchmarkChartLayout();

  const handleToggleSeries = (seriesId: BenchmarkSeriesId): void => {
    setHiddenSeriesIds((currentSeriesIds) => {
      const isHidden = currentSeriesIds.includes(seriesId);

      if (isHidden) {
        return currentSeriesIds.filter((currentSeriesId) => currentSeriesId !== seriesId);
      }

      if (currentSeriesIds.length >= benchmarkSeries.length - 1) {
        return currentSeriesIds;
      }

      return [...currentSeriesIds, seriesId];
    });
  };

  return (
    <div className="-mx-[18px] h-[482px] bg-white py-6 min-[640px]:max-[767px]:-mx-[46px] min-[768px]:-mx-[48px]">
      <div className="h-full w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden">
        <div className="ml-[30px] flex h-full w-[580px] flex-col gap-[22px] min-[768px]:ml-8 min-[768px]:w-[704px] min-[768px]:gap-6 min-[769px]:w-[912px]">
          <div className="flex shrink-0 flex-nowrap items-center justify-center gap-x-[22px] text-xs leading-4 text-zinc-950 min-[768px]:gap-x-6">
            {benchmarkSeries.map((series) => {
              const isHidden = hiddenSeriesIds.includes(series.id);

              return (
                <button
                  aria-pressed={!isHidden}
                  className={cn(
                    "flex items-center gap-2 whitespace-nowrap border border-transparent px-1 py-0.5 transition-opacity hover:border-zinc-300",
                    isHidden && "opacity-40"
                  )}
                  key={series.id}
                  onClick={() => handleToggleSeries(series.id)}
                  type="button"
                >
                  <BenchmarkSeriesSwatch className="h-4 w-8 shrink-0" series={series} />
                  <BenchmarkSeriesLabel series={series} />
                </button>
              );
            })}
          </div>

          <div className="min-h-0 flex-1">
            <ResponsiveContainer
              height="100%"
              initialDimension={{ height: 410, width: 912 }}
              width="100%"
            >
              <BarChart
                barCategoryGap="20%"
                barGap={0}
                data={[...benchmarkData]}
                margin={{ bottom: 42, left: 0, right: 34, top: 40 }}
              >
                <CartesianGrid stroke="#e4e4e7" strokeDasharray="0" vertical={false} />
                <XAxis
                  axisLine={{ stroke: "#a1a1aa", strokeWidth: 1 }}
                  dataKey="compactLabel"
                  interval={0}
                  minTickGap={0}
                  tick={<BenchmarkXAxisTick layout={chartLayout} />}
                  tickLine={false}
                />
                <YAxis
                  axisLine={{ stroke: "#a1a1aa", strokeWidth: 1 }}
                  domain={[0, 100]}
                  label={{
                    angle: -90,
                    dx: -1,
                    fill: "#71717a",
                    fontSize: 11,
                    offset: 4,
                    position: "insideLeft",
                    value: "token used",
                  }}
                  tick={{ fill: "#3f3f46", fontSize: 11, fontFamily: "var(--font-mono-display)" }}
                  tickFormatter={formatTokenScaleTick}
                  tickLine={false}
                  tickMargin={AXIS_NUMBER_GAP}
                  ticks={[...leftAxisTicks]}
                  width={50}
                  yAxisId="value"
                />
                <YAxis
                  axisLine={{ stroke: "#a1a1aa", strokeWidth: 1 }}
                  domain={[0, 100]}
                  label={{
                    angle: -90,
                    fill: "#71717a",
                    fontSize: 11,
                    offset: 16,
                    position: "insideRight",
                    value: "time used (s)",
                  }}
                  orientation="right"
                  tick={{ fill: "#3f3f46", fontSize: 11, fontFamily: "var(--font-mono-display)" }}
                  tickFormatter={formatTimeScaleTick}
                  tickLine={false}
                  tickMargin={AXIS_NUMBER_GAP}
                  ticks={[...percentAxisTicks]}
                  width={54}
                  yAxisId="time"
                />
                <YAxis
                  axisLine={{ stroke: "#a1a1aa", strokeWidth: 1 }}
                  domain={[0, 100]}
                  label={{
                    angle: -90,
                    fill: "#71717a",
                    fontSize: 11,
                    offset: 16,
                    position: "insideRight",
                    value: "agent loops",
                  }}
                  orientation="right"
                  tick={{ fill: "#3f3f46", fontSize: 11, fontFamily: "var(--font-mono-display)" }}
                  tickFormatter={formatLoopScaleTick}
                  tickLine={false}
                  tickMargin={AXIS_NUMBER_GAP}
                  ticks={[...percentAxisTicks]}
                  width={54}
                  yAxisId="loops"
                />
                <Tooltip
                  content={<BenchmarkTooltip />}
                  cursor={{ fill: "rgba(161, 161, 170, 0.12)" }}
                  isAnimationActive={false}
                />
                <ReferenceLine
                  position="start"
                  stroke="#d4d4d8"
                  strokeDasharray="5 5"
                  x="first-time acc"
                  yAxisId="value"
                />
                {benchmarkSeries.map((series) => {
                  const isHidden = hiddenSeriesIds.includes(series.id);

                  return (
                    <Bar
                      activeBar={{ fillOpacity: 1, stroke: "#27272a", strokeWidth: 1 }}
                      dataKey={series.id}
                      fill={series.color}
                      hide={isHidden}
                      isAnimationActive={false}
                      key={series.id}
                      label={renderBenchmarkValueLabel(series.id)}
                      maxBarSize={24}
                      name={series.label}
                      radius={[1, 1, 0, 0]}
                      shape={series.pattern ? <BenchmarkRawBarShape /> : undefined}
                      yAxisId="value"
                    >
                      {benchmarkData.map((datum) => (
                        <Cell
                          fill={series.color}
                          fillOpacity={1}
                          key={`${series.id}-${datum.label}`}
                          stroke="none"
                          strokeWidth={0}
                        />
                      ))}
                    </Bar>
                  );
                })}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

const ComparisonIndicator = ({ status }: { status: ComparisonStatus }) => {
  const map = {
    yes: {
      icon: <KnowhereIcon className="size-4" name="check-2" />,
      label: "Yes",
      color: "#00bc7d",
    },
    bad: {
      icon: <KnowhereIcon className="size-4" name="component" />,
      label: "Bad",
      color: "#efb100",
    },
    no: {
      icon: <KnowhereIcon className="size-4" name="state-x" />,
      label: "No",
      color: "#ff6467",
    },
  } as const;

  const item = map[status];

  return (
    <span className="inline-flex items-center justify-center gap-2" style={{ color: item.color }}>
      {item.icon}
      <span className="text-base font-semibold leading-6">{item.label}</span>
    </span>
  );
};

const getFilteredRows = (activeTab: ComparisonTab) => {
  if (activeTab === "All") {
    return comparisonRows;
  }

  return comparisonRows.filter((row) => row.category === activeTab);
};

export const ComparisonShowcase = () => {
  const [activeTab, setActiveTab] = useState<ComparisonTab>("All");
  const filteredRows = getFilteredRows(activeTab);

  return (
    <div className="flex flex-col gap-10">
      <BenchmarkChart />
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex w-max flex-nowrap gap-px">
          {comparisonTabs.map((tab) => (
            <StatefulTab
              active={activeTab === tab}
              key={tab}
              className={cn(monoDisplayClassName, "focus-visible:ring-zinc-500")}
              onClick={() => setActiveTab(tab)}
              tone={comparisonTabTone}
              type="button"
            >
              {tab}
            </StatefulTab>
          ))}
        </div>
      </div>

      <ScrollAreaPrimitive.Root
        type="auto"
        className="relative overflow-hidden border border-zinc-200"
      >
        <ScrollAreaPrimitive.Viewport className="h-full w-full bg-white">
          <div className={cn(comparisonTableGridClassName, "bg-[#f4f4f5]")}>
            <div
              className={cn(
                "flex items-center justify-center border-r border-zinc-200 px-6 py-4 text-sm leading-[18px] text-zinc-600 min-[769px]:text-xl min-[769px]:leading-8",
                monoDisplayClassName
              )}
            >
              Feature
            </div>
            <div className="relative flex items-center justify-center gap-3 overflow-hidden border-r border-zinc-200 px-6 py-4">
              <div className="absolute inset-0 opacity-40" style={stripePattern("#e4e4e7", 1, 9)} />
              <div className="relative flex items-center gap-3">
                <LandingBrand compact />
              </div>
            </div>
            <div
              className={cn(
                "flex items-center justify-center px-6 py-4 text-sm leading-[18px] text-zinc-600 min-[769px]:text-xl min-[769px]:leading-8",
                monoDisplayClassName
              )}
            >
              Others
            </div>
          </div>

          {filteredRows.map((row) => (
            <div
              key={row.feature}
              className={cn(comparisonTableGridClassName, "border-t border-zinc-100 bg-white")}
            >
              <div className="relative border-r border-zinc-100 px-6 py-6">
                {row.emphasize ? (
                  <div
                    className="absolute inset-0 opacity-30"
                    style={stripePattern("#f4f4f5", 1, 8)}
                  />
                ) : null}
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "text-base leading-6 text-zinc-950 min-[769px]:text-base min-[769px]:leading-6 font-sans"
                      )}
                    >
                      {row.feature}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center border-r border-zinc-100 bg-white px-6 py-6">
                {row.knowhereStripe ? (
                  <div
                    className="absolute inset-0 opacity-25"
                    style={stripePattern("#f4f4f5", 1, 8)}
                  />
                ) : null}
                <div className="relative">
                  <ComparisonIndicator status={row.knowhere} />
                </div>
              </div>
              <div className="relative flex items-center justify-center px-6 py-6">
                {row.othersStripe ? (
                  <div
                    className="absolute inset-0 opacity-25"
                    style={stripePattern("#f4f4f5", 1, 8)}
                  />
                ) : null}
                <div className="relative">
                  <ComparisonIndicator status={row.others} />
                </div>
              </div>
            </div>
          ))}
        </ScrollAreaPrimitive.Viewport>

        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="vertical"
          className="z-30 flex h-full w-2 flex-col touch-none select-none border-l border-zinc-200 bg-zinc-100"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-zinc-400 transition-colors hover:bg-zinc-500 active:bg-zinc-600" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="horizontal"
          className="z-30 flex h-2 flex-col touch-none select-none border-t border-zinc-200 bg-zinc-100"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-zinc-400 transition-colors hover:bg-zinc-500 active:bg-zinc-600" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.Corner className="bg-zinc-100" />
      </ScrollAreaPrimitive.Root>
    </div>
  );
};
