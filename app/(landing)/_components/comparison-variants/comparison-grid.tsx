"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
import { HTMLShowcaseViewer } from "@/app/(landing)/_components/comparison-variants/html-showcase-viewer";
import { LightboxPatternSelector } from "@/app/(landing)/_components/comparison-variants/lightbox-pattern-selector";
import { LightboxComparison } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/lightbox-comparison";
import { LightboxFullscreen } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/lightbox-fullscreen";
import { LightboxGallery } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/lightbox-gallery";
import type { ComparisonImage } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";
import { useLightboxStore } from "@/store/lightbox-store";

type ComparisonProduct = {
  id: string;
  name: string;
  metrics: {
    processingTime: string;
    accuracy: string;
  };
  resultImage: string;
  isOurProduct: boolean;
};

const products: ComparisonProduct[] = [
  {
    id: "knowhere",
    name: "Knowhere",
    metrics: {
      processingTime: "187ms",
      accuracy: "99.8%",
    },
    resultImage: "/comparison/knowhere.html",
    isOurProduct: true,
  },
  {
    id: "unstructured",
    name: "Unstructured",
    metrics: {
      processingTime: "420ms",
      accuracy: "87.3%",
    },
    resultImage: "/comparison/unstructured.html",
    isOurProduct: false,
  },
  {
    id: "markitdown",
    name: "Markitdown",
    metrics: {
      processingTime: "356ms",
      accuracy: "82.1%",
    },
    resultImage: "/comparison/markitdown.html",
    isOurProduct: false,
  },
];

// Helper function to check if product has HTML showcase
const hasHTMLShowcase = (productId: string) => {
  return ["knowhere", "markitdown", "unstructured"].includes(productId);
};

type ComparisonGridProps = {
  enableAutoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
};

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`w-full h-full bg-muted/50 rounded-lg border border-border/50 flex items-center justify-center ${className || ""}`}
    >
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function ComparisonGrid({
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  className = "",
}: ComparisonGridProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [autoPlayIndex, setAutoPlayIndex] = useState<number | null>(null);

  // Lightbox state - uses Zustand store for cross-component sync
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { pattern: lightboxPattern, setPattern: setLightboxPattern } = useLightboxStore();

  // Prepare image data for lightbox
  const originalImage: ComparisonImage = {
    src: "/placeholder-original.jpg",
    alt: "Original Document",
    label: "Original Input",
    useHTML: false, // Original input uses placeholder image for now
    metrics: {
      description: "Complex table with merged cells",
    },
  };

  const resultImages: ComparisonImage[] = products.map((product) => ({
    src: product.resultImage,
    alt: `${product.name} Output`,
    label: product.name,
    productId: product.id,
    useHTML: hasHTMLShowcase(product.id), // Use HTML for products with showcases
    metrics: {
      processingTime: product.metrics.processingTime,
      accuracy: product.metrics.accuracy,
    },
  }));

  const allImages: ComparisonImage[] = [originalImage, ...resultImages];

  // Handle image click - uses current selected pattern
  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setLightboxOpen(true);
  };

  // Auto-play logic
  useEffect(() => {
    if (!enableAutoPlay) {
      setAutoPlayIndex(null);
      return;
    }

    const timer = setInterval(() => {
      setAutoPlayIndex((prev) => {
        if (prev === null) return 0;
        return (prev + 1) % products.length;
      });
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [enableAutoPlay, autoPlayInterval]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        // Let browser handle tab navigation
        return;
      }
      if (e.key === "Enter" && hoveredIndex !== null) {
        // Future: Open modal
        console.log("Open modal for product:", products[hoveredIndex].name);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [hoveredIndex]);

  // Determine which card should be highlighted
  const activeIndex = hoveredIndex !== null ? hoveredIndex : autoPlayIndex;

  return (
    <section className={`py-16 md:py-24 overflow-x-hidden ${className}`}>
      <div className="container mx-auto px-4 max-w-full">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Compare All{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              At Once
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Hover over any card to see detailed metrics and compare output quality side-by-side.
          </p>
        </motion.div>

        {/* Main Comparison Area */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
          {/* Left: Original Input */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-2/5"
          >
            <div className="sticky top-24">
              <h3 className="text-xl font-semibold mb-4 text-center lg:text-left">
                Original Input
              </h3>
              <motion.div
                whileHover={{ y: -5 }}
                transition={{ duration: 0.3 }}
                className="glass rounded-2xl border border-border/50 p-4 hover:border-primary/50 transition-all cursor-pointer"
                onClick={() => handleImageClick(0)}
              >
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl opacity-50" />
                  <ImagePlaceholder label="Original Document" className="relative aspect-[4/3]" />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Complex table with merged cells
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: 2x2 Grid */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-3/5"
          >
            <h3 className="text-xl font-semibold mb-4 text-center lg:text-left">
              Processed Results
            </h3>

            {/* Grid Container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-full">
              {products.map((product, index) => {
                const isActive = activeIndex === index;
                const shouldDim = activeIndex !== null && !isActive;

                return (
                  <motion.div
                    key={product.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    onFocus={() => setHoveredIndex(index)}
                    onBlur={() => setHoveredIndex(null)}
                    tabIndex={0}
                    className="relative group cursor-pointer"
                    onClick={() => handleImageClick(index + 1)}
                  >
                    <motion.div
                      animate={{
                        scale: isActive ? 1.02 : 1,
                        filter: shouldDim ? "brightness(0.5) blur(4px)" : "brightness(1) blur(0px)",
                      }}
                      transition={{ duration: 0.3 }}
                      className={`relative glass rounded-2xl border overflow-hidden ${
                        isActive
                          ? "border-primary/50 shadow-2xl shadow-primary/30 z-10"
                          : "border-border/50"
                      }`}
                    >
                      {/* Glow effect on active card */}
                      {isActive && (
                        <motion.div
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl -z-10"
                        />
                      )}

                      {/* Result Image */}
                      <div className="relative h-[200px] md:h-[240px] bg-muted/30">
                        {hasHTMLShowcase(product.id) ? (
                          <HTMLShowcaseViewer
                            productId={product.id}
                            onMaximize={() => handleImageClick(index + 1)}
                            className="w-full h-full"
                          />
                        ) : (
                          <ImagePlaceholder label={`${product.name} Output`} />
                        )}

                        {/* Product Name Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
                          <h4 className="text-white font-semibold text-lg">{product.name}</h4>
                        </div>

                        {/* Best Choice Badge */}
                        {product.isOurProduct && (
                          <motion.div
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              ease: "easeInOut",
                            }}
                            className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5"
                          >
                            <Check className="h-3 w-3" />
                            Best Choice
                          </motion.div>
                        )}

                        {/* Hover Indicator */}
                        {!product.isOurProduct && isActive && (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="absolute top-4 right-4 h-3 w-3 rounded-full bg-primary animate-pulse"
                          />
                        )}
                      </div>

                      {/* Metrics - Show on hover/active */}
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{
                          height: isActive ? "auto" : 0,
                          opacity: isActive ? 1 : 0,
                        }}
                        transition={{ duration: 0.3 }}
                        className="overflow-hidden"
                      >
                        <div className="p-4 bg-card/50 border-t border-border/50">
                          <div className="grid grid-cols-2 gap-3">
                            <div className="text-center p-2 rounded-lg bg-muted/50">
                              <div className="text-lg font-bold font-mono text-primary">
                                {product.metrics.processingTime}
                              </div>
                              <div className="text-xs text-muted-foreground">Time</div>
                            </div>
                            <div className="text-center p-2 rounded-lg bg-muted/50">
                              <div className="text-lg font-bold font-mono text-accent">
                                {product.metrics.accuracy}
                              </div>
                              <div className="text-xs text-muted-foreground">Accuracy</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>

                      {/* Subtle initial glow for Knowhere */}
                      {product.isOurProduct && !isActive && (
                        <div className="absolute inset-0 bg-primary/5 pointer-events-none" />
                      )}
                    </motion.div>

                    {/* Focus indicator for accessibility */}
                    {isActive && (
                      <motion.div
                        layoutId="gridFocusRing"
                        className="absolute -inset-1 rounded-2xl border-2 border-primary -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Auto-play indicator */}
            {enableAutoPlay && autoPlayIndex !== null && hoveredIndex === null && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-6">
                <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
                  <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span>
                    Auto-playing ({autoPlayIndex + 1}/{products.length})
                  </span>
                </div>
                <motion.div className="mt-2 h-1 bg-muted-foreground/20 rounded-full overflow-hidden">
                  <motion.div
                    key={autoPlayIndex}
                    className="h-full bg-primary"
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                  />
                </motion.div>
              </motion.div>
            )}

            {/* Control Hints */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Hover over cards to see detailed metrics
                {enableAutoPlay && " • Auto-play active"}
              </p>
            </div>
          </motion.div>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl border border-border/50 p-6">
            <h4 className="text-center font-semibold mb-4">Why Choose Knowhere?</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold font-mono text-primary mb-1">2.25x</div>
                <div className="text-xs text-muted-foreground">Faster Than Average</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20">
                <div className="text-2xl font-bold font-mono text-accent mb-1">+14.7%</div>
                <div className="text-xs text-muted-foreground">Higher Accuracy</div>
              </div>
              <div className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20">
                <div className="text-2xl font-bold font-mono text-primary mb-1">99.8%</div>
                <div className="text-xs text-muted-foreground">Quality Score</div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Lightbox Components */}
      <LightboxFullscreen
        images={allImages}
        initialIndex={selectedImageIndex}
        isOpen={lightboxOpen && lightboxPattern === "fullscreen"}
        onClose={() => setLightboxOpen(false)}
      />
      <LightboxComparison
        originalImage={originalImage}
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
