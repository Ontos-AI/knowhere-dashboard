"use client";

import { LandingBrand } from "@app/(landing)/_components/landing-brand";
import {
  type ComparisonStatus,
  type ComparisonTab,
  comparisonRows,
  comparisonTabs,
} from "@app/(landing)/_components/landing-home-data";
import { StatefulTab } from "@app/(landing)/_components/stateful-tab";
import { KnowhereIcon } from "@components/ui/knowhere-icon";
import { cn } from "@lib/utils";
import { Plus } from "lucide-react";
import { useState } from "react";

const monoDisplayClassName = "font-[family-name:var(--font-mono-display)]";
const comparisonTableGridClassName =
  "min-w-[720px] grid grid-cols-[1.35fr_0.9fr_0.9fr] min-[769px]:min-w-0";
const comparisonTabTone = {
  selectedBg: "#fd9a00",
  selectedBorder: "#e17100",
  selectedText: "#ffffff",
  enabledBg: "#fee685",
  enabledText: "#461901",
  hoverBg: "#ffd230",
  hoverBorder: "#ffba00",
  activeBg: "#ffba00",
  activeBorder: "#fd9a00",
} as const;

const stripePattern = (color: string, thickness = 1, size = 8) => ({
  backgroundImage: `repeating-linear-gradient(-45deg, transparent 0 ${size - thickness}px, ${color} ${size - thickness}px ${size}px)`,
});

const ComparisonIndicator = ({ status }: { status: ComparisonStatus }) => {
  const map = {
    yes: {
      icon: <KnowhereIcon className="size-4" name="check-2" />,
      label: "Yes",
      color: "#10b981",
    },
    bad: {
      icon: <KnowhereIcon className="size-4" name="component" />,
      label: "Bad",
      color: "#f59e0b",
    },
    no: {
      icon: <KnowhereIcon className="size-4" name="state-x" />,
      label: "No",
      color: "#fb2c36",
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
    <div className="flex flex-col gap-2">
      <div className="overflow-x-auto">
        <div className="flex w-max flex-nowrap gap-px">
          {comparisonTabs.map((tab) => (
            <StatefulTab
              active={activeTab === tab}
              key={tab}
              className={cn(monoDisplayClassName, "focus-visible:ring-[#f97316]")}
              onClick={() => setActiveTab(tab)}
              tone={comparisonTabTone}
              type="button"
            >
              {tab}
            </StatefulTab>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto border border-[#fde68a]">
        <div className={cn(comparisonTableGridClassName, "bg-[#fef3c6]")}>
          <div
            className={cn(
              "flex items-center justify-center border-r border-[#fde68a] px-6 py-4 text-sm leading-[18px] text-[#f97316] min-[769px]:text-xl min-[769px]:leading-8",
              monoDisplayClassName
            )}
          >
            Feature
          </div>
          <div className="relative flex items-center justify-center gap-3 overflow-hidden border-r border-[#fde68a] px-6 py-4">
            <div className="absolute inset-0 opacity-40" style={stripePattern("#fde68a", 1, 9)} />
            <div className="relative flex items-center gap-3">
              <LandingBrand compact />
            </div>
          </div>
          <div
            className={cn(
              "flex items-center justify-center px-6 py-4 text-sm leading-[18px] text-[#f97316] min-[769px]:text-xl min-[769px]:leading-8",
              monoDisplayClassName
            )}
          >
            Others
          </div>
        </div>

        {filteredRows.map((row) => (
          <div
            key={row.feature}
            className={cn(comparisonTableGridClassName, "border-t border-[#fde68a] bg-white")}
          >
            <div className="relative border-r border-[#fde68a] px-6 py-6">
              {row.emphasize ? (
                <div
                  className="absolute inset-0 opacity-30"
                  style={stripePattern("#fde68a", 1, 8)}
                />
              ) : null}
              <div className="relative flex flex-col gap-2">
                <div className="flex items-center justify-between gap-4">
                  <span
                    className={cn(
                      "text-base leading-6 text-[#92400e] min-[769px]:text-[18px] min-[769px]:leading-8 font-sans"
                    )}
                  >
                    {row.feature}
                  </span>
                  {row.callout ? (
                    <span className="text-[#f59e0b]">
                      <Plus className="size-4" />
                    </span>
                  ) : null}
                </div>
                {row.description ? (
                  <p className="max-w-[500px] text-sm leading-5 text-[#b45309]">
                    {row.description}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="relative flex items-center justify-center border-r border-[#fde68a] bg-[#fffbeb] px-6 py-6">
              {row.knowhereStripe ? (
                <div
                  className="absolute inset-0 opacity-25"
                  style={stripePattern("#fde68a", 1, 8)}
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
                  style={stripePattern("#fde68a", 1, 8)}
                />
              ) : null}
              <div className="relative">
                <ComparisonIndicator status={row.others} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
