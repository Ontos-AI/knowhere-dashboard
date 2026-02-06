"use client";

import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, ArrowUp, Check, Zap } from "lucide-react";
import { useState } from "react";
import { LightboxPatternSelector } from "@/app/(landing)/_components/comparison-variants/lightbox-pattern-selector";
import { LightboxComparison } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/lightbox-comparison";
import { LightboxFullscreen } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/lightbox-fullscreen";
import { LightboxGallery } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/lightbox-gallery";
import type { ComparisonImage } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";
import { useLightboxStore } from "@/store/lightbox-store";

// Type definitions
type CompetitorMetric = {
  id: string;
  label: string;
  value: string;
  improvement: string;
  icon: "arrow-up" | "zap" | "check";
};

type CompetitorComparison = {
  id: string;
  name: string;
  tabLabel: string;
  resultImage: string;
  metrics: CompetitorMetric[];
  description?: string;
  isOurProduct?: boolean;
};

type ComparisonTabsProps = {
  className?: string;
};

// Mock comparison data
const competitorComparisons: CompetitorComparison[] = [
  {
    id: "knowhere",
    name: "Knowhere",
    tabLabel: "Knowhere",
    resultImage: "/placeholder-knowhere.jpg",
    isOurProduct: true,
    metrics: [
      {
        id: "processing-time",
        label: "Processing Time",
        value: "187ms",
        improvement: "",
        icon: "zap",
      },
      {
        id: "accuracy",
        label: "Accuracy",
        value: "99.8%",
        improvement: "",
        icon: "check",
      },
      {
        id: "table-support",
        label: "Table Support",
        value: "Excellent",
        improvement: "",
        icon: "check",
      },
    ],
    description:
      "Knowhere - A professional document parsing engine that provides high accuracy and high-performance parsing services",
  },
  {
    id: "unstructured",
    name: "Unstructured",
    tabLabel: "Unstructured",
    resultImage: "/placeholder-unstructured.jpg",
    metrics: [
      {
        id: "processing-time",
        label: "Processing Time",
        value: "420ms",
        improvement: "",
        icon: "zap",
      },
      {
        id: "accuracy",
        label: "Accuracy",
        value: "87.3%",
        improvement: "",
        icon: "check",
      },
      {
        id: "table-support",
        label: "Table Support",
        value: "Fair",
        improvement: "",
        icon: "check",
      },
    ],
    description: "Unstructured - An open-source document processing tool",
  },
  {
    id: "markitdown",
    name: "Markitdown",
    tabLabel: "Markitdown",
    resultImage: "/placeholder-markitdown.jpg",
    metrics: [
      {
        id: "processing-time",
        label: "Processing Time",
        value: "356ms",
        improvement: "",
        icon: "zap",
      },
      {
        id: "accuracy",
        label: "Accuracy",
        value: "82.1%",
        improvement: "",
        icon: "check",
      },
      {
        id: "markdown-quality",
        label: "Markdown Quality",
        value: "Medium",
        improvement: "",
        icon: "check",
      },
    ],
    description: "Markitdown - Markdown conversion tool",
  },
  {
    id: "mineru",
    name: "MinerU",
    tabLabel: "MinerU",
    resultImage: "/placeholder-mineru.jpg",
    metrics: [
      {
        id: "processing-time",
        label: "Processing Time",
        value: "298ms",
        improvement: "",
        icon: "zap",
      },
      {
        id: "accuracy",
        label: "Accuracy",
        value: "85.6%",
        improvement: "",
        icon: "check",
      },
      {
        id: "formula-support",
        label: "Formula Support",
        value: "Good",
        improvement: "",
        icon: "check",
      },
    ],
    description: "MinerU - Academic document processing tool",
  },
];

// Original input image
const originalImage = "/placeholder-original.jpg";

// Icon mapping
const iconMap = {
  "arrow-up": ArrowUp,
  zap: Zap,
  check: Check,
};

// Image placeholder component
function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={cn(
        "w-full aspect-[4/3] bg-muted/50 rounded-lg border border-border/50 flex items-center justify-center",
        className
      )}
    >
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

// Metric card component - compact version for single row display
function MetricCard({ metric, index }: { metric: CompetitorMetric; index: number }) {
  const IconComponent = iconMap[metric.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-3 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 flex-1 min-w-0"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="relative z-10 flex flex-col items-center text-center gap-2">
        {/* Icon at top */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Label */}
        <p className="text-xs text-muted-foreground font-medium line-clamp-2">{metric.label}</p>

        {/* Value and improvement */}
        <div className="flex flex-col items-center">
          {/* Gradient number */}
          <motion.span
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent whitespace-nowrap"
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            {metric.value}
          </motion.span>
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {metric.improvement}
          </span>
        </div>
      </div>

      {/* Number glow effect */}
      <div className="absolute inset-0 opacity-20 blur-xl bg-gradient-to-r from-primary to-accent pointer-events-none" />
    </motion.div>
  );
}

// Main component
export function ComparisonTabs({ className }: ComparisonTabsProps) {
  const [activeTab, setActiveTab] = useState(competitorComparisons[0].id);

  // Lightbox state - uses Zustand store for cross-component sync
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { pattern: lightboxPattern, setPattern: setLightboxPattern } = useLightboxStore();

  const activeComparison = competitorComparisons.find((c) => c.id === activeTab);

  // Prepare image data for lightbox
  const originalImageData: ComparisonImage = {
    src: originalImage,
    alt: "Original Document",
    label: "Original Input",
    metrics: {
      description: "Complex document with tables and formatting",
    },
  };

  const resultImages: ComparisonImage[] = competitorComparisons.map((comparison) => {
    // Find main metrics
    const processingTime = comparison.metrics.find((m) => m.id === "processing-time")?.value;
    const accuracy = comparison.metrics.find((m) => m.id === "accuracy")?.value;

    // Collect other metrics dynamically
    const otherMetrics = comparison.metrics.reduce(
      (acc, metric) => {
        if (metric.id !== "processing-time" && metric.id !== "accuracy") {
          acc[metric.label] = metric.value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    return {
      src: comparison.resultImage,
      alt: `${comparison.name} Output`,
      label: comparison.name,
      metrics: {
        processingTime,
        accuracy,
        ...otherMetrics,
      },
    };
  });

  const allImages: ComparisonImage[] = [originalImageData, ...resultImages];

  // Handle image click - uses current selected pattern
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  const handleShowMore = () => {
    console.log(`Show more details for: ${activeTab}`);
    // TODO: Navigate to /versus/${activeTab} in Phase 2
  };

  return (
    <section
      className={cn("relative w-full py-16 md:py-24 overflow-hidden", "bg-muted/20", className)}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Knowhere
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Knowhere outperforms major competitors in key metrics
          </p>
        </motion.div>

        {/* Main Comparison Area - Left-Right Layout */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left: Original Input Image */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-2/5 lg:mt-[12%]"
          >
            <div>
              <h3 className="text-xl font-semibold mb-4 text-center lg:text-left">
                Original Input
              </h3>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl border border-border/50 p-4 hover:border-primary/50 transition-all group"
              >
                <button
                  type="button"
                  className="relative w-full border-0 p-0 bg-transparent cursor-pointer text-left"
                  onClick={() => handleImageClick(0)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      handleImageClick(0);
                    }
                  }}
                  aria-label="View original document in lightbox"
                >
                  <div className="relative">
                    {/* Glow effect */}
                    <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl opacity-50" />
                    <ImagePlaceholder label="Original Document" className="relative" />
                  </div>
                </button>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Complex document with tables and formatting
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Tabs + Results */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-3/5"
          >
            {/* Header with Show More button */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-semibold text-center lg:text-left">
                Competitor Comparison
              </h3>
              <Button
                onClick={handleShowMore}
                variant="default"
                size="sm"
                className="group relative overflow-hidden bg-gradient-to-r from-primary to-accent hover:shadow-lg hover:shadow-primary/50 transition-all duration-300"
              >
                <span className="relative z-10 flex items-center gap-1 md:gap-2 text-sm md:text-base">
                  <span className="hidden sm:inline">Show More</span>
                  <span className="inline sm:hidden">More</span>
                  <ArrowRight className="w-3 h-3 md:w-4 md:h-4 group-hover:translate-x-1 transition-transform" />
                </span>
                {/* Button glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-accent to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </Button>
            </div>

            {/* Desktop: Tabs */}
            <div className="hidden md:block">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 mb-6 bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
                  {competitorComparisons.map((comparison) => (
                    <TabsTrigger
                      key={comparison.id}
                      value={comparison.id}
                      className="relative data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
                    >
                      {comparison.tabLabel}
                      {/* Active indicator glow */}
                      {activeTab === comparison.id && (
                        <motion.div
                          layoutId="activeTab"
                          className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>

                {/* Tab content */}
                {competitorComparisons.map((comparison) => (
                  <TabsContent key={comparison.id} value={comparison.id} className="mt-0">
                    <AnimatePresence mode="wait">
                      {activeTab === comparison.id && (
                        <motion.div
                          key={comparison.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          transition={{ duration: 0.2 }}
                          className="space-y-6"
                        >
                          {/* Result Image */}
                          <div className="glass rounded-2xl border border-border/50 p-4 group">
                            <button
                              type="button"
                              className="relative w-full border-0 p-0 bg-transparent cursor-pointer text-left"
                              onClick={() => {
                                const comparisonIndex =
                                  competitorComparisons.findIndex((c) => c.id === comparison.id) +
                                  1;
                                handleImageClick(comparisonIndex);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  const comparisonIndex =
                                    competitorComparisons.findIndex((c) => c.id === comparison.id) +
                                    1;
                                  handleImageClick(comparisonIndex);
                                }
                              }}
                              aria-label={`View ${comparison.name} output in lightbox`}
                            >
                              <div className="relative">
                                <div className="absolute inset-0 bg-accent/10 rounded-lg blur-xl opacity-50" />
                                <ImagePlaceholder
                                  label={`${comparison.name} Result`}
                                  className="relative"
                                />
                              </div>
                            </button>
                            {comparison.description && (
                              <p className="text-sm text-muted-foreground mt-4 text-center">
                                {comparison.description}
                              </p>
                            )}
                          </div>

                          {/* Metrics row */}
                          <div className="flex flex-row gap-3 w-full">
                            {comparison.metrics.map((metric, index) => (
                              <MetricCard key={metric.id} metric={metric} index={index} />
                            ))}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </TabsContent>
                ))}
              </Tabs>
            </div>

            {/* Mobile: Dropdown */}
            <div className="block md:hidden">
              <div className="space-y-6">
                {/* Dropdown selector */}
                <Select value={activeTab} onValueChange={setActiveTab}>
                  <SelectTrigger className="w-full bg-card/50 backdrop-blur-sm border-border/50 h-14 text-lg">
                    <SelectValue placeholder="Select Competitor" />
                  </SelectTrigger>
                  <SelectContent
                    className="max-w-[calc(100vw-2rem)]"
                    position="popper"
                    align="start"
                    sideOffset={8}
                  >
                    {competitorComparisons.map((comparison) => (
                      <SelectItem key={comparison.id} value={comparison.id}>
                        {comparison.tabLabel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Content */}
                <AnimatePresence mode="wait">
                  {activeComparison && (
                    <motion.div
                      key={activeTab}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="space-y-6"
                    >
                      {/* Result Image */}
                      <div className="glass rounded-2xl border border-border/50 p-4 group">
                        <button
                          type="button"
                          className="relative w-full border-0 p-0 bg-transparent cursor-pointer text-left"
                          onClick={() => {
                            const comparisonIndex =
                              competitorComparisons.findIndex((c) => c.id === activeComparison.id) +
                              1;
                            handleImageClick(comparisonIndex);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === "Enter" || e.key === " ") {
                              e.preventDefault();
                              const comparisonIndex =
                                competitorComparisons.findIndex(
                                  (c) => c.id === activeComparison.id
                                ) + 1;
                              handleImageClick(comparisonIndex);
                            }
                          }}
                          aria-label={`View ${activeComparison.name} output in lightbox`}
                        >
                          <div className="relative">
                            <div className="absolute inset-0 bg-accent/10 rounded-lg blur-xl opacity-50" />
                            <ImagePlaceholder
                              label={`${activeComparison.name} Result`}
                              className="relative"
                            />
                          </div>
                        </button>
                        {activeComparison.description && (
                          <p className="text-sm text-muted-foreground mt-4 text-center">
                            {activeComparison.description}
                          </p>
                        )}
                      </div>

                      {/* Metrics row */}
                      <div className="flex flex-row gap-3 w-full overflow-x-auto pb-2">
                        {activeComparison.metrics.map((metric, index) => (
                          <MetricCard key={metric.id} metric={metric} index={index} />
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Lightbox Components */}
      <LightboxFullscreen
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen && lightboxPattern === "fullscreen"}
        onClose={() => setLightboxOpen(false)}
      />
      <LightboxComparison
        originalImage={originalImageData}
        resultImages={resultImages}
        initialResultIndex={Math.max(0, selectedImageIndex - 1)}
        isOpen={lightboxOpen && lightboxPattern === "comparison"}
        onClose={() => setLightboxOpen(false)}
      />
      <LightboxGallery
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen && lightboxPattern === "gallery"}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Pattern Selector for testing */}
      <LightboxPatternSelector
        currentPattern={lightboxPattern}
        onPatternChange={setLightboxPattern}
      />
    </section>
  );
}
