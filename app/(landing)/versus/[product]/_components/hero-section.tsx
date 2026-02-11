"use client";

import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import type { VersusPageData } from "@/app/(landing)/_data/versus-pages";

type HeroSectionProps = {
  data: VersusPageData["hero"];
  cta: VersusPageData["cta"];
};

export function HeroSection({ data, cta }: HeroSectionProps) {
  return (
    <section className="relative w-full pt-32 pb-20 md:pt-40 md:pb-32 overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-background to-background" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

      <div className="container relative z-10 mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold font-heading mb-6">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary via-accent to-primary">
              {data.title}
            </span>
          </h1>

          {/* Subtitle */}
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            {data.subtitle}
          </p>

          {/* Highlight Metric */}
          {data.highlightMetric && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="inline-block mb-10"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-xl blur-xl opacity-50" />
                <div className="relative bg-card/80 backdrop-blur-sm border border-primary/30 rounded-xl px-8 py-6">
                  <motion.div
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                    className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent mb-2"
                  >
                    {data.highlightMetric.value}
                  </motion.div>
                  <div className="text-sm md:text-base text-muted-foreground font-medium">
                    {data.highlightMetric.label}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              asChild
              size="lg"
              className="h-12 px-8 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-lg shadow-lg hover:shadow-xl"
            >
              <a href={cta.primaryButton.href}>
                {cta.primaryButton.text}
                <ArrowRight className="w-4 h-4 ml-2" />
              </a>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="h-12 px-8 border-border/50 hover:border-primary/50 hover:bg-card/50 rounded-lg"
            >
              <a href={cta.secondaryButton.href} target="_blank" rel="noopener noreferrer">
                <BookOpen className="w-4 h-4 mr-2" />
                {cta.secondaryButton.text}
              </a>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
