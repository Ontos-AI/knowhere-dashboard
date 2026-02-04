"use client";

import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useEffect, useState } from "react";
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
    resultImage: "/placeholder-knowhere.jpg",
    isOurProduct: true,
  },
  {
    id: "unstructured",
    name: "Unstructured",
    metrics: {
      processingTime: "420ms",
      accuracy: "87.3%",
    },
    resultImage: "/placeholder-unstructured.jpg",
    isOurProduct: false,
  },
  {
    id: "markitdown",
    name: "Markitdown",
    metrics: {
      processingTime: "356ms",
      accuracy: "82.1%",
    },
    resultImage: "/placeholder-markitdown.jpg",
    isOurProduct: false,
  },
  {
    id: "mineru",
    name: "MinerU",
    metrics: {
      processingTime: "298ms",
      accuracy: "85.6%",
    },
    resultImage: "/placeholder-mineru.jpg",
    isOurProduct: false,
  },
];

type ComparisonCoverflowProps = {
  enableAutoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
};

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`w-full aspect-[4/3] bg-muted/50 rounded-lg border border-border/50 flex items-center justify-center ${className || ""}`}
    >
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function ComparisonCoverflow({
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  className = "",
}: ComparisonCoverflowProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Lightbox state - uses Zustand store for cross-component sync
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const { pattern: lightboxPattern, setPattern: setLightboxPattern } = useLightboxStore();

  // Prepare image data for lightbox
  const originalImage: ComparisonImage = {
    src: "/placeholder-original.jpg",
    alt: "Original Document",
    label: "Original Input",
    metrics: {
      description: "Complex table with merged cells",
    },
  };

  const resultImages: ComparisonImage[] = products.map((product) => ({
    src: product.resultImage,
    alt: `${product.name} Output`,
    label: product.name,
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
    if (!enableAutoPlay || isPaused) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [enableAutoPlay, autoPlayInterval, isPaused]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % products.length);
      } else if (e.key === "Home") {
        setActiveIndex(0);
      } else if (e.key === "End") {
        setActiveIndex(products.length - 1);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  // Calculate card position and style based on distance from center
  const getCardStyle = (index: number) => {
    const distance = index - activeIndex;
    const absDistance = Math.abs(distance);

    if (absDistance > 1) {
      // Hidden cards (off-screen)
      return {
        x: distance > 0 ? "120%" : "-120%",
        scale: 0.6,
        rotateY: distance > 0 ? 45 : -45,
        opacity: 0,
        zIndex: 0,
        filter: "blur(8px)",
      };
    }

    if (distance === 0) {
      // Center card (active)
      return {
        x: "0%",
        scale: 1,
        rotateY: 0,
        opacity: 1,
        zIndex: 10,
        filter: "blur(0px)",
      };
    }

    // Side cards (adjacent)
    return {
      x: distance > 0 ? "60%" : "-60%",
      scale: 0.75,
      rotateY: distance > 0 ? 35 : -35,
      opacity: 0.7,
      zIndex: 5,
      filter: "blur(2px)",
    };
  };

  return (
    <section className={`py-16 md:py-24 ${className}`}>
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Quality Showcase{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              in Action
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Drag or click to explore output quality from different document parsers.
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
                  <ImagePlaceholder label="Original Document" className="relative" />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Complex table with merged cells
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Coverflow Carousel */}
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

            {/* Coverflow Container */}
            <section
              aria-label="Product comparison carousel"
              className="relative h-[400px] md:h-[500px] overflow-hidden perspective-1200"
              onMouseEnter={() => enableAutoPlay && setIsPaused(true)}
              onMouseLeave={() => enableAutoPlay && setIsPaused(false)}
            >
              {products.map((product, index) => {
                const style = getCardStyle(index);
                const isActive = index === activeIndex;

                return (
                  <motion.div
                    key={product.id}
                    className="absolute top-1/2 left-1/2 w-[85%] max-w-[380px] cursor-pointer"
                    style={{
                      originX: 0.5,
                      originY: 0.5,
                    }}
                    initial={false}
                    animate={{
                      x: `calc(-50% + ${style.x})`,
                      y: "-50%",
                      scale: style.scale,
                      rotateY: style.rotateY,
                      opacity: style.opacity,
                      zIndex: style.zIndex,
                      filter: style.filter,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 350,
                      damping: 30,
                    }}
                    onClick={() => {
                      if (isActive) {
                        handleImageClick(index + 1);
                      } else {
                        handleCardClick(index);
                      }
                    }}
                    whileHover={
                      isActive
                        ? { scale: style.scale * 1.02, y: "-52%" }
                        : { scale: style.scale * 1.05 }
                    }
                  >
                    <div
                      className={`h-full glass rounded-2xl border overflow-hidden ${
                        isActive
                          ? "border-primary/50 shadow-2xl shadow-primary/30"
                          : "border-border/50"
                      }`}
                    >
                      {/* Center card glow */}
                      {isActive && (
                        <motion.div
                          animate={{ opacity: [0.3, 0.5, 0.3] }}
                          transition={{
                            duration: 3,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                          }}
                          className="absolute inset-0 bg-gradient-to-br from-primary/30 to-accent/30 blur-2xl -z-10"
                        />
                      )}

                      {/* Result Image */}
                      <div className="relative h-[240px] md:h-[300px] bg-muted/30">
                        <ImagePlaceholder label={`${product.name} Output`} />

                        {/* Product Name Badge */}
                        <div className="absolute top-4 left-4 glass rounded-lg px-3 py-1.5 border border-border/50">
                          <span className="text-sm font-semibold">{product.name}</span>
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
                      </div>

                      {/* Metrics Section */}
                      <div className="p-6">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-card/50 border border-border/50">
                            <div className="text-xl md:text-2xl font-bold font-mono text-primary mb-1">
                              {product.metrics.processingTime}
                            </div>
                            <div className="text-xs text-muted-foreground">Processing Time</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-card/50 border border-border/50">
                            <div className="text-xl md:text-2xl font-bold font-mono text-accent mb-1">
                              {product.metrics.accuracy}
                            </div>
                            <div className="text-xs text-muted-foreground">Accuracy</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </section>

            {/* Product Indicators */}
            <div className="flex items-center justify-center gap-3 mt-8">
              {products.map((product, index) => (
                <motion.button
                  key={product.id}
                  onClick={() => setActiveIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative h-2 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`View ${product.name} results`}
                >
                  {index === activeIndex && (
                    <motion.div
                      layoutId="activeIndicatorCoverflow"
                      className="absolute inset-0 rounded-full bg-primary shadow-lg shadow-primary/50"
                    />
                  )}
                </motion.button>
              ))}
            </div>

            {/* Auto-play Progress Bar */}
            {enableAutoPlay && !isPaused && (
              <motion.div
                className="mt-4 h-1 bg-muted-foreground/20 rounded-full overflow-hidden"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <motion.div
                  key={activeIndex}
                  className="h-full bg-primary"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: autoPlayInterval / 1000, ease: "linear" }}
                />
              </motion.div>
            )}

            {/* Control Hints */}
            <div className="mt-6 text-center">
              <p className="text-xs text-muted-foreground">
                Use{" "}
                <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                  ←
                </kbd>{" "}
                <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                  →
                </kbd>{" "}
                to navigate or click side cards
                {enableAutoPlay && (
                  <>
                    {" "}
                    or{" "}
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                      Space
                    </kbd>{" "}
                    to {isPaused ? "resume" : "pause"}
                  </>
                )}
              </p>
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

      {/* CSS for 3D perspective */}
      <style jsx>{`
        .perspective-1200 {
          perspective: 1200px;
          transform-style: preserve-3d;
        }
      `}</style>
    </section>
  );
}
