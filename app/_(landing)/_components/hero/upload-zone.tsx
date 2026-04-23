"use client";

import { FILE_TYPES } from "@app/_(landing)/_lib/constants";
import { Button } from "@components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle2, FileText, Sparkles, Upload } from "lucide-react";
import { useCallback, useState } from "react";

export function UploadZone() {
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setIsProcessing(true);

    // Simulate processing
    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      // Reset after 3 seconds
      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    }, 2000);
  }, []);

  const handleClick = () => {
    // Simulate file picker
    setIsProcessing(true);

    setTimeout(() => {
      setIsProcessing(false);
      setIsComplete(true);

      setTimeout(() => {
        setIsComplete(false);
      }, 3000);
    }, 2000);
  };

  return (
    <div className="relative">
      {/* Glow effect */}
      <motion.div
        className="absolute -inset-4 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-3xl blur-3xl"
        animate={{
          opacity: [0.3, 0.6, 0.3],
          scale: [0.98, 1.02, 0.98],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
      />

      {/* Main upload area */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        whileHover={{ scale: 1.02 }}
        className={`
          relative glass border-2 rounded-2xl p-8 lg:p-12 cursor-pointer
          transition-all duration-300
          ${isDragging ? "border-accent scale-105" : "border-primary/20"}
          ${isProcessing ? "border-primary" : ""}
          ${isComplete ? "border-accent" : ""}
        `}
        onClick={handleClick}
      >
        {/* Content */}
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <motion.div
            className="relative mb-6"
            animate={
              isProcessing
                ? { rotate: 360 }
                : isComplete
                  ? { scale: [1, 1.2, 1] }
                  : { y: [0, -10, 0] }
            }
            transition={
              isProcessing
                ? { duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }
                : isComplete
                  ? { duration: 0.5 }
                  : { duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
            }
          >
            {isComplete ? (
              <div className="relative">
                <CheckCircle2 className="h-16 w-16 text-accent" />
                <motion.div
                  className="absolute inset-0 bg-accent/30 rounded-full blur-xl"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 1 }}
                />
              </div>
            ) : isProcessing ? (
              <Sparkles className="h-16 w-16 text-primary" />
            ) : (
              <Upload className="h-16 w-16 text-muted-foreground" />
            )}
          </motion.div>

          {/* Text */}
          <h3 className="text-2xl font-bold mb-2">
            {isComplete ? "Processed Successfully!" : isProcessing ? "Processing..." : "Try It Now"}
          </h3>
          <p className="text-muted-foreground mb-6">
            {isComplete
              ? "Your document has been parsed with 99.8% accuracy"
              : isProcessing
                ? "Extracting tables, formulas, and structured data..."
                : "Drag & drop a file or click to upload"}
          </p>

          {/* File type badges */}
          {!isProcessing && !isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-2 justify-center"
            >
              {FILE_TYPES.map((type, index) => (
                <motion.div
                  key={type.label}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.4 + index * 0.1 }}
                  className="px-3 py-1 rounded-full glass text-xs font-medium border border-primary/20"
                >
                  {type.label}
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Processing indicator */}
          {isProcessing && (
            <div className="w-full max-w-xs">
              <div className="h-1 bg-muted rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-primary to-accent"
                  initial={{ x: "-100%" }}
                  animate={{ x: "100%" }}
                  transition={{
                    duration: 1.5,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </div>
            </div>
          )}

          {/* Success button */}
          {isComplete && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button className="mt-4" variant="outline">
                <FileText className="h-4 w-4 mr-2" />
                View Results
              </Button>
            </motion.div>
          )}
        </div>

        {/* Floating elements */}
        <motion.div
          className="absolute top-4 right-4 text-xs font-mono text-muted-foreground glass px-2 py-1 rounded"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          &lt;200ms
        </motion.div>
        <motion.div
          className="absolute bottom-4 left-4 text-xs font-mono text-muted-foreground glass px-2 py-1 rounded"
          animate={{ opacity: [1, 0.5, 1] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, delay: 1 }}
        >
          99.8% accurate
        </motion.div>
      </motion.div>
    </div>
  );
}
