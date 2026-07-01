"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import {
  type ComparisonStatus,
  type ComparisonTab,
  comparisonTabs,
  getComparisonRows,
  getComparisonTabLabel,
} from "@app/(landing)/_components/landing-home-data";
import { trackLandingInteraction } from "@app/(landing)/_components/landing-tracked-link";
import { StatefulTab } from "@app/(landing)/_components/stateful-tab";
import { KnowhereBrand } from "@components/brand/knowhere-brand";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import * as ScrollAreaPrimitive from "@radix-ui/react-scroll-area";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { useTheme } from "next-themes";
import { type CSSProperties, type JSX, type ReactNode, useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  LabelList,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  type TooltipContentProps,
  XAxis,
  YAxis,
} from "recharts";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const comparisonTableGridClassName =
  "min-w-[720px] grid grid-cols-[1.35fr_0.9fr_0.9fr] min-[769px]:min-w-0";
const benchmarkChartShellClassName =
  "-mx-[18px] h-[482px] bg-white py-6 dark:bg-[#111113] min-[640px]:max-[767px]:-mx-[46px] min-[768px]:-mx-[48px]";
const benchmarkChartScrollClassName =
  "h-full w-full min-w-0 max-w-full overflow-x-auto overflow-y-hidden";
const benchmarkChartContentClassName =
  "ml-[30px] flex h-full w-[580px] flex-col gap-[22px] min-[768px]:ml-8 min-[768px]:w-[704px] min-[768px]:gap-6 min-[769px]:w-[912px]";
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
const UNSTRUCTURED_LOGO_SRC = "/images/brand/unstructured-mark.png";
const RAW_PATTERN_BASE_COLOR = "#e4e4e7";
const RAW_PATTERN_LINE_COLOR = "#f4f4f5";
const RAW_PATTERN_LINE_OPACITY = 1;
const RAW_PATTERN_LINE_WIDTH = 0.7;
const RAW_PATTERN_SIZE = 6;
const UNSTRUCTURED_LOGO_COLOR = "#0addf8";
const UNSTRUCTURED_LOGO_BORDER_COLOR = "#08b7d0";
const AXIS_NUMBER_GAP = 2;
const VALUE_LABEL_GAP = 5;
const VALUE_LABEL_Z_INDEX = 2000;
const VALUE_AXIS_ID = "value";
const TIME_AXIS_ID = "secondary-time";
const LOOP_AXIS_ID = "tertiary-loops";
const benchmarkChartThemes = {
  light: {
    activeStroke: "#27272a",
    axis: "#a1a1aa",
    cursor: "rgba(161, 161, 170, 0.12)",
    grid: "#e4e4e7",
    highText: "#09090b",
    knowhere: "#9b7af8",
    knowhereBorder: "#8b5cf6",
    markitdown: "#2563eb",
    markitdownBorder: "#1d4ed8",
    mineru: "#3f3f3f",
    mineruBorder: "#27272a",
    mineruLogo: "#18181b",
    mutedText: "#71717a",
    panel: "#ffffff",
    rawBase: RAW_PATTERN_BASE_COLOR,
    rawBorder: "#d4d4d8",
    rawLine: RAW_PATTERN_LINE_COLOR,
    rawLineOpacity: RAW_PATTERN_LINE_OPACITY,
    reference: "#d4d4d8",
    text: "#3f3f46",
    tooltipBorder: "#e4e4e7",
    tooltipShadow: "4px 4px 0 0 rgba(24, 24, 27, 0.12)",
    unstructured: UNSTRUCTURED_LOGO_COLOR,
    unstructuredBorder: UNSTRUCTURED_LOGO_BORDER_COLOR,
    valueLabel: "#52525b",
  },
  dark: {
    activeStroke: "#fafafa",
    axis: "#52525b",
    cursor: "rgba(82, 82, 91, 0.3)",
    grid: "#27272a",
    highText: "#fafafa",
    knowhere: "#8e6cf3",
    knowhereBorder: "#a78bfa",
    markitdown: "#60a5fa",
    markitdownBorder: "#93c5fd",
    mineru: "#a1a1aa",
    mineruBorder: "#d4d4d8",
    mineruLogo: "#fafafa",
    mutedText: "#a1a1aa",
    panel: "#111113",
    rawBase: "#27272a",
    rawBorder: "#52525b",
    rawLine: "#52525b",
    rawLineOpacity: 0.45,
    reference: "#3f3f46",
    text: "#d4d4d8",
    tooltipBorder: "#3f3f46",
    tooltipShadow: "4px 4px 0 0 rgba(0, 0, 0, 0.3)",
    unstructured: UNSTRUCTURED_LOGO_COLOR,
    unstructuredBorder: UNSTRUCTURED_LOGO_BORDER_COLOR,
    valueLabel: "#d4d4d8",
  },
} as const;

type BenchmarkChartColors = (typeof benchmarkChartThemes)[keyof typeof benchmarkChartThemes];

type BenchmarkSeries = {
  color: string;
  id: "raw" | "knowhere" | "markitdown" | "mineru" | "unstructured";
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
  markitdown: number;
  markitdownValue: number;
  mineru: number;
  mineruValue: number;
  raw: number;
  rawValue: number;
  unstructured: number;
  unstructuredValue: number;
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
  isDarkTheme?: boolean;
  width?: number | string;
  x?: number | string;
  y?: number | string;
};

type ResolvedThemeState = {
  isDarkTheme: boolean;
  isThemeReady: boolean;
};

const useResolvedThemeState = (): ResolvedThemeState => {
  const { resolvedTheme } = useTheme();
  const [isThemeReady, setIsThemeReady] = useState(false);

  useEffect(() => {
    setIsThemeReady(true);
  }, []);

  return {
    isDarkTheme: isThemeReady && resolvedTheme === "dark",
    isThemeReady,
  };
};

const getBenchmarkChartColors = (isDarkTheme: boolean): BenchmarkChartColors =>
  isDarkTheme ? benchmarkChartThemes.dark : benchmarkChartThemes.light;

const benchmarkSeries: readonly BenchmarkSeries[] = [
  { color: RAW_PATTERN_BASE_COLOR, id: "raw", label: "Agent + Raw Docs", pattern: true },
  { color: "#9b7af8", id: "knowhere", label: "Agent + Knowhere" },
  { color: UNSTRUCTURED_LOGO_COLOR, id: "unstructured", label: "Agent + Unstructured" },
  { color: "#3f3f3f", id: "mineru", label: "Agent + MinerU" },
  { color: "#2563eb", id: "markitdown", label: "Agent + Markitdown" },
] as const;

const benchmarkMetrics: readonly BenchmarkMetric[] = [
  {
    label: "token used",
    values: {
      raw: 1629.545455,
      knowhere: 1573.863636,
      markitdown: 1502.646491,
      unstructured: 1886.363636,
      mineru: 1670.454545,
    },
  },
  {
    label: "time used",
    values: {
      raw: 20.56818182,
      knowhere: 15.25,
      markitdown: 15.20454545,
      unstructured: 16.61365,
      mineru: 17.47727273,
    },
  },
  {
    label: "agent loops",
    values: {
      raw: 2.613636364,
      knowhere: 2.136363636,
      markitdown: 2.181818182,
      unstructured: 2.340909091,
      mineru: 2.204545455,
    },
  },
  {
    label: "first-time acc",
    values: {
      raw: 0.5,
      knowhere: 0.681818182,
      markitdown: 0.590909091,
      unstructured: 0.613636364,
      mineru: 0.659090909,
    },
  },
  {
    label: "acc with user feedback",
    values: {
      raw: 0.527777778,
      knowhere: 0.788888889,
      markitdown: 0.538961039,
      unstructured: 0.685714286,
      mineru: 0.642857143,
    },
  },
  {
    label: "recall",
    values: {
      raw: 0.738636362,
      knowhere: 0.821969697,
      markitdown: 0.761363629,
      unstructured: 0.768939,
      mineru: 0.780303,
    },
  },
] as const;

const TOKEN_SCALE_MAX = 2000;
const TIME_SCALE_MAX = 25;
const LOOP_SCALE_MAX = 5;

const getBenchmarkMetricScaleMax = (label: string): number => {
  switch (label) {
    case "token used":
      return TOKEN_SCALE_MAX;
    case "time used":
      return TIME_SCALE_MAX;
    case "agent loops":
      return LOOP_SCALE_MAX;
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
    markitdown: scaleValue(metric.values.markitdown),
    markitdownValue: metric.values.markitdown,
    mineru: scaleValue(metric.values.mineru),
    mineruValue: metric.values.mineru,
    raw: scaleValue(metric.values.raw),
    rawValue: metric.values.raw,
    unstructured: scaleValue(metric.values.unstructured),
    unstructuredValue: metric.values.unstructured,
  };
});

const stripePattern = (color: string, thickness = 1, size = 8): CSSProperties => ({
  backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 ${size - thickness}px, ${color} ${size - thickness}px ${size}px)`,
});

const getRawHatchPattern = (colors: BenchmarkChartColors): CSSProperties => ({
  backgroundColor: colors.rawBase,
  backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 ${RAW_PATTERN_SIZE - RAW_PATTERN_LINE_WIDTH}px, ${colors.rawLine} ${RAW_PATTERN_SIZE - RAW_PATTERN_LINE_WIDTH}px ${RAW_PATTERN_SIZE}px)`,
});

const getMineruLogoMaskStyle = (colors: BenchmarkChartColors): CSSProperties => ({
  backgroundColor: colors.mineruLogo,
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

const formatBenchmarkBarLabelValue = (value: number): string => {
  if (value >= 100) {
    return Math.round(value).toString();
  }

  return formatBenchmarkValue(value);
};

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null;

const isBenchmarkSeriesId = (value: unknown): value is BenchmarkSeriesId =>
  value === "raw" ||
  value === "knowhere" ||
  value === "markitdown" ||
  value === "mineru" ||
  value === "unstructured";

const isBenchmarkDatum = (value: unknown): value is BenchmarkDatum =>
  isRecord(value) &&
  typeof value.label === "string" &&
  typeof value.rawValue === "number" &&
  typeof value.knowhereValue === "number" &&
  typeof value.markitdownValue === "number" &&
  typeof value.mineruValue === "number" &&
  typeof value.unstructuredValue === "number";

const getBenchmarkDatumValue = (datum: BenchmarkDatum, seriesId: BenchmarkSeriesId): number => {
  switch (seriesId) {
    case "raw":
      return datum.rawValue;
    case "knowhere":
      return datum.knowhereValue;
    case "markitdown":
      return datum.markitdownValue;
    case "mineru":
      return datum.mineruValue;
    case "unstructured":
      return datum.unstructuredValue;
  }
};

const getBenchmarkSeries = (seriesId: BenchmarkSeriesId): BenchmarkSeries =>
  benchmarkSeries.find((series) => series.id === seriesId) ?? benchmarkSeries[0];

const getBenchmarkSeriesColor = (series: BenchmarkSeries, colors: BenchmarkChartColors): string => {
  switch (series.id) {
    case "raw":
      return colors.rawBase;
    case "knowhere":
      return colors.knowhere;
    case "markitdown":
      return colors.markitdown;
    case "mineru":
      return colors.mineru;
    case "unstructured":
      return colors.unstructured;
  }
};

const getBenchmarkSeriesSwatchBorderColor = (
  series: BenchmarkSeries,
  colors: BenchmarkChartColors
): string => {
  switch (series.id) {
    case "raw":
      return colors.rawBorder;
    case "knowhere":
      return colors.knowhereBorder;
    case "markitdown":
      return colors.markitdownBorder;
    case "mineru":
      return colors.mineruBorder;
    case "unstructured":
      return colors.unstructuredBorder;
  }
};

const BenchmarkSeriesSwatch = ({
  className,
  colors,
  series,
}: {
  readonly className?: string;
  readonly colors: BenchmarkChartColors;
  readonly series: BenchmarkSeries;
}): JSX.Element => (
  <span
    className={cn("border", className)}
    style={{
      backgroundColor: getBenchmarkSeriesColor(series, colors),
      borderColor: getBenchmarkSeriesSwatchBorderColor(series, colors),
      ...(series.pattern ? getRawHatchPattern(colors) : {}),
    }}
  />
);

const BenchmarkSeriesLabel = ({
  compact = false,
  colors,
  series,
}: {
  readonly compact?: boolean;
  readonly colors: BenchmarkChartColors;
  readonly series: BenchmarkSeries;
}): JSX.Element => {
  if (series.id === "knowhere") {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        {compact ? null : <span>Agent +</span>}
        <KnowhereBrand
          className={compact ? "w-[68px]" : "w-[78px]"}
          sizes={compact ? "68px" : "78px"}
          tone="auto"
        />
      </span>
    );
  }

  if (series.id === "mineru") {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        {compact ? null : <span>Agent +</span>}
        <span
          aria-hidden="true"
          className={cn("block shrink-0", compact ? "h-[14px] w-[58px]" : "h-[16px] w-[66px]")}
          style={getMineruLogoMaskStyle(colors)}
        />
      </span>
    );
  }

  if (series.id === "unstructured") {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        {compact ? null : <span>Agent +</span>}
        <Image
          alt=""
          aria-hidden="true"
          className={cn("block shrink-0", compact ? "size-[15px]" : "size-4")}
          height={16}
          src={UNSTRUCTURED_LOGO_SRC}
          width={16}
        />
        <span className="font-medium">Unstructured</span>
      </span>
    );
  }

  if (series.id === "markitdown") {
    return (
      <span className="inline-flex min-w-0 items-center gap-1.5 whitespace-nowrap">
        {compact ? null : <span>Agent +</span>}
        <span className="font-medium">Markitdown</span>
      </span>
    );
  }

  if (compact && series.id === "raw") {
    return <span className="whitespace-nowrap">Raw Docs</span>;
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

const BenchmarkTooltip = ({
  active,
  colors,
  payload,
}: Partial<TooltipContentProps<number, string>> & {
  readonly colors: BenchmarkChartColors;
}): JSX.Element | null => {
  const datum = payload?.find((item) => isBenchmarkDatum(item.payload))?.payload;

  if (!active || !isBenchmarkDatum(datum)) {
    return null;
  }

  const visiblePayload = payload?.filter((item) => isBenchmarkSeriesId(item.dataKey)) ?? [];

  return (
    <div
      className="min-w-[19rem] border px-4 py-3 text-xs"
      style={{
        backgroundColor: colors.panel,
        borderColor: colors.tooltipBorder,
        boxShadow: colors.tooltipShadow,
        color: colors.highText,
      }}
    >
      <p className="mb-2 text-sm font-semibold leading-5">{datum.label}</p>
      <div className="grid gap-2">
        {visiblePayload.map((item) => {
          const seriesId = item.dataKey as BenchmarkSeriesId;
          const series = getBenchmarkSeries(seriesId);

          return (
            <div key={series.id} className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-5">
              <span className="flex min-w-0 items-center gap-2.5">
                <BenchmarkSeriesSwatch
                  className="h-4 w-8 shrink-0"
                  colors={colors}
                  series={series}
                />
                <BenchmarkSeriesLabel colors={colors} series={series} />
              </span>
              <span className="font-mono font-semibold tabular-nums">
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

const BenchmarkRawBarShape = ({
  height,
  isDarkTheme = false,
  width,
  x,
  y,
}: BenchmarkBarShapeProps): JSX.Element => {
  const colors = getBenchmarkChartColors(isDarkTheme);
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
      <rect fill={colors.rawBase} height={heightValue} width={widthValue} x={0} y={0} />
      {lineOffsets.map((offset) => (
        <line
          key={offset}
          stroke={colors.rawLine}
          strokeOpacity={colors.rawLineOpacity}
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
  (seriesId: BenchmarkSeriesId, colors: BenchmarkChartColors) =>
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

    const labelX = xValue + widthValue / 2;
    const labelY = yValue - VALUE_LABEL_GAP;

    return (
      <text
        fill={colors.valueLabel}
        fontFamily="var(--font-mono-display)"
        fontSize={10}
        paintOrder="stroke"
        stroke={colors.panel}
        strokeLinejoin="round"
        strokeWidth={2}
        textAnchor="start"
        transform={`rotate(-75 ${labelX} ${labelY})`}
        x={labelX}
        y={labelY}
      >
        {formatBenchmarkBarLabelValue(getBenchmarkDatumValue(datum, seriesId))}
      </text>
    );
  };

const BenchmarkXAxisTick = ({
  colors,
  layout,
  payload,
  x,
  y,
}: BenchmarkAxisTickProps & {
  readonly colors: BenchmarkChartColors;
}) => {
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
          fill={colors.text}
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

const leftAxisTicks = [0, 25, 50, 75, 100] as const;
const percentAxisTicks = [0, 20, 40, 60, 80, 100] as const;

const formatTokenScaleTick = (value: number): string =>
  `${Math.round((value / 100) * TOKEN_SCALE_MAX)}`;
const formatTimeScaleTick = (value: number): string =>
  `${Math.round((value / 100) * TIME_SCALE_MAX)}`;
const formatLoopScaleTick = (value: number): string =>
  `${Math.round((value / 100) * LOOP_SCALE_MAX)}`;

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

const useBenchmarkChartLayout = (): BenchmarkChartLayout | null => {
  const [chartLayout, setChartLayout] = useState<BenchmarkChartLayout | null>(null);

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

const BenchmarkChartShell = ({ children }: { readonly children: ReactNode }) => (
  <div className={benchmarkChartShellClassName}>
    <div className={benchmarkChartScrollClassName}>{children}</div>
  </div>
);

const BenchmarkChartPlaceholder = (): JSX.Element => (
  <BenchmarkChartShell>
    <div aria-hidden="true" className={benchmarkChartContentClassName} />
  </BenchmarkChartShell>
);

const BenchmarkChart = ({
  isDarkTheme,
  isThemeReady,
}: {
  readonly isDarkTheme: boolean;
  readonly isThemeReady: boolean;
}) => {
  const [hiddenSeriesIds, setHiddenSeriesIds] = useState<readonly BenchmarkSeriesId[]>([]);
  const chartLayout = useBenchmarkChartLayout();
  const colors = getBenchmarkChartColors(isDarkTheme);
  const isChartReady = isThemeReady && chartLayout !== null;

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

  if (!isChartReady) {
    return <BenchmarkChartPlaceholder />;
  }

  return (
    <BenchmarkChartShell>
      <div className={benchmarkChartContentClassName}>
        <div className="flex shrink-0 flex-nowrap items-center justify-center gap-x-[22px] text-xs leading-4 text-zinc-950 dark:text-[#fafafa] min-[768px]:gap-x-6">
          {benchmarkSeries.map((series) => {
            const isHidden = hiddenSeriesIds.includes(series.id);

            return (
              <button
                aria-pressed={!isHidden}
                className={cn(
                  "flex items-center gap-2 whitespace-nowrap border border-transparent px-1 py-0.5 transition-opacity hover:border-zinc-300 dark:hover:border-[#52525b]",
                  isHidden && "opacity-40"
                )}
                key={series.id}
                onClick={() => handleToggleSeries(series.id)}
                type="button"
              >
                <BenchmarkSeriesSwatch
                  className="h-4 w-8 shrink-0"
                  colors={colors}
                  series={series}
                />
                <BenchmarkSeriesLabel colors={colors} compact series={series} />
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
              <CartesianGrid
                stroke={colors.grid}
                strokeDasharray="0"
                vertical={false}
                yAxisId={VALUE_AXIS_ID}
              />
              <XAxis
                axisLine={{ stroke: colors.axis, strokeWidth: 1 }}
                dataKey="compactLabel"
                interval={0}
                minTickGap={0}
                tick={<BenchmarkXAxisTick colors={colors} layout={chartLayout} />}
                tickLine={false}
              />
              <YAxis
                axisLine={{ stroke: colors.axis, strokeWidth: 1 }}
                domain={[0, 100]}
                label={{
                  angle: -90,
                  dx: -1,
                  fill: colors.mutedText,
                  fontSize: 11,
                  offset: 4,
                  position: "insideLeft",
                  value: "token used",
                }}
                tick={{ fill: colors.text, fontSize: 11, fontFamily: "var(--font-mono-display)" }}
                tickFormatter={formatTokenScaleTick}
                tickLine={false}
                tickMargin={AXIS_NUMBER_GAP}
                ticks={[...leftAxisTicks]}
                width={50}
                yAxisId={VALUE_AXIS_ID}
              />
              <YAxis
                axisLine={{ stroke: colors.axis, strokeWidth: 1 }}
                dataKey="raw"
                domain={[0, 100]}
                label={{
                  angle: -90,
                  fill: colors.mutedText,
                  fontSize: 11,
                  offset: 16,
                  position: "insideRight",
                  value: "time used (s)",
                }}
                orientation="right"
                tick={{ fill: colors.text, fontSize: 11, fontFamily: "var(--font-mono-display)" }}
                tickFormatter={formatTimeScaleTick}
                tickLine={false}
                tickMargin={AXIS_NUMBER_GAP}
                ticks={[...percentAxisTicks]}
                width={54}
                yAxisId={TIME_AXIS_ID}
              />
              <YAxis
                axisLine={{ stroke: colors.axis, strokeWidth: 1 }}
                dataKey="knowhere"
                domain={[0, 100]}
                label={{
                  angle: -90,
                  fill: colors.mutedText,
                  fontSize: 11,
                  offset: 16,
                  position: "insideRight",
                  value: "agent loops",
                }}
                orientation="right"
                tick={{ fill: colors.text, fontSize: 11, fontFamily: "var(--font-mono-display)" }}
                tickFormatter={formatLoopScaleTick}
                tickLine={false}
                tickMargin={AXIS_NUMBER_GAP}
                ticks={[...percentAxisTicks]}
                width={54}
                yAxisId={LOOP_AXIS_ID}
              />
              <Tooltip
                content={<BenchmarkTooltip colors={colors} />}
                cursor={{ fill: colors.cursor }}
                isAnimationActive={false}
              />
              <ReferenceLine
                position="start"
                stroke={colors.reference}
                strokeDasharray="5 5"
                x="first-time acc"
                yAxisId={VALUE_AXIS_ID}
              />
              {benchmarkSeries.map((series) => {
                const isHidden = hiddenSeriesIds.includes(series.id);
                const seriesColor = getBenchmarkSeriesColor(series, colors);

                return (
                  <Bar
                    activeBar={
                      series.pattern ? (
                        <BenchmarkRawBarShape isDarkTheme={isDarkTheme} />
                      ) : (
                        {
                          fillOpacity: 1,
                          stroke: colors.activeStroke,
                          strokeWidth: 1,
                        }
                      )
                    }
                    dataKey={series.id}
                    fill={seriesColor}
                    hide={isHidden}
                    isAnimationActive={false}
                    key={series.id}
                    maxBarSize={24}
                    name={series.label}
                    radius={[1, 1, 0, 0]}
                    shape={
                      series.pattern ? (
                        <BenchmarkRawBarShape isDarkTheme={isDarkTheme} />
                      ) : undefined
                    }
                    yAxisId={VALUE_AXIS_ID}
                  >
                    {benchmarkData.map((datum) => (
                      <Cell
                        fill={seriesColor}
                        fillOpacity={1}
                        key={`${series.id}-${datum.label}`}
                        stroke="none"
                        strokeWidth={0}
                      />
                    ))}
                    <LabelList
                      content={renderBenchmarkValueLabel(series.id, colors)}
                      zIndex={VALUE_LABEL_Z_INDEX}
                    />
                  </Bar>
                );
              })}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </BenchmarkChartShell>
  );
};

const ComparisonIndicator = ({ label, status }: { label: string; status: ComparisonStatus }) => {
  const map = {
    yes: {
      icon: <KnowhereIcon className="size-4" name="check-2" />,
      color: "#00bc7d",
    },
    bad: {
      icon: <KnowhereIcon className="size-4" name="component" />,
      color: "#efb100",
    },
    no: {
      icon: <KnowhereIcon className="size-4" name="state-x" />,
      color: "#ff6467",
    },
  } as const;

  const item = map[status];

  return (
    <span className="inline-flex items-center justify-center gap-2" style={{ color: item.color }}>
      {item.icon}
      <span className="text-base font-semibold leading-6">{label}</span>
    </span>
  );
};

const getFilteredRows = (activeTab: ComparisonTab, rows: ReturnType<typeof getComparisonRows>) => {
  if (activeTab === "All") {
    return rows;
  }

  return rows.filter((row) => row.category === activeTab);
};

export const ComparisonShowcase = () => {
  const [activeTab, setActiveTab] = useState<ComparisonTab>("All");
  const locale = useLocale();
  const { isDarkTheme, isThemeReady } = useResolvedThemeState();
  const t = useTranslations("Landing.data");
  const tComparison = useTranslations("Landing.comparisonShowcase");
  const comparisonRows = getComparisonRows(t);
  const filteredRows = getFilteredRows(activeTab, comparisonRows);
  const activeComparisonTabTone = isDarkTheme
    ? {
        activeBg: "#3f3f46",
        activeBorder: "#71717a",
        enabledBg: "#18181b",
        enabledText: "#d4d4d8",
        hoverBg: "#27272a",
        hoverBorder: "#52525b",
        selectedBg: "#52525b",
        selectedBorder: "#71717a",
        selectedText: "#ffffff",
      }
    : comparisonTabTone;

  const handleTabChange = (tab: ComparisonTab) => {
    setActiveTab(tab);
    trackLandingInteraction("comparison_tab", "comparison", locale, { tab });
  };

  return (
    <div className="flex flex-col gap-10">
      <BenchmarkChart isDarkTheme={isDarkTheme} isThemeReady={isThemeReady} />
      <div className="hide-scrollbar overflow-x-auto">
        <div className="flex w-max flex-nowrap gap-px">
          {comparisonTabs.map((tab) => (
            <StatefulTab
              active={activeTab === tab}
              key={tab}
              className={cn(monoDisplayClassName, "focus-visible:ring-zinc-500")}
              onClick={() => handleTabChange(tab)}
              tone={activeComparisonTabTone}
              type="button"
            >
              {getComparisonTabLabel(t, tab)}
            </StatefulTab>
          ))}
        </div>
      </div>

      <ScrollAreaPrimitive.Root
        type="auto"
        className="relative overflow-hidden border border-zinc-200 dark:border-[#3f3f46]"
      >
        <ScrollAreaPrimitive.Viewport className="h-full w-full bg-white dark:bg-[#111113]">
          <div className={cn(comparisonTableGridClassName, "bg-[#f4f4f5] dark:bg-[#27272a]")}>
            <div
              className={cn(
                "flex items-center justify-center border-r border-zinc-200 px-6 py-4 text-sm leading-[18px] text-zinc-600 dark:border-[#3f3f46] dark:text-[#d4d4d8] min-[769px]:text-xl min-[769px]:leading-8",
                monoDisplayClassName
              )}
            >
              {tComparison("feature")}
            </div>
            <div className="relative flex items-center justify-center gap-3 overflow-hidden border-r border-zinc-200 px-6 py-4 dark:border-[#3f3f46]">
              <div
                className="absolute inset-0 opacity-40 dark:opacity-[0.08]"
                style={stripePattern("#e4e4e7", 1, 9)}
              />
              <div className="relative flex items-center gap-3">
                <LandingBrand compact />
              </div>
            </div>
            <div
              className={cn(
                "flex items-center justify-center px-6 py-4 text-sm leading-[18px] text-zinc-600 dark:text-[#d4d4d8] min-[769px]:text-xl min-[769px]:leading-8",
                monoDisplayClassName
              )}
            >
              {tComparison("others")}
            </div>
          </div>

          {filteredRows.map((row) => (
            <div
              key={row.feature}
              className={cn(
                comparisonTableGridClassName,
                "border-t border-zinc-100 bg-white dark:border-[#27272a] dark:bg-[#111113]"
              )}
            >
              <div className="relative border-r border-zinc-100 px-6 py-6 dark:border-[#27272a]">
                {row.emphasize ? (
                  <div
                    className="absolute inset-0 opacity-30 dark:opacity-[0.06]"
                    style={stripePattern("#f4f4f5", 1, 8)}
                  />
                ) : null}
                <div className="relative flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-4">
                    <span
                      className={cn(
                        "text-base leading-6 text-zinc-950 dark:text-[#fafafa] min-[769px]:text-base min-[769px]:leading-6 font-sans"
                      )}
                    >
                      {row.feature}
                    </span>
                  </div>
                </div>
              </div>
              <div className="relative flex items-center justify-center border-r border-zinc-100 bg-white px-6 py-6 dark:border-[#27272a] dark:bg-[#111113]">
                {row.knowhereStripe ? (
                  <div
                    className="absolute inset-0 opacity-25 dark:opacity-[0.06]"
                    style={stripePattern("#f4f4f5", 1, 8)}
                  />
                ) : null}
                <div className="relative">
                  <ComparisonIndicator
                    label={tComparison(`status.${row.knowhere}`)}
                    status={row.knowhere}
                  />
                </div>
              </div>
              <div className="relative flex items-center justify-center px-6 py-6">
                {row.othersStripe ? (
                  <div
                    className="absolute inset-0 opacity-25 dark:opacity-[0.06]"
                    style={stripePattern("#f4f4f5", 1, 8)}
                  />
                ) : null}
                <div className="relative">
                  <ComparisonIndicator
                    label={tComparison(`status.${row.others}`)}
                    status={row.others}
                  />
                </div>
              </div>
            </div>
          ))}
        </ScrollAreaPrimitive.Viewport>

        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="vertical"
          className="z-30 flex h-full w-2 flex-col touch-none select-none border-l border-zinc-200 bg-zinc-100 dark:border-[#3f3f46] dark:bg-[#18181b]"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-zinc-400 transition-colors hover:bg-zinc-500 active:bg-zinc-600 dark:bg-[#52525b] dark:hover:bg-[#71717a]" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.ScrollAreaScrollbar
          orientation="horizontal"
          className="z-30 flex h-2 flex-col touch-none select-none border-t border-zinc-200 bg-zinc-100 dark:border-[#3f3f46] dark:bg-[#18181b]"
        >
          <ScrollAreaPrimitive.ScrollAreaThumb className="flex-1 rounded-none bg-zinc-400 transition-colors hover:bg-zinc-500 active:bg-zinc-600 dark:bg-[#52525b] dark:hover:bg-[#71717a]" />
        </ScrollAreaPrimitive.ScrollAreaScrollbar>
        <ScrollAreaPrimitive.Corner className="bg-zinc-100 dark:bg-[#18181b]" />
      </ScrollAreaPrimitive.Root>
    </div>
  );
};
