"use client";

import { useEffect, useRef, useState } from "react";
import { PixelButton } from "@/app/(landing)/_components/pixel/pixel-button";
import { PixelHeading } from "@/app/(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/(landing)/_components/pixel/pixel-icon";
import type { LiveDemoConfig } from "@/app/(landing)/_data/versus-pages";
import {
  type DemoContent,
  DemoDetailModal,
} from "@/app/(landing)/versus/[product]/_components/demo-detail-modal";
import { usePreloadHtml } from "@/app/(landing)/versus/[product]/_hooks/use-preload-html";

type LiveDemoSectionProps = {
  data: LiveDemoConfig;
  competitorName: string;
};

type IframeViewProps = {
  title: string;
  src: string;
  highlights: string[];
  isKnowhere?: boolean;
  shouldLoad: boolean;
  onViewDetails: () => void;
};

function IframeView({
  title,
  src,
  highlights,
  isKnowhere,
  shouldLoad,
  onViewDetails,
}: IframeViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className={`font-sans text-base font-semibold ${isKnowhere ? "text-pixel-green" : "text-pixel-fg"}`}
        >
          {title}
        </h3>
        <PixelButton onClick={onViewDetails} variant="secondary">
          VIEW DETAILS
        </PixelButton>
      </div>

      {/* Iframe container */}
      <div className="relative w-full aspect-[4/3] pixel-border bg-pixel-bg overflow-auto">
        {!shouldLoad && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-pixel-bg">
            <div className="text-center">
              <div className="font-sans text-sm text-[var(--pixel-text-muted)]">
                Preparing demo...
              </div>
            </div>
          </div>
        )}
        {shouldLoad && isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-pixel-bg">
            <div className="text-center">
              <div className="w-8 h-8 border-2 border-pixel-fg border-t-transparent animate-spin mx-auto mb-2" />
              <p className="text-sm text-[var(--pixel-text-muted)] font-sans">Loading demo...</p>
            </div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-pixel-bg">
            <div className="text-center space-y-3">
              <p className="text-sm text-pixel-red font-sans">Failed to load demo</p>
              <PixelButton onClick={onViewDetails} variant="secondary">
                VIEW DETAILS
              </PixelButton>
            </div>
          </div>
        )}
        {shouldLoad && (
          <iframe
            src={src}
            title={title}
            className="w-full h-full"
            onLoad={() => setIsLoading(false)}
            onError={() => {
              setIsLoading(false);
              setHasError(true);
            }}
          />
        )}
      </div>

      {/* Highlights */}
      <div className="space-y-2">
        {highlights.map((highlight) => {
          const isPositive =
            highlight.startsWith("✅") ||
            highlight.includes("Perfect") ||
            highlight.includes("Correct");
          const icon = isPositive ? "check" : "cross";
          const color = isPositive ? "green" : "red";

          return (
            <div key={highlight} className="flex items-start gap-3">
              <PixelIcon icon={icon} size={16} color={color} className="flex-shrink-0 mt-0.5" />
              <p className="text-sm text-[var(--pixel-text-muted)] font-sans flex-1">
                {highlight.replace(/^[✅❌]\s*/, "")}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function LiveDemoSection({ data, competitorName }: LiveDemoSectionProps) {
  // Lazy loading state
  const [shouldLoadDemo, setShouldLoadDemo] = useState(false);
  const demoRef = useRef<HTMLDivElement>(null);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<DemoContent | null>(null);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShouldLoadDemo(true);
        }
      },
      { rootMargin: "200px" }
    );

    if (demoRef.current) {
      observer.observe(demoRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // Preload HTML files for better performance (only when demo should load)
  usePreloadHtml(
    shouldLoadDemo ? [data.originalFile, data.knowhereOutput, data.competitorOutput] : []
  );

  // Modal handlers
  const handleOpenKnowhereDetails = () => {
    setModalContent({
      title: "Knowhere",
      htmlUrl: data.knowhereOutput,
      highlights: data.highlights.knowhere,
      isKnowhere: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenCompetitorDetails = () => {
    setModalContent({
      title: competitorName,
      htmlUrl: data.competitorOutput,
      highlights: data.highlights.competitor,
      isKnowhere: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenOriginalDocument = () => {
    setModalContent({
      title: "Original Input Document",
      htmlUrl: data.originalFile,
      highlights: [],
      isKnowhere: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Clear content after animation completes
    setTimeout(() => setModalContent(null), 200);
  };

  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <PixelHeading as="h2" size="lg" className="mb-4">
            SEE THE DIFFERENCE IN ACTION
          </PixelHeading>
          <p className="text-base text-[var(--pixel-text-muted)] font-sans">
            Real parsing results side-by-side
          </p>
        </div>

        {/* Demo container */}
        <div ref={demoRef} className="max-w-7xl mx-auto">
          {/* Desktop & Tablet: Side-by-side iframes (>= 768px) */}
          <div className="hidden md:flex gap-8">
            <IframeView
              title="Knowhere"
              src={data.knowhereOutput}
              highlights={data.highlights.knowhere}
              isKnowhere
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenKnowhereDetails}
            />
            <IframeView
              title={competitorName}
              src={data.competitorOutput}
              highlights={data.highlights.competitor}
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenCompetitorDetails}
            />
          </div>

          {/* Mobile only: Stacked iframes (< 768px) */}
          <div className="md:hidden space-y-8">
            <IframeView
              title="Knowhere"
              src={data.knowhereOutput}
              highlights={data.highlights.knowhere}
              isKnowhere
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenKnowhereDetails}
            />
            <IframeView
              title={competitorName}
              src={data.competitorOutput}
              highlights={data.highlights.competitor}
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenCompetitorDetails}
            />
          </div>

          {/* View Original Input button */}
          <div className="mt-8 text-center">
            <PixelButton onClick={handleOpenOriginalDocument} variant="secondary">
              VIEW ORIGINAL INPUT DOCUMENT
            </PixelButton>
          </div>
        </div>

        {/* Demo Detail Modal */}
        <DemoDetailModal isOpen={isModalOpen} onClose={handleCloseModal} content={modalContent} />
      </div>
    </section>
  );
}
