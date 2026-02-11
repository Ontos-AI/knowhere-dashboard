"use client";

import { AlertCircle, CheckCircle, XCircle } from "lucide-react";
import type { ComparisonCard, VersusPageData } from "@/app/(landing)/_data/versus-pages";

type QuickComparisonSectionProps = {
  data: VersusPageData["quickComparison"];
  competitorName: string;
};

// Status icon mapping
const statusIcons = {
  supported: CheckCircle,
  partial: AlertCircle,
  "not-supported": XCircle,
};

// Status color mapping
const statusColors = {
  supported: "text-green-500",
  partial: "text-yellow-500",
  "not-supported": "text-red-500",
};

// Importance badge colors
const importanceBadges = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

// Importance labels
const importanceLabels = {
  high: "Critical",
  medium: "Important",
  low: "Nice to Have",
};

type ComparisonCardProps = {
  card: ComparisonCard;
  competitorName: string;
};

function ComparisonCardComponent({ card, competitorName }: ComparisonCardProps) {
  const KnowhereIcon = statusIcons[card.knowhere.status];
  const CompetitorIcon = statusIcons[card.competitor.status];

  return (
    <div className="relative overflow-hidden rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 hover:bg-card/50 transition-colors">
      <div className="space-y-4">
        {/* Header with title and importance badge */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-semibold text-foreground flex-1">{card.title}</h3>
          <span
            className={`px-2.5 py-1 text-xs font-medium border rounded-full whitespace-nowrap ${importanceBadges[card.importance]}`}
          >
            {importanceLabels[card.importance]}
          </span>
        </div>

        {/* Knowhere status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <KnowhereIcon
              className={`w-5 h-5 flex-shrink-0 ${statusColors[card.knowhere.status]}`}
            />
            <span className="text-sm font-medium text-foreground">Knowhere</span>
            {card.knowhere.value && (
              <span className="ml-auto text-sm font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
                {card.knowhere.value}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground pl-7">{card.knowhere.description}</p>
        </div>

        {/* Competitor status */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <CompetitorIcon
              className={`w-5 h-5 flex-shrink-0 ${statusColors[card.competitor.status]}`}
            />
            <span className="text-sm font-medium text-foreground">{competitorName}</span>
            {card.competitor.value && (
              <span className="ml-auto text-sm font-semibold text-muted-foreground">
                {card.competitor.value}
              </span>
            )}
          </div>
          <p className="text-sm text-muted-foreground pl-7">{card.competitor.description}</p>
        </div>
      </div>
    </div>
  );
}

export function QuickComparisonSection({ data, competitorName }: QuickComparisonSectionProps) {
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
