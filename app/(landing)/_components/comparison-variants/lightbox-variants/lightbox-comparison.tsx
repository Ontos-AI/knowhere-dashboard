"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { HTMLShowcaseViewer } from "@/app/(landing)/_components/comparison-variants/html-showcase-viewer";
import type { ComparisonLightboxProps } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";

export const LightboxComparison = ({
  originalImage,
  resultImages,
  initialResultIndex,
  isOpen,
  onClose,
}: ComparisonLightboxProps) => {
  const [currentResultIndex, setCurrentResultIndex] = useState(initialResultIndex);
  const [direction, setDirection] = useState(0);

  // Reset index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentResultIndex(initialResultIndex);
    }
  }, [isOpen, initialResultIndex]);

  // Navigate to next result
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentResultIndex((prev) => (prev + 1) % resultImages.length);
  }, [resultImages.length]);

  // Navigate to previous result
  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentResultIndex((prev) => (prev - 1 + resultImages.length) % resultImages.length);
  }, [resultImages.length]);

  // Keyboard event handler
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        goToPrevious();
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        goToNext();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrevious]);

  // Prevent body scroll when lightbox is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentResult = resultImages[currentResultIndex];

  // Slide animation variants for result image
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 500 : -500,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 500 : -500,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Header with close button */}
          <div className="absolute left-0 right-0 top-0 z-50 flex items-center justify-between p-4">
            <div className="text-lg font-semibold text-white">Before / After Comparison</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Position indicator */}
          <div className="absolute left-1/2 top-20 z-50 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
            Result {currentResultIndex + 1} / {resultImages.length}
          </div>

          {/* Main comparison container */}
          <button
            type="button"
            className="flex h-full w-full items-center justify-center gap-4 p-24 overflow-auto"
            onClick={(e) => e.stopPropagation()}
            aria-label="Comparison display area"
          >
            {/* Left side - Original Image (fixed) */}
            <div className="flex h-full w-1/2 flex-col items-center justify-center">
              <div className="relative flex max-h-full max-w-full flex-col items-center w-full">
                <div className="mb-2 rounded-full bg-blue-500/20 px-3 py-1 text-sm font-medium text-blue-300">
                  Before
                </div>
                {originalImage.useHTML && originalImage.productId ? (
                  <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-auto shadow-2xl bg-background">
                    <HTMLShowcaseViewer
                      productId={originalImage.productId}
                      className="w-full h-full min-h-full"
                      onMinimize={onClose}
                    />
                  </div>
                ) : (
                  <Image
                    src={originalImage.src}
                    alt={originalImage.alt}
                    width={800}
                    height={600}
                    className="max-h-[calc(100vh-16rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                  />
                )}
                <div className="mt-4 text-center">
                  <h3 className="text-lg font-semibold text-white">{originalImage.label}</h3>
                  {originalImage.metrics && (
                    <div className="mt-2 flex flex-col gap-1 text-sm text-white/70">
                      {Object.entries(originalImage.metrics).map(
                        ([key, value]) =>
                          value && (
                            <span key={key}>
                              {key}: {value}
                            </span>
                          )
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="h-3/4 w-px bg-white/20" />

            {/* Right side - Result Image (animated) */}
            <div className="relative flex h-full w-1/2 flex-col items-center justify-center overflow-hidden">
              <AnimatePresence initial={false} custom={direction} mode="wait">
                <motion.div
                  key={currentResultIndex}
                  custom={direction}
                  variants={variants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{
                    x: { type: "spring", stiffness: 300, damping: 30 },
                    opacity: { duration: 0.2 },
                  }}
                  className="flex max-h-full max-w-full flex-col items-center w-full"
                >
                  <div className="mb-2 rounded-full bg-green-500/20 px-3 py-1 text-sm font-medium text-green-300">
                    After
                  </div>
                  {currentResult.useHTML && currentResult.productId ? (
                    <div className="w-full h-[calc(100vh-12rem)] rounded-lg overflow-auto shadow-2xl bg-background">
                      <HTMLShowcaseViewer
                        productId={currentResult.productId}
                        className="w-full h-full min-h-full"
                        onMinimize={onClose}
                      />
                    </div>
                  ) : (
                    <Image
                      src={currentResult.src}
                      alt={currentResult.alt}
                      width={800}
                      height={600}
                      className="max-h-[calc(100vh-16rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                    />
                  )}
                  <div className="mt-4 text-center">
                    <h3 className="text-lg font-semibold text-white">{currentResult.label}</h3>
                    {currentResult.metrics && (
                      <div className="mt-2 flex flex-col gap-1 text-sm text-white/70">
                        {Object.entries(currentResult.metrics).map(
                          ([key, value]) =>
                            value && (
                              <span key={key}>
                                {key}: {value}
                              </span>
                            )
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </button>

          {/* Navigation buttons */}
          {resultImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Previous result"
              >
                <ChevronLeft className="h-8 w-8" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToNext();
                }}
                className="absolute right-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Next result"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
};
