"use client";

import { motion, useInView } from "framer-motion";
import { BarChart, FileText, Gauge, Sparkles } from "lucide-react";
import { useRef } from "react";

type Stage = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: string;
};

const stages: Stage[] = [
  {
    icon: FileText,
    title: "Input",
    description: "Upload document (PDF, DOCX, XLSX, etc.)",
    color: "text-blue-400",
  },
  {
    icon: Gauge,
    title: "OCR & Detection",
    description: "Extract text, detect tables, formulas, images",
    color: "text-cyan-400",
  },
  {
    icon: Sparkles,
    title: "Structure Analysis",
    description: "Analyze layout, relationships, hierarchies",
    color: "text-teal-400",
  },
  {
    icon: BarChart,
    title: "JSON Output",
    description: "Clean, structured data for AI consumption",
    color: "text-green-400",
  },
];

function FlowingParticle({ delay }: { delay: number }) {
  return (
    <motion.div
      className="absolute top-1/2 left-0 w-2 h-2 rounded-full bg-primary/60"
      initial={{ x: 0, opacity: 0 }}
      animate={{
        x: ["0%", "100%"],
        opacity: [0, 1, 1, 0],
      }}
      transition={{
        duration: 3,
        delay,
        repeat: Number.POSITIVE_INFINITY,
        ease: "linear",
      }}
    />
  );
}

export function DataTransformationViz() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.3 });

  return (
    <section ref={ref} className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Watch Your Data{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Transform
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Our intelligent pipeline processes documents through multiple stages to deliver perfect
            results
          </p>
        </motion.div>

        {/* Desktop: Horizontal Flow */}
        <div className="hidden lg:block">
          <div className="relative">
            {/* Connecting Lines with Flowing Particles */}
            <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-border via-primary/50 to-border -translate-y-1/2 z-0" />

            {/* Animated Particles */}
            {isInView && (
              <>
                <FlowingParticle delay={0} />
                <FlowingParticle delay={0.5} />
                <FlowingParticle delay={1} />
                <FlowingParticle delay={1.5} />
                <FlowingParticle delay={2} />
              </>
            )}

            <div className="grid grid-cols-4 gap-8 relative z-10">
              {stages.map((stage, index) => (
                <motion.div
                  key={stage.title}
                  initial={{ opacity: 0, y: 40, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, y: 0, scale: 1 } : {}}
                  transition={{ duration: 0.6, delay: index * 0.2 }}
                  className="relative"
                >
                  {/* Stage Card */}
                  <motion.div
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 15 }}
                    className="group glass rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer"
                  >
                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-2xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity blur-xl -z-10" />

                    {/* Icon */}
                    <motion.div
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                      className="mb-4"
                    >
                      <div className="relative inline-block">
                        <div className="absolute inset-0 bg-primary/30 rounded-full blur-lg" />
                        <div className="relative h-16 w-16 rounded-full bg-card border border-primary/20 flex items-center justify-center group-hover:border-primary/50 transition-colors">
                          <stage.icon className={`h-8 w-8 ${stage.color}`} />
                        </div>
                      </div>
                    </motion.div>

                    {/* Content */}
                    <h3 className="text-xl font-semibold font-heading mb-2">{stage.title}</h3>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>

                    {/* Stage Number */}
                    <div className="absolute top-4 right-4 h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                      <span className="text-sm font-bold font-mono text-primary">{index + 1}</span>
                    </div>
                  </motion.div>

                  {/* Arrow (except last) */}
                  {index < stages.length - 1 && (
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={isInView ? { opacity: 1, x: 0 } : {}}
                      transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
                      className="absolute top-1/2 -right-4 -translate-y-1/2 z-20"
                    >
                      <div className="text-primary/50">
                        <svg
                          width="32"
                          height="32"
                          viewBox="0 0 32 32"
                          fill="none"
                          className="animate-pulse"
                        >
                          <title>Arrow</title>
                          <path
                            d="M8 16H24M24 16L18 10M24 16L18 22"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* Mobile/Tablet: Vertical Flow */}
        <div className="lg:hidden space-y-6">
          {stages.map((stage, index) => (
            <motion.div
              key={stage.title}
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="relative"
            >
              {/* Connecting Line */}
              {index < stages.length - 1 && (
                <div className="absolute left-8 top-24 bottom-0 w-0.5 bg-gradient-to-b from-primary/50 to-border -z-10" />
              )}

              <div className="glass rounded-2xl border border-border/50 p-6">
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <div className="absolute inset-0 bg-primary/30 rounded-full blur-md" />
                      <div className="relative h-16 w-16 rounded-full bg-card border border-primary/20 flex items-center justify-center">
                        <stage.icon className={`h-7 w-7 ${stage.color}`} />
                      </div>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold font-heading">{stage.title}</h3>
                      <div className="h-6 w-6 rounded-full bg-primary/20 flex items-center justify-center border border-primary/30">
                        <span className="text-xs font-bold font-mono text-primary">
                          {index + 1}
                        </span>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">{stage.description}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Stats Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto"
        >
          {[
            { label: "Avg. Processing", value: "187ms" },
            { label: "Accuracy Rate", value: "99.8%" },
            { label: "File Formats", value: "50+" },
            { label: "Daily Docs", value: "100K+" },
          ].map((stat, index) => (
            <motion.div
              key={stat.label}
              whileHover={{ scale: 1.05 }}
              className="text-center p-4 rounded-lg glass border border-border/50"
            >
              <div className="text-2xl font-bold font-mono text-primary mb-1">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
