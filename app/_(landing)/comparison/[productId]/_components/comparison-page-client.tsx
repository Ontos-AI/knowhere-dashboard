"use client";

import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles, X } from "lucide-react";
import Link from "next/link";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HTMLShowcaseViewer } from "@/app/_(landing)/_components/comparison-variants/html-showcase-viewer";
import { allProducts } from "@/app/_(landing)/_data/product-advantages";
import type { CompetitorProductId, ProductId } from "@/app/_(landing)/_types/comparison";

type ComparisonPageClientProps = {
  productId: ProductId;
};

// Tab parser for nuqs
const tabParser = parseAsStringLiteral(["knowhere", "unstructured", "markitdown"] as const);

export function ComparisonPageClient({ productId }: ComparisonPageClientProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Use nuqs for tab state management (default to productId if it's a competitor)
  const defaultTab = productId === "original" ? "knowhere" : (productId as CompetitorProductId);
  const [currentTab, setCurrentTab] = useQueryState("tab", tabParser.withDefault(defaultTab));

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Get current comparison data based on active tab
  const currentComparison = allProducts.find((c) => c.id === currentTab);

  // Type-safe tab change handler
  const handleTabChange = (value: string) => {
    const product = allProducts.find((p) => p.id === value);
    if (product) {
      setCurrentTab(product.id);
    }
  };

  // Fullscreen modal handlers
  const openFullscreen = useCallback(() => {
    setIsFullscreen(true);
  }, []);

  const closeFullscreen = useCallback(() => {
    setIsFullscreen(false);
  }, []);

  if (!currentComparison) {
    return null;
  }

  return (
    <>
      <div className="min-h-screen bg-background text-foreground">
        {/* Header with navigation */}
        <header className="sticky top-0 z-40 border-b border-border/50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="relative h-16 flex items-center px-4">
            {/* Logo - positioned on the left */}
            <Link
              href="/"
              className="flex items-center space-x-2 group transition-opacity hover:opacity-80"
            >
              <motion.div
                className="relative"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Sparkles className="h-5 w-5 text-primary group-hover:text-accent transition-colors" />
                <motion.div
                  className="absolute inset-0 bg-primary/20 blur-xl rounded-full"
                  animate={{
                    scale: [1, 1.2, 1],
                    opacity: [0.3, 0.5, 0.3],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                  }}
                />
              </motion.div>
              <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
                Knowhere API
              </span>
            </Link>
          </div>
        </header>

        {/* Main content area */}
        <main className="mx-auto px-4 py-8 max-w-[1600px]">
          {/* Tab Navigation */}
          <div className="mb-6">
            <Tabs value={currentTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="flex w-full max-w-md mx-auto  bg-muted/50 backdrop-blur-sm border border-border/50 p-1 rounded-xl">
                {allProducts.map((product) => (
                  <TabsTrigger
                    key={product.id}
                    value={product.id}
                    className={cn(
                      "relative flex-1 data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground data-[state=active]:shadow-lg transition-all duration-300"
                    )}
                  >
                    {product.tabLabel}
                    {/* Active indicator glow */}
                    {currentTab === product.id && (
                      <motion.div
                        layoutId="activeDetailTab"
                        className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 -z-10"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          {/* Content Area */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* HTML Showcase - Wider display */}
              <div className="rounded-2xl border border-border/50 bg-card p-4">
                <div className="w-full h-[calc(100vh-20rem)] rounded-lg overflow-auto shadow-2xl">
                  <HTMLShowcaseViewer
                    productId={currentComparison.id}
                    className="w-full h-full min-h-full"
                    defaultZoom={100}
                    onMaximize={openFullscreen}
                  />
                </div>
              </div>

              {/* Product Info and Metrics */}
              <div className="rounded-2xl  border border-border/50 bg-card p-6">
                <h2 className="text-2xl font-bold mb-2">{currentComparison.name}</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  {currentComparison.description}
                </p>

                {/* Metrics */}
                {/* <div className='space-y-3'>
                  <h3 className='text-sm font-semibold text-muted-foreground uppercase'>
                    Performance Metrics
                  </h3>
                  <div className='grid grid-cols-1 md:grid-cols-3 gap-3'>
                    {currentComparison.metrics.map((metric) => (
                      <div
                        key={metric.id}
                        className='flex items-center justify-between p-3 rounded-lg bg-muted/50'
                      >
                        <span className='text-sm text-muted-foreground'>{metric.label}</span>
                        <span className='text-lg font-semibold'>{metric.value}</span>
                      </div>
                    ))}
                  </div>
                </div> */}
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Fullscreen Modal */}
      {mounted &&
        isFullscreen &&
        createPortal(
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex flex-col bg-black/90"
              onClick={closeFullscreen}
            >
              {/* Header with title and close button */}
              <header className="flex items-center justify-between p-4">
                <h2 className="text-lg font-semibold text-white">{currentComparison.name}</h2>
                <button
                  type="button"
                  onClick={closeFullscreen}
                  className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
                  aria-label="Close fullscreen"
                >
                  <X className="h-6 w-6" />
                </button>
              </header>

              {/* Main content area */}
              <section className="relative flex flex-1 items-center justify-center overflow-auto px-4 pb-4">
                {/* Content display */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="flex max-h-full max-w-full flex-col items-center w-full"
                >
                  <div className="w-full h-[calc(100vh-8rem)] rounded-lg overflow-auto shadow-2xl bg-background">
                    <HTMLShowcaseViewer
                      productId={currentComparison.id}
                      className="w-full h-full min-h-full"
                      onMinimize={closeFullscreen}
                      defaultZoom={100}
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-xl font-semibold text-white">{currentComparison.name}</h3>
                    <p className="mt-2 text-sm text-white/70">{currentComparison.description}</p>
                    <div className="mt-2 flex gap-4 text-sm text-white/70 justify-center">
                      {currentComparison.metrics.map((metric) => (
                        <span key={metric.id}>
                          {metric.label}: {metric.value}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </section>
            </motion.div>
          </AnimatePresence>,
          document.body
        )}
    </>
  );
}
