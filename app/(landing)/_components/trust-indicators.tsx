"use client";

import { motion } from "framer-motion";
import { Award, GitFork, Star, TrendingUp, Users, Zap } from "lucide-react";

type MetricItem = {
  icon: React.ElementType;
  value: string;
  label: string;
};

const metrics: MetricItem[] = [
  {
    icon: Star,
    value: "53K+",
    label: "GitHub Stars",
  },
  {
    icon: TrendingUp,
    value: "2M+",
    label: "Docs Processed",
  },
  {
    icon: Award,
    value: "99.8%",
    label: "Accuracy",
  },
  {
    icon: Users,
    value: "100+",
    label: "Integrations",
  },
  {
    icon: GitFork,
    value: "SOC2",
    label: "Certified",
  },
  {
    icon: Zap,
    value: "<200ms",
    label: "Response Time",
  },
];

export function TrustIndicators() {
  return (
    <section className="py-12 md:py-16 border-y border-border/50">
      <div className="container mx-auto px-4">
        {/* Desktop/Tablet: Grid Layout */}
        <div className="hidden md:grid md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group"
            >
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-colors" />
                  <div className="relative h-12 w-12 rounded-lg bg-card border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold font-mono text-foreground mb-1">
                    {metric.value}
                  </div>
                  <div className="text-sm text-muted-foreground">{metric.label}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Mobile: Horizontal Scroll */}
        <div className="md:hidden overflow-x-auto hide-scrollbar">
          <div className="flex gap-6 pb-2">
            {metrics.map((metric, index) => (
              <motion.div
                key={metric.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.5, delay: index * 0.05 }}
                className="flex-shrink-0 w-[140px]"
              >
                <div className="flex flex-col items-center text-center space-y-3 p-4 rounded-lg bg-card/50 border border-border">
                  <div className="relative">
                    <div className="absolute inset-0 bg-primary/20 rounded-lg blur-lg" />
                    <div className="relative h-10 w-10 rounded-lg bg-card border border-primary/20 flex items-center justify-center">
                      <metric.icon className="h-5 w-5 text-primary" />
                    </div>
                  </div>
                  <div>
                    <div className="text-xl font-bold font-mono text-foreground mb-1">
                      {metric.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{metric.label}</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
