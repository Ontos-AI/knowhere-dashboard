"use client";

import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";
import { cn } from "@lib/utils";

type AdvantageDescriptionProps = {
  description: string;
  advantages: string[];
  className?: string;
};

export function AdvantageDescription({
  description,
  advantages,
  className,
}: AdvantageDescriptionProps) {
  return (
    <PixelCard className={cn("p-6 space-y-4", className)}>
      {/* Description paragraph */}
      <p className="text-sm text-pixel-muted font-sans leading-relaxed">{description}</p>

      {/* Advantages list */}
      <div className="space-y-3">
        {advantages.map((advantage) => (
          <div key={advantage} className="flex items-start gap-3">
            {/* Pixel Check icon */}
            <div className="flex-shrink-0 mt-1">
              <PixelIcon icon="check" color="green" size={16} />
            </div>

            {/* Advantage text */}
            <p className="text-sm text-pixel-fg font-sans leading-relaxed flex-1">{advantage}</p>
          </div>
        ))}
      </div>
    </PixelCard>
  );
}
