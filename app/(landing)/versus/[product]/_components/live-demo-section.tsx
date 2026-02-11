"use client";

import { Button } from "@components/ui/button";
import { CheckCircle2, ExternalLink, XCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { LiveDemoConfig } from "@/app/(landing)/_data/versus-pages";
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
};

function IframeView({ title, src, highlights, isKnowhere, shouldLoad }: IframeViewProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  return (
    <div className="flex-1 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3
          className={`text-xl font-semibold ${
            isKnowhere
              ? "bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
              : "text-foreground"
          }`}
        >
          {title}
        </h3>
        <Button asChild variant="outline" size="sm" className="gap-2 hover:border-primary/50">
          <a href={src} target="_blank" rel="noopener noreferrer">
            <ExternalLink className="w-4 h-4" />
            Open in New Tab
          </a>
        </Button>
      </div>

      {/* Iframe container */}
      <div className="relative w-full aspect-[4/3] rounded-lg border border-border/50 bg-card/30 overflow-auto">
        {!shouldLoad && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-pulse text-muted-foreground">Preparing demo...</div>
            </div>
          </div>
        )}
        {shouldLoad && isLoading && !hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
              <p className="text-sm text-muted-foreground">Loading demo...</p>
            </div>
          </div>
        )}
        {hasError && (
          <div className="absolute inset-0 z-10 flex items-center justify-center bg-card/80 backdrop-blur-sm">
            <div className="text-center space-y-3">
              <p className="text-sm text-destructive">Failed to load demo</p>
              <Button asChild variant="outline" size="sm">
                <a href={src} target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="w-4 h-4 mr-2" />
                  View in New Tab
                </a>
              </Button>
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
          const Icon = isPositive ? CheckCircle2 : XCircle;
          const colorClass = isPositive ? "text-green-500" : "text-red-500";

          return (
            <div key={highlight} className="flex items-start gap-3">
              <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colorClass}`} />
              <p className="text-sm text-muted-foreground flex-1">
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

  return (
    <section className="relative w-full py-16 md:py-24 overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            See the Difference in Action
          </h2>
          <p className="text-lg text-muted-foreground">Real parsing results side-by-side</p>
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
            />
            <IframeView
              title={competitorName}
              src={data.competitorOutput}
              highlights={data.highlights.competitor}
              shouldLoad={shouldLoadDemo}
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
            />
            <IframeView
              title={competitorName}
              src={data.competitorOutput}
              highlights={data.highlights.competitor}
              shouldLoad={shouldLoadDemo}
            />
          </div>

          {/* View Original Input button */}
          <div className="mt-8 text-center">
            <Button
              asChild
              variant="outline"
              className="gap-2 hover:border-primary/50 hover:bg-card/50"
            >
              <a href={data.originalFile} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="w-4 h-4" />
                View Original Input Document
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
