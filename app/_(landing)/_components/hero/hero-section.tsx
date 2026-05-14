"use client";

import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import { PixelIcon } from "@app/_(landing)/_components/pixel/pixel-icon";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const BRAND_TITLE = `
██╗  ██╗███╗   ██╗ ██████╗ ██╗    ██╗██╗  ██╗███████╗██████╗ ███████╗
██║ ██╔╝████╗  ██║██╔═══██╗██║    ██║██║  ██║██╔════╝██╔══██╗██╔════╝
█████╔╝ ██╔██╗ ██║██║   ██║██║ █╗ ██║███████║█████╗  ██████╔╝█████╗
██╔═██╗ ██║╚██╗██║██║   ██║██║███╗██║██╔══██║██╔══╝  ██╔══██╗██╔══╝
██║  ██╗██║ ╚████║╚██████╔╝╚███╔███╔╝██║  ██║███████╗██║  ██║███████╗
╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
`;

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 pb-16 bg-pixel-bg">
      {/* Pixel Grid Background (subtle) */}
      <div className="absolute inset-0 pixel-grid-bg pointer-events-none" />

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          {/* Main Content - Centered */}
          <div className="text-center space-y-12">
            {/* Pixel Art Logo/Title */}
            <div className="space-y-8">
              <HeroAnnouncementBar />

              {/* ASCII Art Header */}
              <div className="flex w-full items-center justify-center overflow-hidden">
                <pre
                  className="m-0 max-w-full overflow-hidden whitespace-pre font-mono text-[7px] scale-[1.1] min-[380px]:text-[7.5px] min-[500px]:text-[10px] sm:text-[12px] md:text-sm text-pixel-fg leading-[1.25] tracking-normal text-left"
                  style={{
                    fontFamily:
                      'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
                    fontVariantLigatures: "none",
                    textRendering: "auto",
                  }}
                >
                  {BRAND_TITLE}
                </pre>
              </div>

              {/* Main Heading */}
              <PixelHeading as="h1" size="lg" className="text-pixel-fg uppercase">
                API Platform
              </PixelHeading>

              {/* Tagline */}
              <p className="font-sans text-lg sm:text-xl text-pixel-muted max-w-3xl mx-auto">
                Transform unstructured documents into clean, structured data.
                <br />
                <span className="text-pixel-fg font-medium">
                  Extract tables, formulas, and layouts with pixel-perfect precision.
                </span>
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <PixelButton variant="primary" asChild>
                <Link href="/login">Start Free Trial</Link>
              </PixelButton>

              <PixelButton variant="secondary" asChild>
                <Link href="https://docs.knowhereto.ai/" target="_blank">
                  View Docs
                </Link>
              </PixelButton>
            </div>

            {/* Pixel Art Illustration */}
            <div className="relative md:py-12 py-[60px]">
              <div className="flex items-center justify-center gap-8 flex-wrap">
                {/* Input Data Box */}
                <div className="pixel-card p-6 space-y-2">
                  <PixelIcon icon="docs" size={32} className="text-pixel-fg mx-auto" />
                  <PixelHeading as="h3" size="xs" className="text-center">
                    INPUT
                  </PixelHeading>
                  <p className="font-sans text-xs text-pixel-muted text-center">Documents</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2">
                  <div className="font-pixel text-pixel-md text-pixel-fg">→</div>
                </div>

                {/* API Box */}
                <div className="pixel-card pixel-card-accent p-6 space-y-2">
                  <PixelIcon icon="api" size={32} className="text-pixel-green mx-auto" />
                  <PixelHeading as="h3" size="xs" className="text-center text-pixel-green">
                    API
                  </PixelHeading>
                  <p className="font-sans text-xs text-pixel-muted text-center">Processing</p>
                </div>

                {/* Arrow */}
                <div className="flex items-center gap-2">
                  <div className="font-pixel text-pixel-md text-pixel-fg">→</div>
                </div>

                {/* Output Data Box */}
                <div className="pixel-card p-6 space-y-2">
                  <PixelIcon icon="database" size={32} className="text-pixel-fg mx-auto" />
                  <PixelHeading as="h3" size="xs" className="text-center">
                    OUTPUT
                  </PixelHeading>
                  <p className="font-sans text-xs text-pixel-muted text-center">Clean JSON</p>
                </div>
              </div>
            </div>

            {/* Trust Indicators */}
            <div className="flex flex-wrap items-center justify-center gap-6 text-xs font-pixel text-pixel-muted">
              <div className="flex items-center gap-2">
                <PixelIcon icon="check" size={16} className="text-pixel-green" />
                <span>No Card Required</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const HeroAnnouncementBar = () => {
  return (
    <div className="mx-auto flex justify-center px-2">
      <Link
        href="/claw"
        aria-label="View Knowhere OpenClaw setup"
        className="group relative inline-flex max-w-full cursor-pointer overflow-hidden border-2 border-pixel-fg bg-[#f6efe3] text-left shadow-[3px_3px_0_var(--pixel-shadow)] transition-all duration-200 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0_var(--pixel-shadow)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pixel-green focus-visible:ring-offset-2 focus-visible:ring-offset-pixel-bg"
      >
        <div className="pointer-events-none absolute inset-0 pixel-grid-bg opacity-15" />

        <div className="relative flex items-center justify-center gap-2 whitespace-nowrap px-3 py-1.5 sm:px-4">
          <span className="inline-flex items-center border-2 border-pixel-fg bg-pixel-green px-2 py-0.5 font-pixel text-[9px] uppercase tracking-[0.14em] text-pixel-bg shadow-[2px_2px_0_rgba(0,0,0,0.12)]">
            New
          </span>
          <p className="text-[11px] leading-none text-pixel-fg sm:text-sm sm:leading-5">
            <span className="font-bold sm:hidden">Now live on 🦞 OpenClaw</span>
            <span className="hidden sm:inline">
              <span className="font-bold">Now live on 🦞 OpenClaw</span>
              <span className="text-pixel-muted"> with an installable plugin and skill.</span>
            </span>
          </p>
          <span className="inline-flex items-center border-l-2 border-pixel-border pl-2 font-pixel text-[9px] uppercase tracking-[0.12em] text-pixel-muted transition-all duration-200 group-hover:translate-x-[1px] group-hover:text-pixel-fg">
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.75] sm:hidden" />
            <span className="hidden items-center gap-1 sm:inline-flex">
              <span>Explore</span>
              <ArrowRight className="size-3 stroke-[2.75]" />
            </span>
          </span>
        </div>
      </Link>
    </div>
  );
};
