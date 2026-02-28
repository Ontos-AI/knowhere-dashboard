"use client";

import { Button } from "@components/ui/button";
import { cn } from "@lib/utils";
import { motion } from "framer-motion";
import { Maximize2, Minimize2, Minus, Plus, RotateCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type HTMLShowcaseViewerProps = {
  productId: string; // e.g., "knowhere", "markitdown", "unstructured"
  label?: string;
  className?: string;
  onMaximize?: () => void;
  onMinimize?: () => void; // Callback when in lightbox and user wants to close
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
};

export function HTMLShowcaseViewer({
  productId,
  label,
  className,
  onMaximize,
  onMinimize,
  defaultZoom = 100,
  minZoom = 50,
  maxZoom = 200,
}: HTMLShowcaseViewerProps) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState(defaultZoom);
  const [isHovered, setIsHovered] = useState(false);

  // Determine if in lightbox mode (has onMinimize callback)
  const isMaximized = !!onMinimize;

  // HTML showcase source
  const htmlSrc = `/comparison/${productId}.html`;

  // Storage key for scroll position
  const scrollStorageKey = `html-viewer-scroll-${productId}`;

  // Save scroll position to sessionStorage
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const handleScroll = () => {
      const scrollTop = container.scrollTop;
      const scrollLeft = container.scrollLeft;
      sessionStorage.setItem(scrollStorageKey, JSON.stringify({ scrollTop, scrollLeft }));
    };

    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, [scrollStorageKey]);

  // Restore scroll position from sessionStorage
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const savedPosition = sessionStorage.getItem(scrollStorageKey);
    if (savedPosition) {
      try {
        const { scrollTop, scrollLeft } = JSON.parse(savedPosition);
        // Restore scroll position after a short delay to ensure content is loaded
        const timer = setTimeout(() => {
          container.scrollTop = scrollTop;
          container.scrollLeft = scrollLeft;
        }, 100);
        return () => clearTimeout(timer);
      } catch (error) {
        console.error("Failed to restore scroll position:", error);
      }
    }
  }, [scrollStorageKey]);

  // Zoom controls
  const handleZoomIn = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to lightbox close handler
    setZoom((prev) => Math.min(prev + 10, maxZoom));
  };

  const handleZoomOut = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to lightbox close handler
    setZoom((prev) => Math.max(prev - 10, minZoom));
  };

  const handleZoomReset = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to lightbox close handler
    setZoom(defaultZoom);
  };

  const handleMaximize = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling to lightbox close handler
    if (isMaximized) {
      // If already maximized, minimize (close lightbox)
      onMinimize?.();
    } else {
      // If not maximized, maximize (open lightbox)
      onMaximize?.();
    }
  };

  // Apply zoom to iframe content
  useEffect(() => {
    if (iframeRef.current?.contentDocument) {
      const body = iframeRef.current.contentDocument.body;
      if (body) {
        body.style.zoom = `${zoom}%`;
      }
    }
  }, [zoom]); // Re-apply when zoom changes

  return (
    <section
      aria-label="HTML showcase viewer"
      className={cn("relative w-full h-full group", className)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Label */}
      {label && (
        <div className="absolute top-2 left-2 z-10 bg-background/90 backdrop-blur-sm px-3 py-1.5 rounded-md text-sm font-medium border border-border/50">
          {label}
        </div>
      )}

      {/* Zoom Controls - Show on hover */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : -10 }}
        transition={{ duration: 0.2 }}
        className="absolute top-2 right-2 z-10 flex items-center gap-1 bg-background/90 backdrop-blur-sm rounded-md border border-border/50 p-1"
        onClick={(e) => e.stopPropagation()}
      >
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => handleZoomOut(e)}
          disabled={zoom <= minZoom}
          aria-label="Zoom out"
        >
          <Minus className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => handleZoomReset(e)}
          aria-label="Reset zoom"
        >
          <RotateCcw className="h-3 w-3" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => handleZoomIn(e)}
          disabled={zoom >= maxZoom}
          aria-label="Zoom in"
        >
          <Plus className="h-3 w-3" />
        </Button>
        <div className="h-4 w-px bg-border mx-1" />
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={(e) => handleMaximize(e)}
          aria-label={isMaximized ? "Minimize view" : "Maximize view"}
        >
          {isMaximized ? <Minimize2 className="h-3 w-3" /> : <Maximize2 className="h-3 w-3" />}
        </Button>
      </motion.div>

      {/* Zoom indicator - Show when not 100% */}
      {zoom !== 100 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute bottom-2 right-2 z-10 bg-background/90 backdrop-blur-sm px-2 py-1 rounded text-xs font-medium border border-border/50"
        >
          {zoom}%
        </motion.div>
      )}

      {/* iframe container */}
      <div
        ref={containerRef}
        className="relative w-full h-full overflow-auto rounded-lg border border-border/50 bg-background"
      >
        <iframe
          ref={iframeRef}
          src={htmlSrc}
          title={label || `${productId} showcase`}
          className="w-full h-full border-0"
          sandbox="allow-same-origin allow-scripts"
          onLoad={() => {
            // Apply initial zoom when iframe loads
            if (iframeRef.current?.contentDocument) {
              const body = iframeRef.current.contentDocument.body;
              if (body) {
                body.style.zoom = `${zoom}%`;
              }
            }
          }}
        />
      </div>
    </section>
  );
}
