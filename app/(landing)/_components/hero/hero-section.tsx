"use client";

import { ParticleBackground } from "@app/(landing)/_components/hero/particle-background";
import { UploadZone } from "@app/(landing)/_components/hero/upload-zone";
import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden scanlines tech-grid">
      {/* Particle Background */}
      <ParticleBackground />

      {/* Neon Gradient Orbs with Stronger Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl animate-glow"
          style={{ background: "radial-gradient(circle, rgba(0,255,255,0.4) 0%, transparent 70%)" }}
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.7, 0.4],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl animate-glow-magenta"
          style={{ background: "radial-gradient(circle, rgba(255,0,255,0.4) 0%, transparent 70%)" }}
          animate={{
            scale: [1.2, 1, 1.2],
            opacity: [0.7, 0.4, 0.7],
          }}
          transition={{
            duration: 8,
            repeat: Number.POSITIVE_INFINITY,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10 pt-24 sm:pt-28 lg:pt-0">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Text Content */}
          <div className="text-center lg:text-left">
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center mb-8"
            >
              <div className="relative group">
                <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />
                <div className="relative flex items-center gap-2 px-4 py-2 rounded-full glass border border-primary/40 tech-border glow-cyan">
                  <motion.div
                    animate={{
                      rotate: [0, 360],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Number.POSITIVE_INFINITY,
                      ease: "linear",
                    }}
                  >
                    <Sparkles className="h-4 w-4 text-secondary" />
                  </motion.div>
                  <span className="text-sm font-semibold text-foreground terminal-text">
                    🚀 Processing 1K+ Documents Monthly
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Main Heading with Split Text Animation */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold mb-6 leading-tight font-heading">
                <motion.span
                  className="block text-foreground"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                >
                  Transform
                </motion.span>
                <motion.span
                  className="block neon-cyan animate-neon-pulse"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{
                    opacity: 1,
                    y: 0,
                  }}
                  transition={{
                    opacity: { duration: 0.6, delay: 0.5 },
                    y: { duration: 0.6, delay: 0.5 },
                  }}
                >
                  Chaos
                </motion.span>
                <motion.span
                  className="block text-foreground"
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.7 }}
                >
                  into{" "}
                  <span className="relative inline-block neon-magenta">
                    <span className="relative z-10">Clarity</span>
                  </span>
                </motion.span>
              </h1>
            </motion.div>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="text-lg sm:text-xl lg:text-2xl text-muted-foreground mb-8 max-w-2xl mx-auto lg:mx-0"
            >
              The most accurate document parsing API for AI agents.{" "}
              <span className="text-foreground font-semibold">
                Extract tables, formulas, and structured data
              </span>{" "}
              with unmatched precision.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.1 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4"
            >
              <Button
                size="lg"
                className="relative overflow-hidden group h-14 px-8 text-lg"
                asChild
              >
                <Link href="/login">
                  <span className="relative z-10 flex items-center gap-2">
                    Start Free Trial
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Number.POSITIVE_INFINITY,
                        ease: "easeInOut",
                      }}
                    >
                      <ArrowRight className="h-5 w-5" />
                    </motion.div>
                  </span>
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-primary-light to-accent"
                    initial={{ x: "-100%" }}
                    whileHover={{ x: 0 }}
                    transition={{ duration: 0.3 }}
                  />
                </Link>
              </Button>

              <Button
                size="lg"
                variant="outline"
                className="relative overflow-hidden group h-14 px-8 text-lg border-primary/50 hover:border-primary"
                asChild
              >
                <Link href="https://docs.knowhereto.ai/">
                  <Zap className="h-5 w-5 mr-2 text-accent" />
                  <span>View Documentation</span>
                </Link>
              </Button>
            </motion.div>

            {/* Trust Indicators */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 1.3 }}
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-sm text-muted-foreground"
            >
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>No credit card required</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                <span>99.8% accuracy</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-accent animate-pulse" />
                <span>&lt;200ms response time</span>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Interactive Upload Zone */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="relative"
          >
            <UploadZone />
          </motion.div>
        </div>
      </div>
    </section>
  );
}
