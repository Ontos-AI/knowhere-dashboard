"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HTMLShowcaseViewer } from "@/app/(landing)/_components/comparison-variants/html-showcase-viewer";
import type { ComparisonImage } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";
import {
  PRODUCT_INDEX_MAP,
  type ProductId,
  parseZoomLevel,
} from "@/app/(landing)/_types/comparison";

// Get all comparison data
const competitorComparisons = [
  {
    id: "knowhere",
    name: "Knowhere",
    resultImage: "/comparison/knowhere.html",
    isOurProduct: true,
    metrics: [
      { id: "processing-time", label: "Processing Time", value: "187ms", improvement: "" },
      { id: "accuracy", label: "Accuracy", value: "99.8%", improvement: "" },
      { id: "table-support", label: "Table Support", value: "Excellent", improvement: "" },
    ],
    description:
      "Knowhere - A professional document parsing engine that provides high accuracy and high-performance parsing services",
  },
  {
    id: "unstructured",
    name: "Unstructured",
    resultImage: "/comparison/unstructured.html",
    metrics: [
      { id: "processing-time", label: "Processing Time", value: "420ms", improvement: "" },
      { id: "accuracy", label: "Accuracy", value: "87.3%", improvement: "" },
      { id: "table-support", label: "Table Support", value: "Fair", improvement: "" },
    ],
    description: "Unstructured - An open-source document processing tool",
  },
  {
    id: "markitdown",
    name: "Markitdown",
    resultImage: "/comparison/markitdown.html",
    metrics: [
      { id: "processing-time", label: "Processing Time", value: "356ms", improvement: "" },
      { id: "accuracy", label: "Accuracy", value: "82.1%", improvement: "" },
      { id: "markdown-quality", label: "Markdown Quality", value: "Medium", improvement: "" },
    ],
    description: "Markitdown - Markdown conversion tool",
  },
];

const originalInput = "/comparison/original-input.html";

const hasHTMLShowcase = (productId: string) => {
  return ["knowhere", "markitdown", "unstructured"].includes(productId);
};

type ComparisonPageClientProps = {
  productId: ProductId;
};

export function ComparisonPageClient({ productId }: ComparisonPageClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const currentProductId = productId;
  const zoomLevel = parseZoomLevel(searchParams.get("zoom") ?? undefined);

  // Get current comparison data
  const currentComparison =
    currentProductId === "original"
      ? null
      : competitorComparisons.find((c) => c.id === currentProductId);

  // Prepare image data for display
  const originalImageData: ComparisonImage = {
    src: originalInput,
    alt: "Original Document",
    label: "Original Input",
    productId: "original-input",
    useHTML: true,
    metrics: {},
  };

  const resultImages: ComparisonImage[] = competitorComparisons.map((comparison) => {
    const processingTime = comparison.metrics.find((m) => m.id === "processing-time")?.value;
    const accuracy = comparison.metrics.find((m) => m.id === "accuracy")?.value;
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
      productId: comparison.id,
      useHTML: hasHTMLShowcase(comparison.id),
      metrics: {
        processingTime,
        accuracy,
        ...otherMetrics,
      },
    };
  });

  const allImages: ComparisonImage[] = [originalImageData, ...resultImages];
  const currentIndex = PRODUCT_INDEX_MAP[currentProductId];
  const currentImage = allImages[currentIndex];

  // Navigate to specific product (for "Other Comparisons" section)
  const goToProduct = useCallback(
    (targetProductId: string) => {
      // Use router.push to ensure full page navigation instead of modal
      router.push(`/comparison/${targetProductId}`);
    },
    [router]
  );

  // Fullscreen modal handlers
  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header with navigation */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="relative h-16 flex items-center px-4">
            {/* Logo - positioned on the left */}
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-opacity hover:opacity-80"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Knowhere API
              </span>
            </Link>
          </div>
        </header>

        {/* Title - centered to viewport */}
        <h1 className="text-2xl font-semibold absolute left-1/2 -translate-x-1/2">
          {currentImage.label}
        </h1>

        {/* Main content area */}
        <main className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main image area - left side (2/3 width) */}
            <div className="lg:col-span-2">
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                {currentImage.useHTML && currentImage.productId ? (
                  <div className="w-full h-[calc(100vh-16rem)] rounded-lg overflow-auto shadow-2xl">
                    <HTMLShowcaseViewer
                      productId={currentImage.productId}
                      className="w-full h-full min-h-full"
                      defaultZoom={zoomLevel}
                      onMaximize={openFullscreen}
                    />
                  </div>
                ) : (
                  <Image
                    src={currentImage.src}
                    alt={currentImage.alt}
                    width={1600}
                    height={1200}
                    className="w-full h-auto rounded-lg object-contain"
                    priority
                  />
                )}
              </div>
            </div>

            {/* Info sidebar - right side (1/3 width) */}
            <div className="lg:col-span-1 space-y-6">
              {/* Product info card */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h2 className="text-2xl font-bold mb-4">{currentImage.label}</h2>

                {/* Description */}
                {currentProductId === "original" ? (
                  <p className="text-sm text-muted-foreground mb-6">
                    Labor Cost Calculation - Complex table with merged cells. This is the original
                    Excel document converted to HTML format.
                  </p>
                ) : (
                  currentComparison && (
                    <p className="text-sm text-muted-foreground mb-6">
                      {currentComparison.description}
                    </p>
                  )
                )}

                {/* Metrics */}
                {currentImage.metrics && Object.keys(currentImage.metrics).length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-sm font-semibold text-muted-foreground uppercase">
                      Performance Metrics
                    </h3>
                    {Object.entries(currentImage.metrics).map(
                      ([key, value]) =>
                        value && (
                          <div
                            key={key}
                            className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                          >
                            <span className="text-sm text-muted-foreground">{key}</span>
                            <span className="text-lg font-semibold">{value}</span>
                          </div>
                        )
                    )}
                  </div>
                )}
              </div>

              {/* Other products navigation */}
              <div className="rounded-2xl border border-border/50 bg-card p-6">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase mb-4">
                  Other Comparisons
                </h3>
                <div className="space-y-2">
                  {allImages.map((image, index) => {
                    const imageProductId =
                      image.productId === "original-input" ? "original" : image.productId;
                    const isActive = index === currentIndex;
                    return (
                      <button
                        type="button"
                        key={image.src}
                        onClick={() => !isActive && imageProductId && goToProduct(imageProductId)}
                        disabled={isActive}
                        className={`block w-full p-3 rounded-lg transition-colors text-left ${
                          isActive
                            ? "bg-primary text-primary-foreground cursor-default"
                            : "bg-muted/50 hover:bg-muted cursor-pointer"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{image.label}</span>
                          {isActive && (
                            <span className="text-xs bg-primary-foreground/20 px-2 py-1 rounded">
                              Current
                            </span>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Fullscreen Modal */}
      {mounted &&
        isFullscreen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col bg-black/90"
              onClick={closeFullscreen}
            >
              {/* Header with title and close button */}
              <header className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold text-white">{currentImage.label}</h2>
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  aria-label="Close fullscreen"
                >
                  <X className="h-6 w-6" />
                </button>
              </header>

              {/* Main content area */}
              <section className="relative flex flex-1 items-center justify-center overflow-auto px-4 pb-4">
                {/* Content display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex max-h-full max-w-full flex-col items-center w-full"
                >
                  <div className="w-full h-[calc(100vh-8rem)] rounded-lg overflow-auto shadow-2xl bg-background">
                    <HTMLShowcaseViewer
                      productId={currentImage.productId || "knowhere"}
                      className="w-full h-full min-h-full"
                      onMinimize={closeFullscreen}
                      defaultZoom={zoomLevel}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-white">{currentImage.label}</h3>
                    {currentProductId === "original" ? (
                      <p className="mt-2 text-sm text-white/70">
                        Labor Cost Calculation - Complex table with merged cells
                      </p>
                    ) : (
                      currentComparison && (
                        <>
                          <p className="mt-2 text-sm text-white/70">
                            {currentComparison.description}
                          </p>
                          <div className="mt-2 flex gap-4 text-sm text-white/70 justify-center">
                            {currentComparison.metrics.map((metric) => (
                              <span key={metric.id}>
                                {metric.label}: {metric.value}
                              </span>
                            ))}
                          </div>
                        </>
                      )
                    )}
                  </div>
                </motion.div>
              </section>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
