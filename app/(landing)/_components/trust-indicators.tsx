"use client";

import { motion, useInView } from "framer-motion";
import { Award, GitFork, Star, TrendingUp, Users, Zap } from "lucide-react";
import { useEffect, useRef, useState } from "react";

type MetricItem = {
  icon: React.ElementType;
  value: string;
  label: string;
  countUp?: number;
  suffix?: string;
};

const metrics: MetricItem[] = [
  {
    icon: Star,
    value: "53K+",
    label: "GitHub Stars",
    countUp: 53000,
    suffix: "+",
  },
  {
    icon: TrendingUp,
    value: "2M+",
    label: "Docs Processed",
    countUp: 2000000,
    suffix: "+",
  },
  {
    icon: Award,
    value: "99.8%",
    label: "Accuracy",
    countUp: 99.8,
    suffix: "%",
  },
  {
    icon: Users,
    value: "100+",
    label: "Integrations",
    countUp: 100,
    suffix: "+",
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

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, amount: 0.5 });

  useEffect(() => {
    if (!isInView) return;

    const duration = 1500;
    const steps = 60;
    const stepValue = value / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setCount(value);
        clearInterval(timer);
      } else {
        setCount(Math.floor(stepValue * currentStep));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [isInView, value]);

  const formatNumber = (num: number): string => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    }
    if (num >= 1000) {
      return `${(num / 1000).toFixed(0)}K`;
    }
    return num.toString();
  };

  return (
    <span ref={ref}>
      {value % 1 === 0 ? formatNumber(count) : count.toFixed(1)}
      {suffix}
    </span>
  );
}

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
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-primary/20 rounded-lg blur-xl group-hover:bg-primary/30 transition-colors" />
                  <div className="relative h-12 w-12 rounded-lg bg-card border border-primary/20 flex items-center justify-center group-hover:border-primary/40 transition-colors">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                </motion.div>
                <div>
                  <div className="text-2xl lg:text-3xl font-bold font-mono text-foreground mb-1">
                    {metric.countUp !== undefined ? (
                      <AnimatedCounter value={metric.countUp} suffix={metric.suffix} />
                    ) : (
                      metric.value
                    )}
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
                      {metric.countUp !== undefined ? (
                        <AnimatedCounter value={metric.countUp} suffix={metric.suffix} />
                      ) : (
                        metric.value
                      )}
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
