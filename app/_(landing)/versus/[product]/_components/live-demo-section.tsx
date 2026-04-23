"use client";

import { useEffect, useRef, useState } from "react";
import { PixelButton } from "@/app/_(landing)/_components/pixel/pixel-button";
import { PixelHeading } from "@/app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import type { LiveDemoConfig } from "@/app/_(landing)/_data/versus-pages";
import {
  type DemoContent,
  DemoDetailModal,
} from "@/app/_(landing)/versus/[product]/_components/demo-detail-modal";
import { usePreloadHtml } from "@/app/_(landing)/versus/[product]/_hooks/use-preload-html";

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
              <div className="flex items-end gap-1 mx-auto mb-2 w-fit">
                <div className="w-2 h-2 bg-pixel-fg animate-bounce [animation-delay:-0.3s]" />
                <div className="w-2 h-2 bg-pixel-fg animate-bounce [animation-delay:-0.15s]" />
                <div className="w-2 h-2 bg-pixel-fg animate-bounce" />
              </div>
              <p className="text-sm text-[var(--pixel-text-muted)] font-sans">Loading...</p>
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
          const isPositive = highlight.startsWith("✅");
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

  // Active demo tab (default: first tab = Text Flow)
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selectedDemo = data.demos[selectedIndex];

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

  // Preload all HTML files across all demos so tab switching feels instant
  const allDemoFiles = shouldLoadDemo
    ? data.demos.flatMap((d) => [
        d.knowhereOutput,
        d.competitorOutput,
        ...(d.originalFile ? [d.originalFile] : []),
      ])
    : [];
  usePreloadHtml(allDemoFiles);

  // Modal handlers
  const handleOpenKnowhereDetails = () => {
    setModalContent({
      title: "Knowhere",
      htmlUrl: selectedDemo.knowhereOutput,
      highlights: selectedDemo.highlights.knowhere,
      isKnowhere: true,
    });
    setIsModalOpen(true);
  };

  const handleOpenCompetitorDetails = () => {
    setModalContent({
      title: competitorName,
      htmlUrl: selectedDemo.competitorOutput,
      highlights: selectedDemo.highlights.competitor,
      isKnowhere: false,
    });
    setIsModalOpen(true);
  };

  const handleOpenOriginalDocument = () => {
    if (!selectedDemo.originalFile) return;
    setModalContent({
      title: "Original Input Document",
      htmlUrl: selectedDemo.originalFile,
      highlights: [],
      isKnowhere: false,
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setModalContent(null), 200);
  };

  return (
    <section className="py-16 md:py-24 bg-pixel-bg">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-8">
          <PixelHeading as="h2" size="lg" className="mb-4">
            SEE THE DIFFERENCE IN ACTION
          </PixelHeading>
          <p className="text-base text-[var(--pixel-text-muted)] font-sans">
            Real parsing results side-by-side — text flow, document structure, and table accuracy
          </p>
        </div>

        {/* Demo type tab switcher */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {data.demos.map((demo, index) => (
            <PixelButton
              key={demo.label}
              variant={selectedIndex === index ? "primary" : "secondary"}
              onClick={() => setSelectedIndex(index)}
            >
              {demo.label.toUpperCase()}
            </PixelButton>
          ))}
        </div>

        {/* Demo container */}
        <div ref={demoRef} className="max-w-7xl mx-auto">
          {/* Desktop & Tablet: Side-by-side iframes (>= 768px) */}
          <div className="hidden md:flex gap-8">
            <IframeView
              key={`desktop-knowhere-${selectedDemo.knowhereOutput}`}
              title="Knowhere"
              src={selectedDemo.knowhereOutput}
              highlights={selectedDemo.highlights.knowhere}
              isKnowhere
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenKnowhereDetails}
            />
            <IframeView
              key={`desktop-competitor-${selectedDemo.competitorOutput}`}
              title={competitorName}
              src={selectedDemo.competitorOutput}
              highlights={selectedDemo.highlights.competitor}
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenCompetitorDetails}
            />
          </div>

          {/* Mobile only: Stacked iframes (< 768px) */}
          <div className="md:hidden space-y-8">
            <IframeView
              key={`mobile-knowhere-${selectedDemo.knowhereOutput}`}
              title="Knowhere"
              src={selectedDemo.knowhereOutput}
              highlights={selectedDemo.highlights.knowhere}
              isKnowhere
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenKnowhereDetails}
            />
            <IframeView
              key={`mobile-competitor-${selectedDemo.competitorOutput}`}
              title={competitorName}
              src={selectedDemo.competitorOutput}
              highlights={selectedDemo.highlights.competitor}
              shouldLoad={shouldLoadDemo}
              onViewDetails={handleOpenCompetitorDetails}
            />
          </div>

          {/* View Original Input button — only for demos with an original file (Table Parsing) */}
          {selectedDemo.originalFile && (
            <div className="mt-8 text-center">
              <PixelButton onClick={handleOpenOriginalDocument} variant="secondary">
                VIEW ORIGINAL INPUT DOCUMENT
              </PixelButton>
            </div>
          )}
        </div>

        {/* Demo Detail Modal */}
        <DemoDetailModal isOpen={isModalOpen} onClose={handleCloseModal} content={modalContent} />
      </div>
    </section>
  );
}
