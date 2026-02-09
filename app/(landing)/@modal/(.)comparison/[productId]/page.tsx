"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HTMLShowcaseViewer } from "@/app/(landing)/_components/comparison-variants/html-showcase-viewer";
import {
  isValidProductId,
  type ProductId,
  parseZoomLevel,
} from "@/app/(landing)/_types/comparison";

// Get all comparison data (same as in comparison-tabs.tsx)
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

export default function ComparisonModal() {
  const router = useRouter();
  const params = useParams();
  const searchParams = useSearchParams();
  const [mounted, setMounted] = useState(false);

  const productId = params.productId as string;
  const isValid = isValidProductId(productId);

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Redirect if invalid productId
  useEffect(() => {
    if (!isValid) {
      router.push("/");
    }
  }, [isValid, router]);

  const currentProductId = (isValid ? productId : "knowhere") as ProductId;
  const zoomLevel = parseZoomLevel(searchParams.get("zoom") ?? undefined);

  // Get current product data
  const currentProduct =
    currentProductId === "original"
      ? {
          id: "original",
          name: "Original Input",
          description: "Labor Cost Calculation - Complex table with merged cells",
        }
      : competitorComparisons.find((c) => c.id === currentProductId) || competitorComparisons[0];

  // Close modal - use router.back() for intercepted routes
  const handleClose = useCallback(() => {
    router.back();
  }, [router]);

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Don't render if invalid productId or not mounted
  if (!isValid || !mounted) {
    return null;
  }

  // Use createPortal to render modal outside of LenisProvider
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/90"
        onClick={handleClose}
      >
        {/* Header with title and close button */}
        <header className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-white">{currentProduct.name}</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {/* Main content area */}
        <section className="relative flex flex-1 items-center justify-center overflow-auto px-4 pb-4">
          {/* Content display */}
          <motion.div
            key={currentProductId}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="flex max-h-full max-w-full flex-col items-center w-full"
          >
            <div className="w-full h-[calc(100vh-8rem)] rounded-lg overflow-auto shadow-2xl bg-background">
              <HTMLShowcaseViewer
                productId={currentProductId === "original" ? "original-input" : currentProductId}
                className="w-full h-full min-h-full"
                onMinimize={handleClose}
                defaultZoom={zoomLevel}
              />
            </div>
            <div className="mt-4 text-center">
              <h3 className="text-xl font-semibold text-white">{currentProduct.name}</h3>
              {currentProduct.description && (
                <p className="mt-2 text-sm text-white/70">{currentProduct.description}</p>
              )}
              {currentProductId !== "original" && "metrics" in currentProduct && (
                <div className="mt-2 flex gap-4 text-sm text-white/70 justify-center">
                  {currentProduct.metrics.map((metric) => (
                    <span key={metric.id}>
                      {metric.label}: {metric.value}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </section>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
