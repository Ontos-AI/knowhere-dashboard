"use client";

import { Button } from "@components/ui/button";
import { ArrowRight, BookOpen, CheckCircle2 } from "lucide-react";
import type { VersusPageData } from "@/app/(landing)/_data/versus-pages";

type CTASectionProps = {
  data: VersusPageData["cta"];
};

export function CTASection({ data }: CTASectionProps) {
  return (
    <section className="relative w-full py-20 md:py-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-accent/10 to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/20 via-transparent to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              {data.title}
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto">
            {data.subtitle}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-10">
            <Button
              asChild
              size="lg"
              className="h-14 px-10 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl"
            >
              <a href={data.primaryButton.href}>
                {data.primaryButton.text}
                <ArrowRight className="w-5 h-5 ml-2" />
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-14 px-10 border-border/50 hover:border-primary/50 hover:bg-card/50 rounded-lg"
            >
              <a href={data.secondaryButton.href} target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-5 h-5 mr-2" />
                {data.secondaryButton.text}
              </a>
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center text-sm text-muted-foreground">
            {data.trustBadges.map((badge) => (
              <div key={badge} className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                <span>{badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
