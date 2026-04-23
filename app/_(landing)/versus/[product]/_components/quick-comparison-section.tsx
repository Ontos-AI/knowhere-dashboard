"use client";

import { PixelBadge } from "@/app/_(landing)/_components/pixel/pixel-badge";
import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import type { ComparisonCard, VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type QuickComparisonSectionProps = {
  data: VersusPageData["quickComparison"];
  competitorName: string;
};

// Status icon mapping
const statusIconMap = {
  supported: "check" as const,
  partial: "minus" as const,
  "not-supported": "cross" as const,
};

// Status color mapping
const statusColorMap = {
  supported: "green" as const,
  partial: "yellow" as const,
  "not-supported": "red" as const,
};

// Importance labels
const importanceLabels = {
  high: "CRITICAL",
  medium: "IMPORTANT",
  low: "NICE TO HAVE",
};

type ComparisonCardProps = {
  card: ComparisonCard;
  competitorName: string;
};

function ComparisonCardComponent({ card, competitorName }: ComparisonCardProps) {
  return (
    <PixelCard className="p-6 hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
      {/* Card title with importance badge */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <h3 className="font-sans text-sm font-semibold text-pixel-fg flex-1">{card.title}</h3>
        <PixelBadge
          color={
            card.importance === "high" ? "red" : card.importance === "medium" ? "yellow" : "green"
          }
        >
          {importanceLabels[card.importance]}
        </PixelBadge>
      </div>

      {/* Knowhere status */}
      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2">
          <PixelIcon
            icon={statusIconMap[card.knowhere.status]}
            size={16}
            color={statusColorMap[card.knowhere.status]}
          />
          <span className="font-sans text-sm font-medium text-pixel-fg">Knowhere</span>
          {card.knowhere.value && (
            <span className="ml-auto font-mono text-sm font-bold text-pixel-green">
              {card.knowhere.value}
            </span>
          )}
        </div>
        <p className="font-sans text-sm text-[var(--pixel-text-muted)] pl-6">
          {card.knowhere.description}
        </p>
      </div>

      {/* Competitor status */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <PixelIcon
            icon={statusIconMap[card.competitor.status]}
            size={16}
            color={statusColorMap[card.competitor.status]}
          />
          <span className="font-sans text-sm font-medium text-pixel-fg">{competitorName}</span>
          {card.competitor.value && (
            <span className="ml-auto font-mono text-sm text-[var(--pixel-text-muted)]">
              {card.competitor.value}
            </span>
          )}
        </div>
        <p className="font-sans text-sm text-[var(--pixel-text-muted)] pl-6">
          {card.competitor.description}
        </p>
      </div>
    </PixelCard>
  );
}

export function QuickComparisonSection({ data, competitorName }: QuickComparisonSectionProps) {
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

        {/* Comparison cards grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-6xl mx-auto">
          {data.cards.map((card) => (
            <ComparisonCardComponent key={card.id} card={card} competitorName={competitorName} />
          ))}
        </div>
      </div>
    </section>
  );
}
