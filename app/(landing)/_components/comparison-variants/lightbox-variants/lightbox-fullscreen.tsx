"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { LightboxProps } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";

export const LightboxFullscreen = ({ images, initialIndex, isOpen, onClose }: LightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [direction, setDirection] = useState(0);

  // Reset index when opened
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex);
    }
  }, [isOpen, initialIndex]);

  // Navigate to next image
  const goToNext = useCallback(() => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % images.length);
  }, [images.length]);

  // Navigate to previous image
  const goToPrevious = useCallback(() => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  }, [images.length]);

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

  const currentImage = images[currentIndex];

  // Slide animation variants
  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
    }),
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
    },
    exit: (direction: number) => ({
      zIndex: 0,
      x: direction < 0 ? 1000 : -1000,
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90"
          onClick={onClose}
        >
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close lightbox"
          >
            <X className="h-6 w-6" />
          </button>

          {/* Position indicator */}
          <div className="absolute left-1/2 top-4 z-50 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-sm text-white backdrop-blur-sm">
            {currentIndex + 1} / {images.length}
          </div>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  goToPrevious();
                }}
                className="absolute left-4 top-1/2 z-50 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                aria-label="Previous image"
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
                aria-label="Next image"
              >
                <ChevronRight className="h-8 w-8" />
              </button>
            </>
          )}

          {/* Image container */}
          <button
            type="button"
            className="relative flex h-full w-full items-center justify-center overflow-hidden p-16"
            onClick={(e) => e.stopPropagation()}
            aria-label="Image display area"
          >
            <AnimatePresence initial={false} custom={direction} mode="wait">
              <motion.div
                key={currentIndex}
                custom={direction}
                variants={variants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{
                  x: { type: "spring", stiffness: 300, damping: 30 },
                  opacity: { duration: 0.2 },
                }}
                className="flex max-h-full max-w-full flex-col items-center"
              >
                {/* Image */}
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={1200}
                  height={900}
                  className="max-h-[calc(100vh-12rem)] w-auto max-w-full rounded-lg object-contain shadow-2xl"
                  loading="lazy"
                />

                {/* Image label and metrics */}
                <div className="mt-4 text-center">
                  <h3 className="text-xl font-semibold text-white">{currentImage.label}</h3>
                  {currentImage.metrics && (
                    <div className="mt-2 flex gap-4 text-sm text-white/70">
                      {Object.entries(currentImage.metrics).map(
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
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
