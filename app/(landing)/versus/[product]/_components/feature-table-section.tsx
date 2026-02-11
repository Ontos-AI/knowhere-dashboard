"use client";

import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import type { FeatureRow, VersusPageData } from "@/app/(landing)/_data/versus-pages";

type FeatureTableSectionProps = {
  data: NonNullable<VersusPageData["featureTable"]>;
  competitorName: string;
};

type FeatureRowComponentProps = {
  feature: FeatureRow;
  competitorName: string;
};

function FeatureRowComponent({ feature, competitorName }: FeatureRowComponentProps) {
  return (
    <>
      {/* Desktop: Table layout */}
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 py-4 border-b border-border/30 last:border-0">
        {/* Feature name */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">{feature.feature}</span>
          {feature.tooltip && <span className="text-xs text-muted-foreground">ℹ️</span>}
        </div>

        {/* Knowhere status */}
        <div className="flex items-center gap-2">
          {feature.knowhere.supported ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {feature.knowhere.details && (
                <span className="text-xs text-muted-foreground">{feature.knowhere.details}</span>
              )}
            </>
          ) : (
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>

        {/* Competitor status */}
        <div className="flex items-center gap-2">
          {feature.competitor.supported ? (
            <>
              <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
              {feature.competitor.details && (
                <span className="text-xs text-muted-foreground">{feature.competitor.details}</span>
              )}
            </>
          ) : (
            <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
          )}
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-3 py-4 border-b border-border/30 last:border-0">
        {/* Feature name */}
        <div className="font-medium text-foreground flex items-center gap-2">
          {feature.feature}
          {feature.tooltip && <span className="text-xs text-muted-foreground">ℹ️</span>}
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Knowhere */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">Knowhere</div>
            <div className="flex items-start gap-2">
              {feature.knowhere.supported ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {feature.knowhere.details && (
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {feature.knowhere.details}
                    </span>
                  )}
                </>
              ) : (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
          </div>

          {/* Competitor */}
          <div className="space-y-1">
            <div className="text-xs font-semibold text-muted-foreground">{competitorName}</div>
            <div className="flex items-start gap-2">
              {feature.competitor.supported ? (
                <>
                  <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                  {feature.competitor.details && (
                    <span className="text-xs text-muted-foreground leading-relaxed">
                      {feature.competitor.details}
                    </span>
                  )}
                </>
              ) : (
                <XCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export function FeatureTableSection({ data, competitorName }: FeatureTableSectionProps) {
  const [activeCategory, setActiveCategory] = useState(0);

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            {data.title}
          </h2>
          <p className="text-lg text-muted-foreground">{data.subtitle}</p>
        </div>

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {data.categories.map((category, index) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(index)}
                className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                  activeCategory === index
                    ? "bg-primary text-primary-foreground"
                    : "bg-card/50 text-muted-foreground hover:bg-card hover:text-foreground"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Feature table */}
        <div className="max-w-5xl mx-auto">
          <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6">
            {/* Table header - Desktop only */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 pb-4 mb-4 border-b border-border">
              <div className="text-sm font-semibold text-foreground">Feature</div>
              <div className="text-sm font-semibold text-foreground">Knowhere</div>
              <div className="text-sm font-semibold text-foreground">{competitorName}</div>
            </div>

            {/* Feature rows */}
            <div>
              {data.categories[activeCategory].features.map((feature) => (
                <FeatureRowComponent
                  key={feature.id}
                  feature={feature}
                  competitorName={competitorName}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
