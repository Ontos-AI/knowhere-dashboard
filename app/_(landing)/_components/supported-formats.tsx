"use client";

import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";

const supportedFormats = ["docx", "xlsx", "csv", "pptx", "pdf", "txt", "png", "jpg", "md", "json"];
const comingSoonFormats = ["doc", "xls", "ppt", "epub", "html", "xml", "mp4", "mp3", "skills.md"];

export const SupportedFormats = () => {
  return (
    <section className="py-8 md:py-12 bg-pixel-bg border-y-2 border-pixel-border">
      <div className="container mx-auto px-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-center gap-3">
          <PixelIcon icon="file" size={20} className="text-pixel-fg" />
          <span className="font-pixel text-pixel-sm text-pixel-fg">SUPPORTED FORMATS</span>
        </div>

        {/* Available Now */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <PixelIcon icon="check" size={16} color="green" />
            <span className="font-sans text-xs text-pixel-muted uppercase tracking-widest">
              Available Now
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {supportedFormats.map((fmt) => (
              <div key={fmt} className="pixel-border px-3 py-1.5 bg-pixel-bg">
                <span className="font-pixel text-pixel-xs text-pixel-fg">.{fmt}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Coming Soon */}
        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2">
            <PixelIcon icon="clock" size={16} className="text-pixel-muted" />
            <span className="font-sans text-xs text-pixel-muted uppercase tracking-widest">
              Coming Soon
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {comingSoonFormats.map((fmt) => (
              <div
                key={fmt}
                className="border-2 border-dashed border-pixel-border px-3 py-1.5 opacity-50"
              >
                <span className="font-pixel text-pixel-xs text-pixel-muted">.{fmt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
