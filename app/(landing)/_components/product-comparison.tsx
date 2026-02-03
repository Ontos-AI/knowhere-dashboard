"use client";

import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useState } from "react";

type ComparisonData = {
  category: string;
  feature: string;
  competitor: "good" | "poor" | "missing";
  knowhere: "excellent" | "good";
  description?: string;
};

const comparisonData: ComparisonData[] = [
  {
    category: "Table Recognition",
    feature: "Complex merged cells",
    competitor: "poor",
    knowhere: "excellent",
    description: "Accurately handles multi-level merged cells",
  },
  {
    category: "Table Recognition",
    feature: "Cross-page tables",
    competitor: "missing",
    knowhere: "excellent",
    description: "Seamlessly processes tables spanning multiple pages",
  },
  {
    category: "Formula Extraction",
    feature: "LaTeX output",
    competitor: "good",
    knowhere: "excellent",
    description: "Perfect LaTeX conversion with 99.8% accuracy",
  },
  {
    category: "Formula Extraction",
    feature: "Inline formulas",
    competitor: "poor",
    knowhere: "excellent",
    description: "Detects and extracts inline mathematical expressions",
  },
  {
    category: "Performance",
    feature: "Processing speed",
    competitor: "good",
    knowhere: "excellent",
    description: "2.5x faster than competitors",
  },
  {
    category: "Performance",
    feature: "Accuracy rate",
    competitor: "good",
    knowhere: "excellent",
    description: "+23% higher accuracy on complex documents",
  },
];

const tabs = ["All Features", "Tables", "Formulas", "Performance"];

export function ProductComparison() {
  const [activeTab, setActiveTab] = useState(0);

  const filteredData =
    activeTab === 0
      ? comparisonData
      : comparisonData.filter((item) => {
          if (activeTab === 1) return item.category === "Table Recognition";
          if (activeTab === 2) return item.category === "Formula Extraction";
          if (activeTab === 3) return item.category === "Performance";
          return true;
        });

  return (
    <section className="py-16 md:py-24 bg-muted/20">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            See The{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Difference
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Real-world comparisons showing why developers choose Knowhere API over competitors
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {tabs.map((tab, index) => (
            <Button
              key={tab}
              variant={activeTab === index ? "default" : "outline"}
              onClick={() => setActiveTab(index)}
              className="relative overflow-hidden transition-all"
            >
              {activeTab === index && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-primary"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              <span className="relative z-10">{tab}</span>
            </Button>
          ))}
        </motion.div>

        {/* Comparison Table */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="max-w-4xl mx-auto"
        >
          <div className="glass rounded-2xl border border-border/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-3 gap-4 p-4 md:p-6 bg-card/50 border-b border-border/50">
              <div className="text-sm font-medium text-muted-foreground">Feature</div>
              <div className="text-sm font-medium text-muted-foreground text-center">
                Competitors
              </div>
              <div className="text-sm font-medium text-primary text-center">Knowhere API</div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-border/50">
              {filteredData.map((item, index) => (
                <motion.div
                  key={`${item.feature}-${index}`}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className="grid grid-cols-3 gap-4 p-4 md:p-6 hover:bg-card/30 transition-colors group"
                >
                  {/* Feature Name */}
                  <div>
                    <div className="font-medium text-foreground mb-1">{item.feature}</div>
                    {item.description && (
                      <div className="text-sm text-muted-foreground hidden md:block">
                        {item.description}
                      </div>
                    )}
                  </div>

                  {/* Competitor Status */}
                  <div className="flex items-center justify-center">
                    {item.competitor === "good" && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Check className="h-5 w-5" />
                        <span className="text-sm hidden sm:inline">Good</span>
                      </div>
                    )}
                    {item.competitor === "poor" && (
                      <div className="flex items-center gap-2 text-destructive/70">
                        <X className="h-5 w-5" />
                        <span className="text-sm hidden sm:inline">Poor</span>
                      </div>
                    )}
                    {item.competitor === "missing" && (
                      <div className="flex items-center gap-2 text-destructive/70">
                        <X className="h-5 w-5" />
                        <span className="text-sm hidden sm:inline">Missing</span>
                      </div>
                    )}
                  </div>

                  {/* Knowhere Status */}
                  <div className="flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="flex items-center gap-2 text-accent"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-accent/20 rounded-full blur-md group-hover:bg-accent/30 transition-colors" />
                        <Check className="h-5 w-5 relative" />
                      </div>
                      <span className="text-sm font-medium hidden sm:inline">
                        {item.knowhere === "excellent" ? "Excellent" : "Good"}
                      </span>
                    </motion.div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Stats Footer */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-6 bg-card/30 border-t border-border/50">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20"
              >
                <div className="text-2xl font-bold font-mono text-accent mb-1">+23%</div>
                <div className="text-sm text-muted-foreground">Higher Accuracy</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center p-4 rounded-lg bg-primary/10 border border-primary/20"
              >
                <div className="text-2xl font-bold font-mono text-primary mb-1">2.5x</div>
                <div className="text-sm text-muted-foreground">Faster Processing</div>
              </motion.div>
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="text-center p-4 rounded-lg bg-accent/10 border border-accent/20"
              >
                <div className="text-2xl font-bold font-mono text-accent mb-1">99.8%</div>
                <div className="text-sm text-muted-foreground">Quality Score</div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
