"use client";

import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";
import { cn } from "@lib/utils";
import Link from "next/link";
import { useState } from "react";
import { competitorProducts } from "@/app/_(landing)/_data/product-advantages";
import type { MetricIcon } from "@/app/_(landing)/_types/comparison";

type ComparisonTabsProps = {
  className?: string;
};

// Metric card component - pixel style
type MetricCardProps = {
  metric: {
    id: string;
    label: string;
    value: string;
    improvement: string;
    icon: MetricIcon;
  };
};

function MetricCard({ metric }: MetricCardProps) {
  return (
    <PixelCard className="flex-1 min-w-0 p-4">
      <div className="flex flex-col items-center text-center gap-3">
        {/* Icon at top */}
        <div className="flex-shrink-0">
          <PixelIcon icon={metric.icon} color="green" size={16} />
        </div>

        {/* Label */}
        <p className="text-xs text-pixel-muted font-sans line-clamp-2">{metric.label}</p>

        {/* Value and improvement */}
        <div className="flex flex-col items-center gap-1">
          <span className="text-2xl font-bold font-mono text-pixel-fg">{metric.value}</span>
          <span className="text-xs text-pixel-muted font-sans">{metric.improvement}</span>
        </div>
      </div>
    </PixelCard>
  );
}

// Main component
export function ComparisonTabs({ className }: ComparisonTabsProps) {
  const [activeTab, setActiveTab] = useState<string>(competitorProducts[0].id);

  const activeComparison = competitorProducts.find((c) => c.id === activeTab);

  return (
    <section
      className={cn(
        "relative w-full py-16 md:py-24 bg-pixel-bg border-y-2 border-pixel-border",
        className
      )}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" className="mb-4">
            WHY CHOOSE <span className="text-pixel-green">KNOWHERE</span>
          </PixelHeading>
          <p className="text-base text-pixel-muted font-sans">
            Knowhere outperforms major competitors in key metrics
          </p>
        </div>

        {/* Centered Comparison Container */}
        <div className="max-w-4xl mx-auto">
          {/* Desktop: Tabs */}
          <div className="hidden md:block">
            {/* Tab Buttons */}
            <div className="flex w-full mb-8 gap-3">
              {competitorProducts.map((comparison) => (
                <button
                  key={comparison.id}
                  type="button"
                  onClick={() => setActiveTab(comparison.id)}
                  className={cn(
                    "flex-1 py-3 font-pixel text-[10px] transition-none border-2 text-base",
                    activeTab === comparison.id
                      ? "bg-pixel-green text-pixel-bg border-pixel-fg shadow-[4px_4px_0_var(--pixel-fg)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--pixel-fg)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
                      : "bg-pixel-bg text-pixel-fg border-pixel-border shadow-[4px_4px_0_var(--pixel-shadow)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0_var(--pixel-shadow)]"
                  )}
                >
                  {comparison.tabLabel}
                </button>
              ))}
            </div>

            {/* Tab content */}
            {activeComparison && (
              <div className="space-y-6">
                {/* Advantage Description Card */}
                <PixelCard className="p-6 space-y-4">
                  {/* Description paragraph */}
                  <p className="text-sm text-pixel-muted font-sans leading-relaxed">
                    {activeComparison.description}
                  </p>

                  {/* Advantages list */}
                  <div className="space-y-3">
                    {activeComparison.advantages.map((advantage) => (
                      <div key={advantage} className="flex items-start gap-3">
                        <div className="flex-shrink-0 mt-1">
                          <PixelIcon icon="check" color="green" size={16} />
                        </div>
                        <p className="text-sm text-pixel-fg font-sans leading-relaxed flex-1">
                          {advantage}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Show More button - aligned to right */}
                  <div className="flex justify-end pt-2">
                    <PixelButton asChild variant="primary" className="px-8">
                      <Link
                        href={`/versus/${activeComparison.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2"
                      >
                        <span>SHOW MORE</span>
                        <PixelIcon icon="external-link" size={16} />
                      </Link>
                    </PixelButton>
                  </div>
                </PixelCard>

                {/* Metrics row */}
                <div className="flex flex-row gap-4 w-full">
                  {activeComparison.metrics.map((metric) => (
                    <MetricCard key={metric.id} metric={metric} />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Mobile: Dropdown */}
          <div className="block md:hidden">
            <div className="space-y-6">
              {/* Dropdown selector */}
              <select
                value={activeTab}
                onChange={(e) => setActiveTab(e.target.value)}
                className="w-full bg-pixel-bg text-pixel-fg font-pixel text-[10px] p-4 border-2 border-pixel-border shadow-[4px_4px_0_var(--pixel-shadow)] appearance-none cursor-pointer"
              >
                {competitorProducts.map((comparison) => (
                  <option key={comparison.id} value={comparison.id}>
                    {comparison.tabLabel}
                  </option>
                ))}
              </select>

              {/* Content */}
              {activeComparison && (
                <div className="space-y-6">
                  {/* Advantage Description Card */}
                  <PixelCard className="p-6 space-y-4">
                    {/* Description paragraph */}
                    <p className="text-sm text-pixel-muted font-sans leading-relaxed">
                      {activeComparison.description}
                    </p>

                    {/* Advantages list */}
                    <div className="space-y-3">
                      {activeComparison.advantages.map((advantage) => (
                        <div key={advantage} className="flex items-start gap-3">
                          <div className="flex-shrink-0 mt-1">
                            <PixelIcon icon="check" color="green" size={16} />
                          </div>
                          <p className="text-sm text-pixel-fg font-sans leading-relaxed flex-1">
                            {advantage}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Show More button - aligned to right */}
                    <div className="flex justify-end pt-2">
                      <PixelButton asChild variant="primary" className="px-6">
                        <Link
                          href={`/versus/${activeComparison.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <span>SHOW MORE</span>
                          <PixelIcon icon="external-link" size={16} />
                        </Link>
                      </PixelButton>
                    </div>
                  </PixelCard>

                  {/* Metrics row */}
                  <div className="flex flex-row gap-3 w-full overflow-x-auto pb-2">
                    {activeComparison.metrics.map((metric) => (
                      <MetricCard key={metric.id} metric={metric} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
