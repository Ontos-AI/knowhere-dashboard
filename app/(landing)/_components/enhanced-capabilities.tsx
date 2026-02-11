"use client";

import { motion } from "framer-motion";
import { Atom, BookOpen, Code2, Globe, Grid3x3, Shield, Sparkles, Zap } from "lucide-react";

type Capability = {
  icon: React.ElementType;
  title: string;
  description: string;
  color: "primary" | "accent";
};

const capabilities: Capability[] = [
  {
    icon: Grid3x3,
    title: "Advanced Table Recognition",
    description:
      "Parse complex tables with rotations, merged cells, and cross-page spans with industry-leading accuracy",
    color: "primary",
  },
  {
    icon: Sparkles,
    title: "Precise Formula Recognition",
    description:
      "Extract mathematical formulas and convert to LaTeX/MathML with 99.8% accuracy using SOTA models",
    color: "accent",
  },
  {
    icon: BookOpen,
    title: "Multi-format Support",
    description:
      "Process 50+ file types: PDF, DOCX, XLSX, PPT, HTML, Images, and more with unified API",
    color: "primary",
  },
  {
    icon: Atom,
    title: "Chemical Structure Analysis",
    description:
      "State-of-the-art molecular detection and chemical reaction extraction for scientific documents",
    color: "accent",
  },
  {
    icon: Zap,
    title: "Real-time Processing",
    description: "Sub-200ms response time for most documents with async processing for large files",
    color: "primary",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "SOC2 compliant, zero data retention, end-to-end encryption, and role-based access control",
    color: "accent",
  },
  {
    icon: Code2,
    title: "API First Design",
    description:
      "RESTful API with webhooks, comprehensive SDKs for all major languages, and detailed documentation",
    color: "primary",
  },
  {
    icon: Globe,
    title: "Global Infrastructure",
    description:
      "Multi-region deployment on AWS and Aliyun for <50ms latency worldwide with 99.9% uptime SLA",
    color: "accent",
  },
];

export function EnhancedCapabilities() {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12 md:mb-16"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Built for Every{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Document Challenge
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Enterprise-grade features designed to handle the most complex document parsing scenarios
          </p>
        </motion.div>

        {/* Capabilities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {capabilities.map((capability, index) => (
            <motion.div
              key={capability.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
            >
              <div className="h-full glass rounded-2xl border border-border/50 p-6 hover:border-primary/50 transition-all duration-300 cursor-pointer">
                {/* Hover Glow Effect */}
                <div
                  className={`absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10 blur-xl ${
                    capability.color === "primary" ? "bg-primary/20" : "bg-accent/20"
                  }`}
                />

                {/* Icon */}
                <div className="mb-4">
                  <div className="relative inline-block">
                    <div
                      className={`absolute inset-0 rounded-lg blur-md ${
                        capability.color === "primary" ? "bg-primary/30" : "bg-accent/30"
                      } group-hover:blur-lg transition-all`}
                    />
                    <div
                      className={`relative h-12 w-12 rounded-lg flex items-center justify-center ${
                        capability.color === "primary"
                          ? "bg-primary/10 border-primary/20"
                          : "bg-accent/10 border-accent/20"
                      } border group-hover:border-${capability.color}/40 transition-colors`}
                    >
                      <capability.icon
                        className={`h-6 w-6 ${
                          capability.color === "primary" ? "text-primary" : "text-accent"
                        }`}
                      />
                    </div>
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                  {capability.title}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {capability.description}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
