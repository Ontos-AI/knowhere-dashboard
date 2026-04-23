"use client";

import { useState } from "react";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import type { FeatureRow, VersusPageData } from "@/app/_(landing)/_data/versus-pages";

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
      <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 py-4 border-b-2 border-pixel-border last:border-0">
        {/* Feature name */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium font-sans text-pixel-fg">{feature.feature}</span>
          {feature.tooltip && <span className="text-xs text-[var(--pixel-text-muted)]">ℹ️</span>}
        </div>

        {/* Knowhere status */}
        <div className="flex items-center gap-2">
          <PixelIcon
            icon={feature.knowhere.supported ? "check" : "cross"}
            size={16}
            color={feature.knowhere.supported ? "green" : "red"}
          />
          {feature.knowhere.details && (
            <span className="text-xs font-sans text-[var(--pixel-text-muted)]">
              {feature.knowhere.details}
            </span>
          )}
        </div>

        {/* Competitor status */}
        <div className="flex items-center gap-2">
          <PixelIcon
            icon={feature.competitor.supported ? "check" : "cross"}
            size={16}
            color={feature.competitor.supported ? "green" : "red"}
          />
          {feature.competitor.details && (
            <span className="text-xs font-sans text-[var(--pixel-text-muted)]">
              {feature.competitor.details}
            </span>
          )}
        </div>
      </div>

      {/* Mobile: Card layout */}
      <div className="md:hidden space-y-3 py-4 border-b-2 border-pixel-border last:border-0">
        {/* Feature name */}
        <div className="font-medium font-sans text-pixel-fg flex items-center gap-2">
          {feature.feature}
          {feature.tooltip && <span className="text-xs text-[var(--pixel-text-muted)]">ℹ️</span>}
        </div>

        {/* Comparison */}
        <div className="grid grid-cols-2 gap-4">
          {/* Knowhere */}
          <div className="space-y-1">
            <div className="text-xs font-semibold font-sans text-[var(--pixel-text-muted)]">
              Knowhere
            </div>
            <div className="flex items-start gap-2">
              <PixelIcon
                icon={feature.knowhere.supported ? "check" : "cross"}
                size={16}
                color={feature.knowhere.supported ? "green" : "red"}
                className="mt-0.5"
              />
              {feature.knowhere.details && (
                <span className="text-xs font-sans text-[var(--pixel-text-muted)] leading-relaxed">
                  {feature.knowhere.details}
                </span>
              )}
            </div>
          </div>

          {/* Competitor */}
          <div className="space-y-1">
            <div className="text-xs font-semibold font-sans text-[var(--pixel-text-muted)]">
              {competitorName}
            </div>
            <div className="flex items-start gap-2">
              <PixelIcon
                icon={feature.competitor.supported ? "check" : "cross"}
                size={16}
                color={feature.competitor.supported ? "green" : "red"}
                className="mt-0.5"
              />
              {feature.competitor.details && (
                <span className="text-xs font-sans text-[var(--pixel-text-muted)] leading-relaxed">
                  {feature.competitor.details}
                </span>
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
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" size="lg" className="mb-4">
            {data.title}
          </PixelHeading>
          <p className="text-base text-[var(--pixel-text-muted)] font-sans">{data.subtitle}</p>
        </div>

        {/* Category tabs */}
        <div className="max-w-5xl mx-auto mb-8">
          <div className="flex flex-wrap gap-2 justify-center">
            {data.categories.map((category, index) => (
              <button
                key={category.name}
                type="button"
                onClick={() => setActiveCategory(index)}
                className={`px-4 py-2 border-2 font-pixel text-pixel-xs transition-transform ${
                  activeCategory === index
                    ? "bg-pixel-green text-pixel-bg border-pixel-fg hover:translate-x-[2px] hover:translate-y-[2px]"
                    : "bg-pixel-bg text-pixel-fg border-pixel-border hover:translate-x-[2px] hover:translate-y-[2px]"
                }`}
                style={{
                  boxShadow:
                    activeCategory === index
                      ? "2px 2px 0 var(--pixel-fg)"
                      : "2px 2px 0 var(--pixel-shadow)",
                }}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Feature table */}
        <div className="max-w-5xl mx-auto">
          <div
            className="border-2 border-pixel-border bg-pixel-bg p-6"
            style={{ boxShadow: "4px 4px 0 var(--pixel-shadow)" }}
          >
            {/* Table header - Desktop only */}
            <div className="hidden md:grid grid-cols-[2fr_1fr_1fr] gap-4 pb-4 mb-4 border-b-2 border-pixel-border">
              <div className="text-pixel-xs font-pixel text-pixel-fg">FEATURE</div>
              <div className="text-pixel-xs font-pixel text-pixel-fg">KNOWHERE</div>
              <div className="text-pixel-xs font-pixel text-pixel-fg">
                {competitorName.toUpperCase()}
              </div>
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
