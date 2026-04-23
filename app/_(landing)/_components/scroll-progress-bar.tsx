"use client";

import { useScrollProgress } from "@app/_(landing)/_hooks/use-scroll-progress";
import { motion } from "framer-motion";

export function ScrollProgressBar() {
  const progress = useScrollProgress();

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-accent to-primary z-50 origin-left"
      style={{ scaleX: progress }}
      initial={{ scaleX: 0 }}
    />
  );
}
