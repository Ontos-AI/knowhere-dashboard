"use client";

import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";

type Capability = {
  icon: "grid" | "sparkles" | "book" | "atom" | "zap" | "shield" | "code" | "globe";
  title: string;
  description: string;
  color: "green" | "yellow";
};

const capabilities: Capability[] = [
  {
    icon: "grid",
    title: "Agentic-Native Structure",
    description:
      "Progressive disclosure and hierarchical memory natively designed for agentic engineering workflows",
    color: "green",
  },
  {
    icon: "sparkles",
    title: "Complexity-Aware Routing",
    description:
      "Automatically sense document complexity and route each file to the right parsing pipeline to minimize cost, improve efficiency, and preserve extraction quality",
    color: "yellow",
  },
  {
    icon: "book",
    title: "Multi-format Support",
    description:
      "Process 20+ major file formats: PDF, DOCX, XLSX, PPT, HTML, Images, and more with unified API",
    color: "green",
  },
  {
    icon: "zap",
    title: "Full Provenance Tracing",
    description:
      "100% source traceability for every extracted element, making it easy to audit and verify AI-generated content",
    color: "yellow",
  },
  {
    icon: "shield",
    title: "On-premise Deployment",
    description:
      "Supports local deployment for enterprise long-tail needs: conflict detection, compliance auditing, risk identification, and more",
    color: "green",
  },
  {
    icon: "code",
    title: "API First Design",
    description:
      "RESTful API with webhooks, comprehensive SDKs for all major languages, and detailed documentation",
    color: "yellow",
  },
];

export function EnhancedCapabilities() {
  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 md:mb-16">
          <PixelHeading as="h2" className="mb-4">
            BUILT FOR EVERY <span className="text-pixel-green">DOCUMENT CHALLENGE</span>
          </PixelHeading>
          <p className="text-base text-pixel-muted font-sans">
            Enterprise-grade features designed to handle the most complex document parsing scenarios
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability) => (
            <PixelCard
              key={capability.title}
              className="group hover:translate-x-[2px] hover:translate-y-[2px] transition-transform"
            >
              <div className="p-6">
                {/* Icon */}
                {/* <div className='mb-4'>
                  <PixelIcon icon={capability.icon} color={capability.color} size={32} />
                </div> */}

                {/* Content */}
                <h3 className="text-base font-pixel mb-3 leading-relaxed text-[var(--pixel-text-muted)] transition-colors">
                  {capability.title}
                </h3>
                <p className="text-sm text-pixel-muted font-sans leading-relaxed">
                  {capability.description}
                </p>
              </div>
            </PixelCard>
          ))}
        </div>
      </div>
    </section>
  );
}
