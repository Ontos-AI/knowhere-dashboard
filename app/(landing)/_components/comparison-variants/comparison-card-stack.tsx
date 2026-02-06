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
];

type ComparisonCardStackProps = {
  enableAutoPlay?: boolean;
  autoPlayInterval?: number;
  className?: string;
};

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`w-full aspect-[4/3] bg-muted/50 rounded-lg border border-border/50 flex items-center justify-center ${
        className || ""
      }`}
    >
      <span className="text-muted-foreground font-medium">{label}</span>
    </div>
  );
}

export function ComparisonCardStack({
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  className = "",
}: ComparisonCardStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
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
    if (!enableAutoPlay || isPaused || isAnimating) return;

    const timer = setInterval(() => {
      setActiveIndex((prev) => (prev + 1) % products.length);
    }, autoPlayInterval);

    return () => clearInterval(timer);
  }, [enableAutoPlay, autoPlayInterval, isPaused, isAnimating]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (isAnimating) return;

      if (e.key === "ArrowLeft") {
        setActiveIndex((prev) => (prev - 1 + products.length) % products.length);
      } else if (e.key === "ArrowRight") {
        setActiveIndex((prev) => (prev + 1) % products.length);
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isAnimating]);

  const handleNext = () => {
    if (isAnimating) return;
    setIsAnimating(true);
    setActiveIndex((prev) => (prev + 1) % products.length);
    setTimeout(() => setIsAnimating(false), 600);
  };

  const handleJumpToIndex = (index: number) => {
    if (isAnimating || index === activeIndex) return;
    setIsAnimating(true);
    setActiveIndex(index);
    setTimeout(() => setIsAnimating(false), 600);
  };

  // Calculate card order: active card should be on top
  const getCardOrder = () => {
    const order = [];
    for (let i = 0; i < products.length; i++) {
      const index = (activeIndex + i) % products.length;
      order.push(index);
    }
    return order;
  };

  const cardOrder = getCardOrder();

  return (
    <section className={`py-16 md:py-24 bg-muted/20 ${className}`}>
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
            Visual{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Quality Comparison
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See the difference in output quality. Click cards to compare results from different
            parsers.
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
                  {/* Glow effect */}
                  <div className="absolute inset-0 bg-primary/10 rounded-lg blur-xl opacity-50" />
                  <ImagePlaceholder label="Original Document" className="relative" />
                </div>
                <p className="text-sm text-muted-foreground mt-4 text-center">
                  Complex table with merged cells
                </p>
              </motion.div>
            </div>
          </motion.div>

          {/* Right: Card Stack */}
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

            {/* Card Stack Container */}
            <section
              aria-label="Product comparison card stack"
              className="relative w-full aspect-[4/3] perspective-1000"
              onMouseEnter={() => enableAutoPlay && setIsPaused(true)}
              onMouseLeave={() => enableAutoPlay && setIsPaused(false)}
            >
              {cardOrder.map((productIndex, stackPosition) => {
                const product = products[productIndex];
                const isActive = stackPosition === 0;
                const zIndex = products.length - stackPosition;

                // Calculate offset for stacked effect
                const offsetX = stackPosition * 8;
                const offsetY = stackPosition * 6;
                const rotation = stackPosition * 2 - 2;
                const scale = 1 - stackPosition * 0.03;

                return (
                  <motion.div
                    key={product.id}
                    className="absolute inset-0"
                    style={{ zIndex }}
                    initial={false}
                    animate={{
                      x: offsetX,
                      y: offsetY,
                      rotate: rotation,
                      scale,
                      opacity: stackPosition < 3 ? 1 : 0,
                    }}
                    transition={{
                      type: "spring",
                      stiffness: 300,
                      damping: 25,
                    }}
                    whileHover={isActive ? { scale: scale * 1.02, y: offsetY - 5 } : {}}
                  >
                    <div
                      className={`h-full glass rounded-2xl border overflow-hidden ${
                        isActive
                          ? "border-primary/50 shadow-2xl shadow-primary/20"
                          : "border-border/50"
                      }`}
                    >
                      {/* Card Background Glow */}
                      {isActive && (
                        <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-50 -z-10" />
                      )}

                      {/* Result Image */}
                      <button
                        type="button"
                        tabIndex={isActive ? 0 : -1}
                        className="relative h-[60%] bg-muted/30 cursor-pointer w-full border-0 p-0 text-left"
                        onClick={(e) => {
                          if (isActive) {
                            e.stopPropagation();
                            handleImageClick(productIndex + 1);
                          }
                        }}
                        onKeyDown={(e) => {
                          if (isActive && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            handleImageClick(productIndex + 1);
                          }
                        }}
                        aria-label={`View ${product.name} output in lightbox`}
                      >
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
                      </button>

                      {/* Metrics Section */}
                      <button
                        type="button"
                        tabIndex={isActive ? 0 : -1}
                        className="h-[40%] p-6 flex flex-col justify-center cursor-pointer w-full border-0 text-left"
                        onClick={(e) => {
                          if (isActive) {
                            e.stopPropagation();
                            handleNext();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (isActive && (e.key === "Enter" || e.key === " ")) {
                            e.preventDefault();
                            handleNext();
                          }
                        }}
                        aria-label={`Show next product comparison`}
                      >
                        <div className="grid grid-cols-2 gap-4">
                          <div className="text-center p-3 rounded-lg bg-card/50 border border-border/50">
                            <div className="text-2xl font-bold font-mono text-primary mb-1">
                              {product.metrics.processingTime}
                            </div>
                            <div className="text-xs text-muted-foreground">Processing Time</div>
                          </div>
                          <div className="text-center p-3 rounded-lg bg-card/50 border border-border/50">
                            <div className="text-2xl font-bold font-mono text-accent mb-1">
                              {product.metrics.accuracy}
                            </div>
                            <div className="text-xs text-muted-foreground">Accuracy</div>
                          </div>
                        </div>

                        {/* Click hint for active card */}
                        {isActive && (
                          <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.3 }}
                            className="text-xs text-muted-foreground text-center mt-4"
                          >
                            Click to see next →
                          </motion.p>
                        )}
                      </button>
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
                  onClick={() => handleJumpToIndex(index)}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                  className={`relative h-2 rounded-full transition-all ${
                    index === activeIndex ? "w-8 bg-primary" : "w-2 bg-muted-foreground/30"
                  }`}
                  aria-label={`View ${product.name} results`}
                >
                  {index === activeIndex && (
                    <motion.div
                      layoutId="activeIndicator"
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
                to navigate
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
        .perspective-1000 {
          perspective: 1000px;
        }
      `}</style>
    </section>
  );
}
