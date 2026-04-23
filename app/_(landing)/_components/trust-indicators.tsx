"use client";

import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";

type MetricItem = {
  icon: "star" | "database" | "badge" | "cloud" | "security" | "performance";
  value: string;
  label: string;
};

const metrics: MetricItem[] = [
  // TODO: Temporarily hide GitHub-related trust signals until the project is open source.
  // {
  //   icon: "star",
  //   value: "53K+",
  //   label: "GitHub Stars",
  // },
  {
    icon: "database",
    value: "2M+",
    label: "Docs Processed",
  },
  {
    icon: "badge",
    value: "99.8%",
    label: "Accuracy",
  },
  {
    icon: "cloud",
    value: "100+",
    label: "Integrations",
  },
  {
    icon: "security",
    value: "SOC2",
    label: "Certified",
  },
  {
    icon: "performance",
    value: "<200ms",
    label: "Response Time",
  },
];

export const TrustIndicators = () => {
  return (
    <section className="py-8 md:py-12 bg-pixel-bg border-y-2 border-pixel-border">
      <div className="container mx-auto px-4">
        {/* Desktop/Tablet: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-6">
          {metrics.map((metric) => (
            <div key={metric.label} className="group">
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="pixel-border p-3 bg-pixel-bg group-hover:bg-pixel-border/20 transition-colors">
                  <PixelIcon icon={metric.icon} size={32} className="text-pixel-fg" />
                </div>
                <div>
                  <div className="font-pixel text-pixel-sm text-pixel-fg mb-1">{metric.value}</div>
                  <div className="font-sans text-xs text-pixel-muted">{metric.label}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto hide-scrollbar">
          <div className="flex gap-4 pb-2">
            {metrics.map((metric) => (
              <div key={metric.label} className="flex-shrink-0 w-[120px]">
                <div className="pixel-border p-4 bg-pixel-bg">
                  <div className="flex flex-col items-center text-center space-y-2">
                    <PixelIcon icon={metric.icon} size={24} className="text-pixel-fg" />
                    <div>
                      <div className="font-pixel text-pixel-xs text-pixel-fg mb-1">
                        {metric.value}
                      </div>
                      <div className="font-sans text-xs text-pixel-muted">{metric.label}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
