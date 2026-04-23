"use client";

import { PixelButton } from "@/app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import type { VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type CTASectionProps = {
  data: VersusPageData["cta"];
};

export function CTASection({ data }: CTASectionProps) {
  return (
    <section className="py-16 md:py-24 bg-pixel-bg border-y-2 border-pixel-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <PixelCard className="border-4 border-pixel-green">
            <div className="p-8 md:p-12 text-center">
              <PixelHeading as="h2" size="lg" className="mb-4">
                {data.title}
              </PixelHeading>

              <p className="text-base text-[var(--pixel-text-muted)] font-sans mb-8 max-w-2xl mx-auto">
                {data.subtitle}
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <PixelButton variant="primary" asChild>
                  <a href={data.primaryButton.href}>{data.primaryButton.text}</a>
                </PixelButton>

                <PixelButton variant="secondary" asChild>
                  <a href={data.secondaryButton.href} target="_blank" rel="noopener noreferrer">
                    {data.secondaryButton.text}
                  </a>
                </PixelButton>
              </div>

              {/* Trust Badges */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-[var(--pixel-text-muted)] font-sans">
                {data.trustBadges.map((badge) => (
                  <div key={badge} className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-pixel-green pixel-border-sm" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  );
}
