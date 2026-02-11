"use client";

import { Button } from "@components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUp, Check, ChevronRight, Zap } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AdvantageDescription } from "@/app/(landing)/_components/advantage-description";
import { competitorProducts } from "@/app/(landing)/_data/product-advantages";
import type { MetricIcon } from "@/app/(landing)/_types/comparison";

type ComparisonTabsProps = {
  className?: string;
};

// Icon mapping
const iconMap: Record<MetricIcon, typeof ArrowUp> = {
  "arrow-up": ArrowUp,
  zap: Zap,
  check: Check,
};

// Metric card component - compact version for single row display
type MetricCardProps = {
  metric: {
    id: string;
    label: string;
    value: string;
    improvement: string;
    icon: MetricIcon;
  };
  index: number;
};

function MetricCard({ metric, index }: MetricCardProps) {
  const IconComponent = iconMap[metric.icon];

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="group relative overflow-hidden rounded-lg border border-border/50 bg-card/30 backdrop-blur-sm p-3 hover:border-primary/50 hover:bg-card/50 transition-all duration-300 flex-1 min-w-0"
    >
      {/* Glow effect on hover */}
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />

      <div className="relative z-10 flex flex-col items-center text-center gap-2">
        {/* Icon at top */}
        <div className="flex-shrink-0">
          <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center">
            <IconComponent className="w-4 h-4 text-primary" />
          </div>
        </div>

        {/* Label */}
        <p className="text-xs text-muted-foreground font-medium line-clamp-2">{metric.label}</p>

        {/* Value and improvement */}
        <div className="flex flex-col items-center">
          {/* Gradient number */}
          <span
            className="text-xl md:text-2xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent whitespace-nowrap"
            style={{
              backgroundSize: "200% 100%",
            }}
          >
            {metric.value}
          </span>
          <span className="text-xs text-muted-foreground font-medium whitespace-nowrap">
            {metric.improvement}
          </span>
        </div>
      </div>

      {/* Number glow effect */}
      <div className="absolute inset-0 opacity-20 blur-xl bg-gradient-to-r from-primary to-accent pointer-events-none" />
    </motion.div>
  );
}

// Main component
export function ComparisonTabs({ className }: ComparisonTabsProps) {
  const [activeTab, setActiveTab] = useState(competitorProducts[0].id);
  const router = useRouter();

  const activeComparison = competitorProducts.find((c) => c.id === activeTab);

  // Type-safe tab change handler
  const handleTabChange = (value: string) => {
    const product = competitorProducts.find((p) => p.id === value);
    if (product) {
      setActiveTab(product.id);
    }
  };

  return (
    <section
      className={cn("relative w-full py-16 md:py-24 overflow-hidden", "bg-muted/20", className)}
    >
      <div className="container mx-auto px-4">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="text-center max-w-3xl mx-auto mb-12"
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-heading mb-4">
            Why Choose{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-accent">
              Knowhere
            </span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Knowhere outperforms major competitors in key metrics
          </p>
        </motion.div>

        {/* Centered Comparison Container */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6 }}
          className="max-w-4xl mx-auto"
        >
          {/* Desktop: Tabs */}
          <div className="hidden md:block">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="flex w-full mb-6 bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
                {competitorProducts.map((comparison) => (
                  <TabsTrigger
                    key={comparison.id}
                    value={comparison.id}
                    className="relative flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground transition-all duration-300 py-3.5 data-[state=active]:py-2.5"
                  >
                    {comparison.tabLabel}
                    {/* Active indicator glow */}
                    {activeTab === comparison.id && (
                      <motion.div
                        layoutId="activeTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>

              {/* Tab content */}
              {competitorProducts.map((comparison) => (
                <TabsContent key={comparison.id} value={comparison.id} className="mt-0">
                  <AnimatePresence mode="wait">
                    {activeTab === comparison.id && (
                      <motion.div
                        key={comparison.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        transition={{ duration: 0.2 }}
                        className="space-y-6"
                      >
                        {/* Advantage Description */}
                        <AdvantageDescription
                          productId={comparison.id}
                          description={comparison.description}
                          advantages={comparison.advantages}
                        />

                        {/* Metrics row with Show More button */}
                        <div className="flex flex-row gap-3 w-full items-end">
                          {comparison.metrics.map((metric, index) => (
                            <MetricCard key={metric.id} metric={metric} index={index} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </TabsContent>
              ))}
            </Tabs>
          </div>

          {/* Mobile: Dropdown */}
          <div className="block md:hidden">
            <div className="space-y-6">
              {/* Dropdown selector */}
              <Select value={activeTab} onValueChange={handleTabChange}>
                <SelectTrigger className="w-full bg-card/50 backdrop-blur-sm border-border/50 h-14 text-lg">
                  <SelectValue placeholder="Select Competitor" />
                </SelectTrigger>
                <SelectContent
                  className="max-w-[calc(100vw-2rem)]"
                  position="popper"
                  align="start"
                  sideOffset={8}
                >
                  {competitorProducts.map((comparison) => (
                    <SelectItem key={comparison.id} value={comparison.id}>
                      {comparison.tabLabel}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Content */}
              <AnimatePresence mode="wait">
                {activeComparison && (
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.2 }}
                    className="space-y-6"
                  >
                    {/* Advantage Description */}
                    <AdvantageDescription
                      productId={activeComparison.id}
                      description={activeComparison.description}
                      advantages={activeComparison.advantages}
                    />

                    {/* Metrics row */}
                    <div className="flex flex-row gap-3 w-full overflow-x-auto pb-2">
                      {activeComparison.metrics.map((metric, index) => (
                        <MetricCard key={metric.id} metric={metric} index={index} />
                      ))}
                    </div>

                    {/* Show More button - full width on mobile */}
                    <Button
                      onClick={() =>
                        router.push(`/versus/${activeComparison.id}`, { scroll: false })
                      }
                      className="w-full h-auto px-4 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
                    >
                      <span>Show More</span>
                      <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
