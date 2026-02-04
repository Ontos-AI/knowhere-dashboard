"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Grid3x3, Maximize2, Settings, Split, X } from "lucide-react";
import { useState } from "react";
import type { LightboxPattern } from "./lightbox-variants/types";

type PatternInfo = {
  id: LightboxPattern;
  label: string;
  description: string;
  icon: typeof Maximize2;
  pros: string[];
  cons: string[];
};

const patterns: PatternInfo[] = [
  {
    id: "fullscreen",
    label: "Full-Screen Lightbox",
    description: "Classic full-screen image viewer with navigation arrows",
    icon: Maximize2,
    pros: [
      "Simple and intuitive",
      "Maximum image size",
      "Easy navigation between all images",
      "Circular navigation (loop)",
    ],
    cons: ["No direct comparison between images", "Need to switch back and forth to compare"],
  },
  {
    id: "comparison",
    label: "Side-by-Side Comparison",
    description: "View original and processed result side by side",
    icon: Split,
    pros: [
      "Direct before/after comparison",
      "Easy to spot differences",
      "Original always visible",
      "Ideal for quality assessment",
    ],
    cons: ["Smaller image size (split screen)", "Only shows 2 images at once"],
  },
  {
    id: "gallery",
    label: "Gallery View",
    description: "Large preview with thumbnail navigation at bottom",
    icon: Grid3x3,
    pros: [
      "Visual overview of all images",
      "Quick navigation via thumbnails",
      "See current position at a glance",
      "Best for browsing multiple images",
    ],
    cons: ["Takes more screen space", "Thumbnails may be small on mobile"],
  },
];

type LightboxPatternSelectorProps = {
  currentPattern: LightboxPattern;
  onPatternChange: (pattern: LightboxPattern) => void;
  className?: string;
};

export const LightboxPatternSelector = ({
  currentPattern,
  onPatternChange,
  className = "",
}: LightboxPatternSelectorProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating toggle button */}
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`fixed bottom-8 right-8 z-40 rounded-full bg-primary p-4 text-white shadow-2xl hover:bg-primary/90 ${className}`}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Toggle lightbox pattern selector"
      >
        {isOpen ? <X className="h-6 w-6" /> : <Settings className="h-6 w-6" />}
      </motion.button>

      {/* Selector panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm"
              onClick={() => setIsOpen(false)}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed bottom-28 right-8 z-40 w-full max-w-md rounded-2xl border border-border/50 bg-card p-6 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="mb-2 text-xl font-bold">Choose Lightbox Pattern</h3>
              <p className="mb-6 text-sm text-muted-foreground">
                Click on any image to test different viewing patterns. Select your preferred style
                below.
              </p>

              {/* Pattern options */}
              <div className="space-y-4">
                {patterns.map((pattern) => {
                  const Icon = pattern.icon;
                  const isActive = currentPattern === pattern.id;

                  return (
                    <motion.button
                      type="button"
                      key={pattern.id}
                      onClick={() => {
                        onPatternChange(pattern.id);
                        // Keep panel open so user can switch between patterns
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition-all ${
                        isActive
                          ? "border-primary bg-primary/10"
                          : "border-border/50 bg-card hover:border-primary/50 hover:bg-muted/50"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`rounded-lg p-2 ${
                            isActive ? "bg-primary text-white" : "bg-muted text-muted-foreground"
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h4 className="font-semibold">{pattern.label}</h4>
                            {isActive && (
                              <span className="rounded-full bg-primary px-2 py-0.5 text-xs text-white">
                                Active
                              </span>
                            )}
                          </div>
                          <p className="mt-1 text-sm text-muted-foreground">
                            {pattern.description}
                          </p>

                          {/* Pros and cons - show only for active pattern */}
                          {isActive && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              className="mt-3 space-y-2"
                            >
                              <div>
                                <div className="mb-1 text-xs font-semibold text-green-600">
                                  Pros:
                                </div>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                  {pattern.pros.map((pro) => (
                                    <li key={pro} className="flex items-start">
                                      <span className="mr-1">•</span>
                                      <span>{pro}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                              <div>
                                <div className="mb-1 text-xs font-semibold text-orange-600">
                                  Cons:
                                </div>
                                <ul className="space-y-1 text-xs text-muted-foreground">
                                  {pattern.cons.map((con) => (
                                    <li key={con} className="flex items-start">
                                      <span className="mr-1">•</span>
                                      <span>{con}</span>
                                    </li>
                                  ))}
                                </ul>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Instructions */}
              <div className="mt-6 rounded-lg bg-muted/50 p-4">
                <p className="text-sm text-muted-foreground">
                  <strong>How to test:</strong> Click on any image (original or results) to open the
                  lightbox viewer. Try different patterns to see which one you prefer!
                </p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};
