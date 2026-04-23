"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { useEffect, useState } from "react";
import { PixelButton } from "@/app/_(landing)/_components/pixel/pixel-button";
import { PixelIcon } from "@/app/_(landing)/_components/pixel/pixel-icon";
import { useFetchHtml } from "@/app/_(landing)/versus/[product]/_hooks/use-fetch-html";

export type DemoContent = {
  title: string;
  htmlUrl: string;
  highlights: string[];
  isKnowhere?: boolean;
};

type DemoDetailModalProps = {
  isOpen: boolean;
  onClose: () => void;
  content: DemoContent | null;
};

const MIN_ZOOM = 0.5; // 50%
const MAX_ZOOM = 2.0; // 200%
const ZOOM_STEP = 0.1; // 10%

export function DemoDetailModal({ isOpen, onClose, content }: DemoDetailModalProps) {
  const [zoom, setZoom] = useState(1.0);
  const { html, isLoading, error, refetch } = useFetchHtml(
    isOpen ? (content?.htmlUrl ?? null) : null
  );

  // Reset zoom when modal opens or content changes
  useEffect(() => {
    if (isOpen) {
      setZoom(1.0);
    }
  }, [isOpen]);

  const handleZoomIn = () => {
    setZoom((prev) => Math.min(prev + ZOOM_STEP, MAX_ZOOM));
  };

  const handleZoomOut = () => {
    setZoom((prev) => Math.max(prev - ZOOM_STEP, MIN_ZOOM));
  };

  const handleZoomReset = () => {
    setZoom(1.0);
  };

  const handleDownload = () => {
    if (!html || !content) return;

    const blob = new Blob([html], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${content.title.toLowerCase().replace(/\s+/g, "-")}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!content) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[80vw] max-h-[80vh] p-0 gap-0 flex flex-col border-2 border-pixel-border bg-pixel-bg">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b-2 border-pixel-border shrink-0">
          <DialogTitle
            className={
              content.isKnowhere
                ? "text-xl font-pixel text-pixel-green"
                : "text-xl font-pixel text-pixel-fg"
            }
          >
            {content.title.toUpperCase()}
          </DialogTitle>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-4 p-6 overflow-hidden min-h-0">
          {/* Left: HTML Content (70%) */}
          <div className="flex-[7] flex flex-col gap-4 min-w-0">
            {/* HTML Render Area */}
            <div className="flex-1 border-2 border-pixel-border bg-pixel-bg overflow-auto relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-pixel-bg z-10">
                  <div className="text-center">
                    <div className="flex items-end gap-1 mx-auto mb-2 w-fit">
                      <div className="w-2 h-2 bg-pixel-fg animate-bounce [animation-delay:-0.3s]" />
                      <div className="w-2 h-2 bg-pixel-fg animate-bounce [animation-delay:-0.15s]" />
                      <div className="w-2 h-2 bg-pixel-fg animate-bounce" />
                    </div>
                    <p className="text-sm text-[var(--pixel-text-muted)] font-sans">
                      Loading content...
                    </p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-pixel-bg z-10">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-pixel-red font-sans">Failed to load content</p>
                    <p className="text-xs text-[var(--pixel-text-muted)] font-sans">
                      {error.message}
                    </p>
                    <PixelButton onClick={refetch} variant="secondary">
                      RETRY
                    </PixelButton>
                  </div>
                </div>
              )}

              {html && !isLoading && !error && (
                <div
                  className="p-4 transition-transform duration-200 origin-top-left"
                  style={{ transform: `scale(${zoom})` }}
                  // biome-ignore lint/security/noDangerouslySetInnerHtml: HTML content from trusted static files
                  dangerouslySetInnerHTML={{ __html: html }}
                />
              )}
            </div>

            {/* Toolbar */}
            <div className="flex items-center justify-between gap-4 px-4 py-3 border-2 border-pixel-border bg-pixel-bg">
              <div className="flex items-center gap-2">
                <PixelButton
                  onClick={handleZoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  variant="secondary"
                >
                  -
                </PixelButton>
                <PixelButton onClick={handleZoomReset} variant="secondary">
                  {Math.round(zoom * 100)}%
                </PixelButton>
                <PixelButton onClick={handleZoomIn} disabled={zoom >= MAX_ZOOM} variant="secondary">
                  +
                </PixelButton>
              </div>

              <PixelButton
                onClick={handleDownload}
                disabled={!html || isLoading || !!error}
                variant="secondary"
              >
                DOWNLOAD
              </PixelButton>
            </div>
          </div>

          {/* Right: Highlights Sidebar (30%) */}
          <div className="flex-[3] flex flex-col gap-4 min-w-0">
            <div className="flex-1 border-2 border-pixel-border bg-pixel-bg p-6 overflow-auto">
              <h3 className="text-sm font-pixel text-pixel-fg mb-4">HIGHLIGHTS</h3>
              <div className="space-y-3">
                {content.highlights.map((highlight) => {
                  const isPositive = highlight.startsWith("✅");
                  const icon = isPositive ? "check" : "cross";
                  const color = isPositive ? "green" : "red";

                  return (
                    <div key={highlight} className="flex items-start gap-3">
                      <PixelIcon
                        icon={icon}
                        size={16}
                        color={color}
                        className="flex-shrink-0 mt-0.5"
                      />
                      <p className="text-sm text-[var(--pixel-text-muted)] font-sans flex-1">
                        {highlight.replace(/^[✅❌]\s*/, "")}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
