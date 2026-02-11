"use client";

import type { VersusPageData } from "@/app/(landing)/_data/versus-pages";

type TechnicalDeepDiveProps = {
  data: NonNullable<VersusPageData["technicalDeepDive"]>;
};

export function TechnicalDeepDive({ data }: TechnicalDeepDiveProps) {
  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            {data.title}
          </h2>
        </div>

        {/* Sections */}
        <div className="max-w-4xl mx-auto space-y-12">
          {data.sections.map((section) => (
            <div
              key={section.id}
              className="rounded-xl border border-border/50 bg-card/30 backdrop-blur-sm p-8"
            >
              {/* Section heading */}
              <h3 className="text-2xl font-bold text-foreground mb-4">{section.heading}</h3>

              {/* Section content */}
              <p className="text-muted-foreground mb-6 leading-relaxed">{section.content}</p>

              {/* Code example */}
              {section.codeExample && (
                <div className="rounded-lg bg-background border border-border/50 p-4 overflow-x-auto">
                  <pre className="text-sm text-foreground font-mono">
                    <code>{section.codeExample.code}</code>
                  </pre>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
