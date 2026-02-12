"use client";

import { PixelCard } from "@app/(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/(landing)/_components/pixel/pixel-heading";

type Capability = {
  icon: "grid" | "sparkles" | "book" | "atom" | "zap" | "shield" | "code" | "globe";
  title: string;
  description: string;
  color: "green" | "yellow";
};

const capabilities: Capability[] = [
  {
    icon: "grid",
    title: "Advanced Table Recognition",
    description:
      "Parse complex tables with rotations, merged cells, and cross-page spans with industry-leading accuracy",
    color: "green",
  },
  {
    icon: "sparkles",
    title: "Precise Formula Recognition",
    description:
      "Extract mathematical formulas and convert to LaTeX/MathML with 99.8% accuracy using SOTA models",
    color: "yellow",
  },
  {
    icon: "book",
    title: "Multi-format Support",
    description:
      "Process 50+ file types: PDF, DOCX, XLSX, PPT, HTML, Images, and more with unified API",
    color: "green",
  },
  {
    icon: "atom",
    title: "Chemical Structure Analysis",
    description:
      "State-of-the-art molecular detection and chemical reaction extraction for scientific documents",
    color: "yellow",
  },
  {
    icon: "zap",
    title: "Real-time Processing",
    description: "Sub-200ms response time for most documents with async processing for large files",
    color: "green",
  },
  {
    icon: "shield",
    title: "Enterprise Security",
    description:
      "SOC2 compliant, zero data retention, end-to-end encryption, and role-based access control",
    color: "yellow",
  },
  {
    icon: "code",
    title: "API First Design",
    description:
      "RESTful API with webhooks, comprehensive SDKs for all major languages, and detailed documentation",
    color: "green",
  },
  {
    icon: "globe",
    title: "Global Infrastructure",
    description:
      "Multi-region deployment on AWS and Aliyun for <50ms latency worldwide with 99.9% uptime SLA",
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
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
