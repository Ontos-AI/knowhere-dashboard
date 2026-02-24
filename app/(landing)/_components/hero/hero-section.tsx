"use client";

import Link from "next/link";
import { PixelButton } from "../pixel/pixel-button";
import { PixelHeading } from "../pixel/pixel-heading";
import { PixelIcon } from "../pixel/pixel-icon";

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
              {/* ASCII Art Header */}
              <div className="font-mono text-pixel-fg leading-none overflow-x-hidden flex items-center justify-center">
                <pre
                  className="text-[7px] scale-[0.99] sm:text-[10px] md:text-[16px] lg:text-[19px] xl:text-[22px] leading-none tracking-normal"
                  style={{
                    fontFamily: '"Courier New", Courier, monospace',
                    lineHeight: 1,
                    letterSpacing: 0,
                  }}
                >
                  {`
  ██╗  ██╗███╗   ██╗ ██████╗ ██╗    ██╗██╗  ██╗███████╗██████╗ ███████╗
  ██║ ██╔╝████╗  ██║██╔═══██╗██║    ██║██║  ██║██╔════╝██╔══██╗██╔════╝
  █████╔╝ ██╔██╗ ██║██║   ██║██║ █╗ ██║███████║█████╗  ██████╔╝█████╗
  ██╔═██╗ ██║╚██╗██║██║   ██║██║███╗██║██╔══██║██╔══╝  ██╔══██╗██╔══╝
  ██║  ██╗██║ ╚████║╚██████╔╝╚███╔███╔╝██║  ██║███████╗██║  ██║███████╗
  ╚═╝  ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝╚══════╝
                  `}
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
              <div className="flex items-center gap-2">
                <PixelIcon icon="check" size={16} className="text-pixel-green" />
                <span>99.8% Accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <PixelIcon icon="performance" size={16} className="text-pixel-green" />
                <span>&lt;200ms Speed</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
