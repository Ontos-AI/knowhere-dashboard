"use client";

import { PixelBadge } from "@/app/_(landing)/_components/pixel/pixel-badge";
import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import type { UseCase, VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type UseCasesSectionProps = {
  data: NonNullable<VersusPageData["useCases"]>;
  competitorName: string;
};

const impactLabels = {
  high: "HIGH IMPACT",
  medium: "MEDIUM",
  low: "NICE TO HAVE",
};

// Map lucide icon names to pixel icon names
const iconMap: Record<string, string> = {
  FileText: "file",
  BarChart: "chart",
  Clock: "clock",
  Database: "database",
  Zap: "zap",
  Shield: "shield",
  Code: "code",
  Layers: "layers",
};

type UseCaseCardProps = {
  useCase: UseCase;
  competitorName: string;
};

function UseCaseCard({ useCase, competitorName }: UseCaseCardProps) {
  const pixelIconName = iconMap[useCase.icon] || "file";

  return (
    <PixelCard className="p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
      <div className="space-y-4">
        {/* Icon and title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 border-2 border-pixel-border bg-pixel-bg flex items-center justify-center flex-shrink-0"
              style={{ boxShadow: "2px 2px 0 var(--pixel-shadow)" }}
            >
              <PixelIcon
                icon={pixelIconName as Parameters<typeof PixelIcon>[0]["icon"]}
                className="text-[var(--pixel-text-muted)]"
                size={24}
              />
            </div>
            <div className="flex-1">
              <h3 className="text-sm font-sans font-semibold text-pixel-fg">{useCase.title}</h3>
              <p className="text-xs font-sans text-[var(--pixel-text-muted)]">
                {useCase.description}
              </p>
            </div>
          </div>
          <PixelBadge
            color={
              useCase.impact === "high" ? "red" : useCase.impact === "medium" ? "yellow" : "gray"
            }
          >
            {impactLabels[useCase.impact]}
          </PixelBadge>
        </div>

        {/* Scenario */}
        <div>
          <h4 className="text-xs font-pixel text-pixel-xs text-pixel-fg mb-2">SCENARIO</h4>
          <p className="text-sm font-sans text-[var(--pixel-text-muted)]">{useCase.scenario}</p>
        </div>

        {/* Knowhere advantage */}
        <div
          className="border-2 border-pixel-green bg-pixel-bg p-3"
          style={{ boxShadow: "2px 2px 0 var(--pixel-shadow)" }}
        >
          <h4 className="text-xs font-pixel text-pixel-xs text-pixel-green mb-1">
            KNOWHERE ADVANTAGE
          </h4>
          <p className="text-sm font-sans text-[var(--pixel-text-muted)]">
            {useCase.knowhereAdvantage}
          </p>
        </div>

        {/* Competitor limitation */}
        <div
          className="border-2 border-pixel-red bg-pixel-bg p-3"
          style={{ boxShadow: "2px 2px 0 var(--pixel-shadow)" }}
        >
          <h4 className="text-xs font-pixel text-pixel-xs text-pixel-red mb-1">
            {competitorName.toUpperCase()} LIMITATION
          </h4>
          <p className="text-sm font-sans text-[var(--pixel-text-muted)]">
            {useCase.competitorLimitation}
          </p>
        </div>
      </div>
    </PixelCard>
  );
}

export function UseCasesSection({ data, competitorName }: UseCasesSectionProps) {
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

        {/* Use case cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {data.cases.map((useCase) => (
            <UseCaseCard key={useCase.id} useCase={useCase} competitorName={competitorName} />
          ))}
        </div>
      </div>
    </section>
  );
}
