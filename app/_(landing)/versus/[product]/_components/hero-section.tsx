"use client";

import { PixelButton } from "@/app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import type { VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type HeroSectionProps = {
  data: VersusPageData["hero"];
  cta: VersusPageData["cta"];
};

export function HeroSection({ data, cta }: HeroSectionProps) {
  const highlightMetrics =
    data.highlightMetrics ?? (data.highlightMetric ? [data.highlightMetric] : []);

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center bg-pixel-bg">
      {/* Optional subtle grid background */}
      <div className="absolute inset-0 pixel-grid-bg pointer-events-none" />

      <div className="container mx-auto px-4 relative z-10 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          {/* Title */}
          <PixelHeading as="h1" size="xl" className="text-pixel-fg">
            {data.title}
          </PixelHeading>

          {/* Subtitle */}
          <p className="text-base text-[var(--pixel-text-muted)] font-sans max-w-2xl mx-auto">
            {data.subtitle}
          </p>

          {/* Highlight Metrics */}
          {highlightMetrics.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
              {highlightMetrics.map((metric) => (
                <PixelCard
                  key={`${metric.value}-${metric.label}`}
                  className="border-4 border-pixel-green"
                >
                  <div className="p-6 text-center">
                    <div className="text-4xl font-bold font-pixel text-pixel-green mb-2">
                      {metric.value}
                    </div>
                    <div className="text-sm font-sans text-[var(--pixel-text-muted)]">
                      {metric.label}
                    </div>
                  </div>
                </PixelCard>
              ))}
            </div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <PixelButton variant="primary" asChild>
              <a href={cta.primaryButton.href}>{cta.primaryButton.text}</a>
            </PixelButton>

            <PixelButton variant="secondary" asChild>
              <a href={cta.secondaryButton.href} target="_blank" rel="noopener noreferrer">
                {cta.secondaryButton.text}
              </a>
            </PixelButton>
          </div>
        </div>
      </div>
    </section>
  );
}
