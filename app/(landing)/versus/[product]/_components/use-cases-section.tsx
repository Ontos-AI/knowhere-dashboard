"use client";

import * as LucideIcons from "lucide-react";
import type { UseCase, VersusPageData } from "@/app/(landing)/_data/versus-pages";

type UseCasesSectionProps = {
  data: NonNullable<VersusPageData["useCases"]>;
  competitorName: string;
};

// Impact badge colors
const impactBadges = {
  high: "bg-red-500/10 text-red-500 border-red-500/20",
  medium: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
  low: "bg-blue-500/10 text-blue-500 border-blue-500/20",
};

const impactLabels = {
  high: "High Impact",
  medium: "Medium Impact",
  low: "Nice to Have",
};

type UseCaseCardProps = {
  useCase: UseCase;
  competitorName: string;
};

function UseCaseCard({ useCase, competitorName }: UseCaseCardProps) {
  // Get icon component dynamically
  const IconComponent =
    (LucideIcons as Record<string, typeof LucideIcons.FileText>)[useCase.icon] ||
    LucideIcons.FileText;

  return (
    <div className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-6 hover:border-primary/50 hover:bg-card/50 transition-colors">
      <div className="space-y-4">
        {/* Icon and title */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
              <IconComponent className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{useCase.title}</h3>
              <p className="text-sm text-muted-foreground">{useCase.description}</p>
            </div>
          </div>
          <span
            className={`px-2.5 py-1 text-xs font-medium border rounded-full whitespace-nowrap ${impactBadges[useCase.impact]}`}
          >
            {impactLabels[useCase.impact]}
          </span>
        </div>

        {/* Scenario */}
        <div>
          <h4 className="text-sm font-semibold text-foreground mb-2">Scenario</h4>
          <p className="text-sm text-muted-foreground">{useCase.scenario}</p>
        </div>

        {/* Knowhere advantage */}
        <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-green-500 mb-1">Knowhere Advantage</h4>
          <p className="text-sm text-muted-foreground">{useCase.knowhereAdvantage}</p>
        </div>

        {/* Competitor limitation */}
        <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
          <h4 className="text-sm font-semibold text-red-500 mb-1">{competitorName} Limitation</h4>
          <p className="text-sm text-muted-foreground">{useCase.competitorLimitation}</p>
        </div>
      </div>
    </div>
  );
}

export function UseCasesSection({ data, competitorName }: UseCasesSectionProps) {
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
