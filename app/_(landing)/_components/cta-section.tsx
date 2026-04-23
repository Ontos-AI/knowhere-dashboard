"use client";

import { PixelButton } from "@app/_(landing)/_components/pixel/pixel-button";
import { PixelCard } from "@app/_(landing)/_components/pixel/pixel-card";
import { PixelHeading } from "@app/_(landing)/_components/pixel/pixel-heading";
import Link from "next/link";

export function CTASection() {
  return (
    <section className="py-16 md:py-24 bg-pixel-bg border-y-2 border-pixel-border">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* CTA Card */}
          <PixelCard className="border-4 border-pixel-green">
            <div className="p-8 md:p-12 text-center">
              <PixelHeading as="h2" size="lg" className="mb-4">
                READY TO GET <span className="text-pixel-green">STARTED?</span>
              </PixelHeading>

              <p className="text-base text-pixel-muted font-sans mb-8 max-w-2xl mx-auto">
                Join thousands of developers building AI agents with the most accurate document
                parsing API
              </p>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-8">
                <PixelButton variant="primary" asChild>
                  <Link href="/login">START FREE TRIAL</Link>
                </PixelButton>

                <PixelButton variant="secondary" asChild>
                  <Link href="/demo">BOOK A DEMO</Link>
                </PixelButton>
              </div>

              {/* Trust Badge */}
              <div className="flex flex-wrap items-center justify-center gap-6 text-sm text-pixel-muted font-sans">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pixel-green pixel-border-sm" />
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pixel-green pixel-border-sm" />
                  <span>Free 14-day trial</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-pixel-green pixel-border-sm" />
                  <span>Cancel anytime</span>
                </div>
              </div>
            </div>
          </PixelCard>
        </div>
      </div>
    </section>
  );
}
