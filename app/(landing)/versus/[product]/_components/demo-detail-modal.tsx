"use client";

import { Button } from "@components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@components/ui/dialog";
import { CheckCircle2, Download, Loader2, Minus, Plus, RotateCcw, XCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { useFetchHtml } from "@/app/(landing)/versus/[product]/_hooks/use-fetch-html";

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
      <DialogContent className="max-w-[80vw] max-h-[80vh] p-0 gap-0 flex flex-col">
        {/* Header */}
        <DialogHeader className="px-6 pt-6 pb-4 border-b shrink-0">
          <DialogTitle
            className={
              content.isKnowhere
                ? "text-2xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent"
                : "text-2xl"
            }
          >
            {content.title}
          </DialogTitle>
        </DialogHeader>

        {/* Main Content Area */}
        <div className="flex-1 flex gap-4 p-6 overflow-hidden min-h-0">
          {/* Left: HTML Content (70%) */}
          <div className="flex-[7] flex flex-col gap-4 min-w-0">
            {/* HTML Render Area */}
            <div className="flex-1 rounded-lg border border-border/50 bg-card/30 overflow-auto relative">
              {isLoading && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
                  <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading content...</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="absolute inset-0 flex items-center justify-center bg-card/80 backdrop-blur-sm z-10">
                  <div className="text-center space-y-3">
                    <p className="text-sm text-destructive">Failed to load content</p>
                    <p className="text-xs text-muted-foreground">{error.message}</p>
                    <Button onClick={refetch} variant="outline" size="sm">
                      Retry
                    </Button>
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
            <div className="flex items-center justify-between gap-4 px-4 py-3 bg-card/50 rounded-lg border border-border/50">
              <div className="flex items-center gap-2">
                <Button
                  onClick={handleZoomOut}
                  disabled={zoom <= MIN_ZOOM}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Minus className="w-4 h-4" />
                </Button>
                <Button
                  onClick={handleZoomReset}
                  variant="outline"
                  size="sm"
                  className="gap-1 min-w-[80px]"
                >
                  <RotateCcw className="w-4 h-4" />
                  {Math.round(zoom * 100)}%
                </Button>
                <Button
                  onClick={handleZoomIn}
                  disabled={zoom >= MAX_ZOOM}
                  variant="outline"
                  size="sm"
                  className="gap-1"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={handleDownload}
                disabled={!html || isLoading || !!error}
                variant="outline"
                size="sm"
                className="gap-2"
              >
                <Download className="w-4 h-4" />
                Download
              </Button>
            </div>
          </div>

          {/* Right: Highlights Sidebar (30%) */}
          <div className="flex-[3] flex flex-col gap-4 min-w-0">
            <div className="flex-1 rounded-lg border border-border/50 bg-card/30 p-6 overflow-auto">
              <h3 className="text-lg font-semibold mb-4">Highlights</h3>
              <div className="space-y-3">
                {content.highlights.map((highlight) => {
                  const isPositive =
                    highlight.startsWith("✅") ||
                    highlight.includes("Perfect") ||
                    highlight.includes("Correct");
                  const Icon = isPositive ? CheckCircle2 : XCircle;
                  const colorClass = isPositive ? "text-green-500" : "text-red-500";

                  return (
                    <div key={highlight} className="flex items-start gap-3">
                      <Icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${colorClass}`} />
                      <p className="text-sm text-muted-foreground flex-1">
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
