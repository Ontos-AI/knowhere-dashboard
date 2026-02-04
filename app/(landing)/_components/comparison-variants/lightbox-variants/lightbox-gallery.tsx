"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import type { LightboxProps } from "@/app/(landing)/_components/comparison-variants/lightbox-variants/types";

export const LightboxGallery = ({ images, initialIndex, isOpen, onClose }: LightboxProps) => {
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

  // Navigate to specific image
  const goToIndex = useCallback(
    (index: number) => {
      if (index === currentIndex) return;
      setDirection(index > currentIndex ? 1 : -1);
      setCurrentIndex(index);
    },
    [currentIndex]
  );

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
          className="fixed inset-0 z-50 flex flex-col bg-black/90"
          onClick={onClose}
        >
          {/* Header with close button */}
          <div className="flex items-center justify-between p-4">
            <div className="text-lg font-semibold text-white">Gallery View</div>
            <button
              type="button"
              onClick={onClose}
              className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
              aria-label="Close lightbox"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {/* Main image area - div to avoid button nesting (prev/next are buttons) */}
          <div className="relative flex flex-1 items-center justify-center overflow-hidden px-16 pb-4">
            {/* Navigation buttons */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    goToPrevious();
                  }}
                  className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
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
                  className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20"
                  aria-label="Next image"
                >
                  <ChevronRight className="h-8 w-8" />
                </button>
              </>
            )}

            {/* Image display with animation */}
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
                <Image
                  src={currentImage.src}
                  alt={currentImage.alt}
                  width={1200}
                  height={900}
                  className="max-h-full w-auto max-w-full rounded-lg object-contain shadow-2xl"
                  loading="lazy"
                />
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
          </div>

          {/* Thumbnail strip */}
          <nav
            aria-label="Image thumbnails"
            className="border-t border-white/10 bg-black/50 p-4 backdrop-blur-sm"
          >
            <div className="mx-auto flex max-w-4xl justify-center gap-4">
              {images.map((image) => (
                <button
                  type="button"
                  key={image.src}
                  onClick={(e) => {
                    e.stopPropagation();
                    goToIndex(images.indexOf(image));
                  }}
                  className={`group relative overflow-hidden rounded-lg transition-all ${
                    images.indexOf(image) === currentIndex
                      ? "ring-2 ring-blue-500 ring-offset-2 ring-offset-black"
                      : "opacity-60 hover:opacity-100"
                  }`}
                  aria-label={`View ${image.label}`}
                >
                  <Image
                    src={image.src}
                    alt={image.alt}
                    width={96}
                    height={96}
                    className="h-24 w-24 object-cover"
                  />
                  {images.indexOf(image) === currentIndex && (
                    <div className="absolute inset-0 bg-blue-500/20" />
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-2">
                    <div className="truncate text-xs text-white">{image.label}</div>
                  </div>
                </button>
              ))}
            </div>
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
