"use client";

import { PixelCard } from "@/app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import type { VersusPageData } from "@/app/_(landing)/_data/versus-pages";

type TechnicalDeepDiveProps = {
  data: NonNullable<VersusPageData["technicalDeepDive"]>;
};

export function TechnicalDeepDive({ data }: TechnicalDeepDiveProps) {
  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" size="lg" className="mb-4">
            {data.title}
          </PixelHeading>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-8">
          {data.sections.map((section) => (
            <PixelCard key={section.id} className="p-8">
              {/* Section heading */}
              <h3 className="text-base font-sans font-bold text-pixel-fg mb-4">
                {section.heading}
              </h3>

              {/* Section content */}
              <p className="text-[var(--pixel-text-muted)] font-sans mb-6 leading-relaxed">
                {section.content}
              </p>

              {/* Code example */}
              {section.codeExample && (
                <div
                  className="border-2 border-pixel-border bg-pixel-bg p-4 overflow-x-auto"
                  style={{ boxShadow: "2px 2px 0 var(--pixel-shadow)" }}
                >
                  <pre className="text-sm text-pixel-fg font-mono">
                    <code>{section.codeExample.code}</code>
                  </pre>
                </div>
              )}
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}
