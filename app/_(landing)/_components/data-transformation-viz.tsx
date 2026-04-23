"use client";

import { PixelBadge } from "@app/_(landing)/_components/pixel/pixel-badge";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";

type Stage = {
  icon: "file" | "gauge" | "sparkles" | "chart";
  title: string;
  description: string;
};

const stages: Stage[] = [
  {
    icon: "file",
    title: "Input",
    description: "Upload document (PDF, DOCX, XLSX, etc.)",
  },
  {
    icon: "gauge",
    title: "OCR & Detection",
    description: "Extract text, detect tables, formulas, images",
  },
  {
    icon: "sparkles",
    title: "Structure Analysis",
    description: "Analyze layout, relationships, hierarchies",
  },
  {
    icon: "chart",
    title: "JSON Output",
    description: "Clean, structured data for AI consumption",
  },
];

export function DataTransformationViz() {
  return (
    <section className="py-16 md:py-24 bg-pixel-bg border-y-2 border-pixel-border">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <PixelHeading as="h2" className="mb-4">
            WATCH YOUR DATA <span className="text-pixel-green">TRANSFORM</span>
          </PixelHeading>
          <p className="text-base text-pixel-muted font-sans">
            Our intelligent pipeline processes documents through multiple stages to deliver perfect
            results
          </p>
        </div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Line */}
            <div className="absolute top-1/2 left-0 right-0 pixel-divider-dash -translate-y-1/2 z-0" />

            <div className="grid grid-cols-4 gap-8 relative z-10">
              {stages.map((stage, index) => (
                <div key={stage.title} className="relative">
                  {/* Stage Card */}
                  <PixelCard className="group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform">
                    <div className="p-6">
                      {/* Icon */}
                      {/* <div className='mb-4'>
                        <PixelIcon icon={stage.icon} color='green' size={32} />
                      </div> */}

                      {/* Content */}
                      <h3 className="text-base font-pixel mb-2 leading-relaxed text-[var(--pixel-text-muted)]">
                        {stage.title}
                      </h3>
                      <p className="text-sm text-pixel-muted font-sans leading-relaxed">
                        {stage.description}
                      </p>

                      {/* Stage Number */}
                      <div className="absolute top-4 right-4">
                        <PixelBadge color="green">{index + 1}</PixelBadge>
                      </div>
                    </div>
                  </PixelCard>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Flow */}
        <div className="lg:hidden space-y-6">
          {stages.map((stage, index) => (
            <div key={stage.title} className="relative">
              {/* Connecting Line */}
              {index < stages.length - 1 && (
                <div
                  className="absolute left-8 top-24 w-0.5 h-[calc(100%+1.5rem)] bg-pixel-border"
                  style={{ height: "calc(100% + 1.5rem)" }}
                />
              )}

              <PixelCard>
                <div className="p-6 flex items-start gap-4">
                  {/* Icon */}
                  {/* <div className='flex-shrink-0'>
                    <PixelIcon icon={stage.icon} color='green' size={32} />
                  </div> */}

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-base font-pixel leading-relaxed text-[var(--pixel-text-muted)]">
                        {stage.title}
                      </h3>
                      <PixelBadge color="green">{index + 1}</PixelBadge>
                    </div>
                    <p className="text-sm text-pixel-muted font-sans leading-relaxed">
                      {stage.description}
                    </p>
                  </div>
                </div>
              </PixelCard>
            </div>
          ))}
        </div>

        {/* Stats Summary */}
        <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { label: "Source Traceability", value: "100%" },
            { label: "Formula Accuracy", value: "~95%" },
            { label: "File Formats", value: "20+" },
            { label: "RAG Top-K Boost", value: ">10%" },
          ].map((stat) => (
            <PixelCard
              key={stat.label}
              className="hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
            >
              <div className="text-center p-4">
                <div className="text-2xl font-bold font-mono text-pixel-green mb-1">
                  {stat.value}
                </div>
                <div className="text-xs text-pixel-muted font-sans">{stat.label}</div>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}
