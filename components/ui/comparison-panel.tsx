import { CheckListItem } from "@components/ui/list-item";
import { cn } from "@lib/utils";
import type { ComponentProps } from "react";

export type ComparisonPanelProps = ComponentProps<"div"> & {
  competitorDescription: string;
  competitorName: string;
  heading: string;
  highlights: string[];
  metricLabel: string;
  metricValue: string;
  subjectName?: string;
};

export const ComparisonPanel = ({
  className,
  competitorDescription,
  competitorName,
  heading,
  highlights,
  metricLabel,
  metricValue,
  subjectName = "Knowhere",
  ...props
}: ComparisonPanelProps) => (
  <div
    className={cn(
      "overflow-hidden border-t border-zinc-100 bg-white lg:grid lg:grid-cols-[minmax(0,1fr)_minmax(320px,638px)]",
      className
    )}
    {...props}
  >
    <div className="flex flex-col justify-center gap-8 px-8 py-10 lg:px-16">
      <p className="text-sm leading-5 text-zinc-500">{competitorDescription}</p>
      <div className="space-y-1">
        {highlights.map((highlight) => (
          <CheckListItem key={highlight} text={highlight} />
        ))}
      </div>
    </div>
    <div className="border-l border-zinc-100 px-8 py-10 lg:px-12 lg:py-12">
      <p className="text-center text-sm font-bold leading-5 text-zinc-950">{heading}</p>
      <div className="relative mt-8 overflow-hidden border border-zinc-700 bg-zinc-600 px-10 py-12 text-center shadow-lg">
        <div className="pointer-events-none absolute inset-0 opacity-40 [background-image:repeating-linear-gradient(125deg,rgba(39,39,42,0.7)_0px,rgba(39,39,42,0.7)_18px,transparent_18px,transparent_54px)]" />
        <div className="relative flex flex-col items-center gap-4">
          <p className="font-mono text-4xl font-semibold leading-10 text-emerald-300">
            {metricValue}
          </p>
          <p className="font-mono text-sm leading-5 text-zinc-400">{metricLabel}</p>
        </div>
      </div>
      <div className="mt-8 flex flex-wrap items-center justify-center gap-6 text-center">
        <div className="text-xl font-semibold text-zinc-950">{subjectName}</div>
        <div className="flex size-10 items-center justify-center rounded-full bg-zinc-100 text-base font-medium text-zinc-400">
          VS
        </div>
        <div className="text-lg leading-7 text-zinc-950">{competitorName}</div>
      </div>
    </div>
  </div>
);
