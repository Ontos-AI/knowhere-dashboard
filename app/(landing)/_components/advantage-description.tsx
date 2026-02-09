"use client";

import { cn } from "@lib/utils";
import { motion } from "framer-motion";
import { Check, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

type AdvantageDescriptionProps = {
  productId: string;
  description: string;
  advantages: string[];
  className?: string;
};

export function AdvantageDescription({
  productId,
  description,
  advantages,
  className,
}: AdvantageDescriptionProps) {
  const router = useRouter();
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={cn(
        "glass rounded-2xl border border-border/50 p-6 space-y-4",
        "hover:border-primary/50 transition-all duration-300",
        className
      )}
    >
      {/* Description paragraph */}
      <p className="text-base text-muted-foreground leading-relaxed">{description}</p>

      {/* Advantages list */}
      <div className="space-y-3 flex flex-col">
        {advantages.map((advantage, index) => (
          <motion.div
            key={advantage}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="flex items-start gap-3 group"
          >
            {/* Check icon */}
            <div className="flex-shrink-0 mt-0.5">
              <div className="w-5 h-5 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Check className="w-3 h-3 text-primary" />
              </div>
            </div>

            {/* Advantage text */}
            <p className="text-sm text-foreground/90 leading-relaxed flex-1">{advantage}</p>
          </motion.div>
        ))}

        {/* Show More button */}
        <Button
          onClick={() => router.push(`/comparison/${productId}`, { scroll: false })}
          className="ml-auto flex-shrink-0 h-auto px-4 py-3 bg-gradient-to-r from-primary to-accent hover:from-primary/90 hover:to-accent/90 text-primary-foreground font-semibold rounded-lg transition-all duration-300 shadow-lg hover:shadow-xl group"
        >
          <span>Show More</span>
          <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
        </Button>
      </div>
    </motion.div>
  );
}
