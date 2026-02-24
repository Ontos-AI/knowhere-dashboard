"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { PixelDivider } from "./pixel/pixel-divider";
import { PixelHeading } from "./pixel/pixel-heading";
import { PixelIcon } from "./pixel/pixel-icon";

type ComparisonData = {
  category: string;
  feature: string;
  competitor: "good" | "poor" | "missing";
  knowhere: "excellent" | "good";
  description?: string;
};

const comparisonData: ComparisonData[] = [
  {
    category: "Structures",
    feature: "Hierarchy construction",
    competitor: "poor",
    knowhere: "excellent",
    description:
      "Automatically recognize and construct hierarchical data structures, such as multi-level section titles and multi-index headers",
  },
  {
    category: "Tables",
    feature: "Complex merged cells",
    competitor: "poor",
    knowhere: "excellent",
    description: "Accurately handle multi-level merged cells in both doc files and tables",
  },
  {
    category: "Tables",
    feature: "Table boundary detection",
    competitor: "missing",
    knowhere: "excellent",
    description: "Automatically separate tables in one table sheet based on boundary detection",
  },
  {
    category: "Interpretability",
    feature: "Source traceability",
    competitor: "poor",
    knowhere: "excellent",
    description:
      "Trace each information piece to its original section in the raw source with clear boundary",
  },
  {
    category: "Downstream Improvement",
    feature: "Hierarchical memory & progressive disclosure",
    competitor: "missing",
    knowhere: "excellent",
    description: "Naturally supports hierarchical memory and progressive disclosure",
  },
  {
    category: "Downstream Improvement",
    feature: "Vectorless RAG & hybrid RAG",
    competitor: "missing",
    knowhere: "excellent",
    description: "Naturally enables vectorless RAG and hybrid RAG",
  },
  {
    category: "Downstream Improvement",
    feature: "Top-K boost ~10%+ in production",
    competitor: "missing",
    knowhere: "excellent",
    description:
      "Boost Top-K by ~10%+ in production data when applying RAG pipelines to parsed data",
  },
  {
    category: "Downstream Improvement",
    feature: "50%+ token savings on graphs",
    competitor: "missing",
    knowhere: "excellent",
    description: "Save 50%+ tokens when developing graphs",
  },
];

const tabs = ["All", "Structures", "Tables", "Interpretability", "Downstream"];

export const ProductComparison = () => {
  const [activeTab, setActiveTab] = useState(0);

  const filteredData =
    activeTab === 0
      ? comparisonData
      : comparisonData.filter((item) => {
          if (activeTab === 1) return item.category === "Structures";
          if (activeTab === 2) return item.category === "Tables";
          if (activeTab === 3) return item.category === "Interpretability";
          if (activeTab === 4) return item.category === "Downstream Improvement";
          return true;
        });

  return (
    <section id="comparison" className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="flex items-center justify-center gap-2 mb-4">
            <PixelIcon icon="arrow-down" size={16} className="text-pixel-fg" />
            <PixelHeading as="h2" size="md" className="uppercase">
              How We Compare
            </PixelHeading>
          </div>
          <PixelDivider variant="dashed" className="mb-6 max-w-md mx-auto" />
          <p className="font-sans text-lg text-pixel-muted">
            Real-world comparisons showing why developers choose Knowhere API
          </p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(index)}
              className={cn(
                "font-pixel text-pixel-xs px-4 py-2 border-2 transition-none",
                activeTab === index
                  ? "bg-pixel-green text-pixel-bg border-pixel-fg shadow-[2px_2px_0_var(--pixel-fg)]"
                  : "bg-pixel-bg text-pixel-fg border-pixel-border hover:border-pixel-fg"
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Comparison Table */}
        <div className="max-w-4xl mx-auto">
          <div className="pixel-border bg-pixel-bg">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-4 md:p-6 bg-pixel-border/20 border-b-2 border-pixel-border">
              <div className="font-pixel text-pixel-xs text-pixel-muted">Feature</div>
              <div className="font-pixel text-pixel-xs text-pixel-muted text-center">Others</div>
              <div className="font-pixel text-pixel-xs text-pixel-green text-center">Knowhere</div>
            </div>

            {/* Table Body */}
            <div>
              {filteredData.map((item, index) => (
                <div
                  key={`${item.feature}-${index}`}
                  className={cn(
                    "grid grid-cols-3 gap-4 p-4 md:p-6 hover:bg-pixel-border/10 transition-colors",
                    index !== filteredData.length - 1 && "border-b-2 border-pixel-border/50"
                  )}
                >
                  {/* Feature Name */}
                  <div>
                    <div className="font-sans text-sm font-medium text-pixel-fg mb-1">
                      {item.feature}
                    </div>
                    {item.description && (
                      <div className="font-sans text-xs text-pixel-muted hidden md:block">
                        {item.description}
                      </div>
                    )}
                  </div>

                  {/* Competitor Status */}
                  <div className="flex items-center justify-center">
                    {item.competitor === "good" && (
                      <div className="flex items-center gap-2 text-pixel-muted">
                        <PixelIcon icon="check" size={16} />
                        <span className="font-pixel text-pixel-xs hidden sm:inline">OK</span>
                      </div>
                    )}
                    {(item.competitor === "poor" || item.competitor === "missing") && (
                      <div className="flex items-center gap-2 text-pixel-red">
                        <PixelIcon icon="cross" size={16} />
                        <span className="font-pixel text-pixel-xs hidden sm:inline">
                          {item.competitor === "missing" ? "NO" : "BAD"}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Knowhere Status */}
                  <div className="flex items-center justify-center">
                    <div className="flex items-center gap-2 text-pixel-green">
                      <PixelIcon icon="check" size={16} />
                      <span className="font-pixel text-pixel-xs font-medium hidden sm:inline">
                        YES
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-pixel-border/20 border-t-2 border-pixel-border">
              <div className="pixel-border p-4 bg-pixel-bg text-center">
                <div className="font-pixel text-pixel-md text-pixel-green mb-1">&gt;10%</div>
                <div className="font-sans text-xs text-pixel-muted">
                  Searching accuracy improvement in complex production data
                </div>
              </div>
              <div className="pixel-border p-4 bg-pixel-bg text-center">
                <div className="font-pixel text-pixel-md text-pixel-green mb-1">100%</div>
                <div className="font-sans text-xs text-pixel-muted">Traceability</div>
              </div>
              <div className="pixel-border p-4 bg-pixel-bg text-center">
                <div className="font-pixel text-pixel-md text-pixel-green mb-1">50%+</div>
                <div className="font-sans text-xs text-pixel-muted">
                  Token saving when developing knowledge graphs
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
