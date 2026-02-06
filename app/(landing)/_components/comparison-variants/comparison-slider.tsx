"use client";

import { AnimatePresence, motion } from "framer-motion";
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

type ComparisonSliderProps = {
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

export function ComparisonSlider({
  enableAutoPlay = false,
  autoPlayInterval = 3000,
  className = "",
}: ComparisonSliderProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

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

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

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
      if (e.key === "ArrowUp" && !isMobile) {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowDown" && !isMobile) {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(products.length - 1, prev + 1));
      } else if (e.key === "ArrowLeft" && isMobile) {
        e.preventDefault();
        setActiveIndex((prev) => Math.max(0, prev - 1));
      } else if (e.key === "ArrowRight" && isMobile) {
        e.preventDefault();
        setActiveIndex((prev) => Math.min(products.length - 1, prev + 1));
      } else if (e.key >= "1" && e.key <= "4") {
        const index = parseInt(e.key, 10) - 1;
        if (index < products.length) {
          setActiveIndex(index);
        }
      } else if (e.key === " ") {
        e.preventDefault();
        setIsPaused((prev) => !prev);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isMobile]);

  const activeProduct = products[activeIndex];

  // Calculate slider position (0 to 100%)
  const sliderPosition = (activeIndex / (products.length - 1)) * 100;

  return (
    <section className={`py-16 md:py-24 bg-muted/20 overflow-x-hidden ${className}`}>
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
            Explore{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              the Comparison
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Drag the slider to explore output quality from different parsers.
          </p>
        </motion.div>

        {/* Main Comparison Area */}
        <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto overflow-x-hidden">
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

          {/* Right: Result + Slider */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
            className="w-full lg:w-3/5"
          >
            <h3 className="text-xl font-semibold mb-4 text-center lg:text-left">
              Processed Result
            </h3>

            <section
              aria-label="Product comparison slider"
              className="relative max-w-full"
              onMouseEnter={() => enableAutoPlay && setIsPaused(true)}
              onMouseLeave={() => enableAutoPlay && setIsPaused(false)}
            >
              {/* Result Display */}
              <div className="relative glass rounded-2xl border border-primary/50 overflow-hidden max-w-full">
                {/* Active product glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-accent/20 blur-2xl opacity-30 -z-10" />

                {/* Result Image with AnimatePresence for cross-fade */}
                <button
                  type="button"
                  className="relative h-[280px] md:h-[350px] bg-muted/30 cursor-pointer w-full"
                  onClick={() => handleImageClick(activeIndex + 1)}
                  aria-label={`View ${activeProduct.name} result image`}
                >
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={activeProduct.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.35, ease: "easeInOut" }}
                      className="absolute inset-0"
                    >
                      <ImagePlaceholder label={`${activeProduct.name} Output`} />
                    </motion.div>
                  </AnimatePresence>

                  {/* Product Name Badge */}
                  <motion.div
                    key={`badge-${activeProduct.id}`}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="absolute top-4 left-4 glass rounded-lg px-3 py-1.5 border border-border/50"
                  >
                    <span className="text-sm font-semibold">{activeProduct.name}</span>
                  </motion.div>

                  {/* Best Choice Badge */}
                  {activeProduct.isOurProduct && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: [1, 1.05, 1] }}
                      transition={{
                        opacity: { delay: 0.2 },
                        scale: {
                          duration: 2,
                          repeat: Number.POSITIVE_INFINITY,
                          ease: "easeInOut",
                        },
                      }}
                      className="absolute top-4 right-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg px-3 py-1.5 text-xs font-bold shadow-lg flex items-center gap-1.5"
                    >
                      <Check className="h-3 w-3" />
                      Best Choice
                    </motion.div>
                  )}
                </button>

                {/* Metrics Section */}
                <div className="p-6">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`metrics-${activeProduct.id}`}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="grid grid-cols-2 gap-4"
                    >
                      <div className="text-center p-3 rounded-lg bg-card/50 border border-border/50">
                        <div className="text-2xl font-bold font-mono text-primary mb-1">
                          {activeProduct.metrics.processingTime}
                        </div>
                        <div className="text-xs text-muted-foreground">Processing Time</div>
                      </div>
                      <div className="text-center p-3 rounded-lg bg-card/50 border border-border/50">
                        <div className="text-2xl font-bold font-mono text-accent mb-1">
                          {activeProduct.metrics.accuracy}
                        </div>
                        <div className="text-xs text-muted-foreground">Accuracy</div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>

              {/* Slider - Vertical for Desktop, Horizontal for Mobile */}
              {!isMobile ? (
                // Desktop: Vertical Slider on Right
                <div className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center lg:-translate-x-6">
                  <div className="relative h-[calc(100%-80px)] w-2 bg-muted/30 rounded-full">
                    {/* Slider Track */}
                    <motion.div
                      className="absolute top-0 left-0 w-full bg-primary/30 rounded-full"
                      style={{ height: `${sliderPosition}%` }}
                    />

                    {/* Product Segments */}
                    {products.map((product, index) => {
                      const segmentY = (index / (products.length - 1)) * 100;
                      const isActive = index === activeIndex;

                      return (
                        <motion.button
                          key={product.id}
                          onClick={() => setActiveIndex(index)}
                          className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2 group"
                          style={{ top: `${segmentY}%` }}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          {/* Segment Dot */}
                          <motion.div
                            animate={{
                              scale: isActive ? 1.3 : 1,
                              backgroundColor: isActive
                                ? "hsl(var(--primary))"
                                : "hsl(var(--muted-foreground) / 0.3)",
                            }}
                            className="w-3 h-3 rounded-full border-2 border-background shadow-lg"
                          />

                          {/* Label */}
                          <motion.span
                            initial={{ opacity: 0, x: -10 }}
                            animate={{
                              opacity: isActive ? 1 : 0.5,
                              x: 0,
                              scale: isActive ? 1.05 : 1,
                            }}
                            className={`text-xs font-medium whitespace-nowrap px-2 py-1 rounded ${
                              isActive ? "bg-primary/20 text-primary" : "text-muted-foreground"
                            }`}
                          >
                            {product.name}
                          </motion.span>
                        </motion.button>
                      );
                    })}

                    {/* Draggable Handle */}
                    <motion.div
                      drag="y"
                      dragConstraints={{ top: 0, bottom: 0 }}
                      dragElastic={0}
                      dragMomentum={false}
                      onDrag={(_, info) => {
                        const parent = (info.point.y / window.innerHeight) * 100;
                        const segmentHeight = 100 / (products.length - 1);
                        const nearestIndex = Math.round(parent / segmentHeight);
                        const clampedIndex = Math.max(
                          0,
                          Math.min(products.length - 1, nearestIndex)
                        );
                        if (clampedIndex !== activeIndex) {
                          setActiveIndex(clampedIndex);
                        }
                      }}
                      animate={{ top: `${sliderPosition}%` }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute left-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing border-2 border-background"
                      whileHover={{ scale: 1.2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                    </motion.div>
                  </div>
                </div>
              ) : (
                // Mobile: Horizontal Slider Below
                <div className="mt-6">
                  <div className="relative h-2 bg-muted/30 rounded-full">
                    {/* Slider Track */}
                    <motion.div
                      className="absolute left-0 top-0 h-full bg-primary/30 rounded-full"
                      style={{ width: `${sliderPosition}%` }}
                    />

                    {/* Product Segments */}
                    {products.map((product, index) => {
                      const segmentX = (index / (products.length - 1)) * 100;
                      const isActive = index === activeIndex;

                      return (
                        <motion.button
                          key={product.id}
                          onClick={() => setActiveIndex(index)}
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: `${segmentX}%` }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <motion.div
                            animate={{
                              scale: isActive ? 1.3 : 1,
                              backgroundColor: isActive
                                ? "hsl(var(--primary))"
                                : "hsl(var(--muted-foreground) / 0.3)",
                            }}
                            className="w-3 h-3 rounded-full border-2 border-background shadow-lg"
                          />
                        </motion.button>
                      );
                    })}

                    {/* Draggable Handle */}
                    <motion.div
                      drag="x"
                      dragConstraints={{ left: 0, right: 0 }}
                      dragElastic={0}
                      dragMomentum={false}
                      animate={{ left: `${sliderPosition}%` }}
                      transition={{ type: "spring", stiffness: 400, damping: 28 }}
                      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6 bg-primary rounded-full shadow-lg cursor-grab active:cursor-grabbing border-2 border-background"
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="absolute inset-0 rounded-full bg-primary animate-ping opacity-50" />
                    </motion.div>
                  </div>

                  {/* Product Labels Below Slider */}
                  <div className="flex justify-between mt-3">
                    {products.map((product, index) => (
                      <motion.span
                        key={product.id}
                        animate={{
                          scale: index === activeIndex ? 1.05 : 1,
                          color:
                            index === activeIndex
                              ? "hsl(var(--primary))"
                              : "hsl(var(--muted-foreground))",
                        }}
                        className="text-xs font-medium"
                      >
                        {product.name}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </section>

            {/* Auto-play Progress Bar */}
            {enableAutoPlay && !isPaused && (
              <motion.div
                className="mt-6 h-1 bg-muted-foreground/20 rounded-full overflow-hidden"
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
                {isMobile ? (
                  <>
                    Use{" "}
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                      ←
                    </kbd>{" "}
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                      →
                    </kbd>{" "}
                    or drag the slider
                  </>
                ) : (
                  <>
                    Use{" "}
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                      ↑
                    </kbd>{" "}
                    <kbd className="px-2 py-0.5 rounded bg-muted border border-border text-xs mx-1">
                      ↓
                    </kbd>{" "}
                    or drag the slider
                  </>
                )}
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
    </section>
  );
}
