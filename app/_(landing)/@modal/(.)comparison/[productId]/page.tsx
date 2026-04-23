"use client";

import { Tabs, TabsList, TabsTrigger } from "@components/ui/tabs";
import { cn } from "@lib/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { HTMLShowcaseViewer } from "@/app/_(landing)/_components/comparison-variants/html-showcase-viewer";
import { allProducts } from "@/app/_(landing)/_data/product-advantages";
import type { CompetitorProductId, ProductAdvantage } from "@/app/_(landing)/_types/comparison";
import { isValidProductId } from "@/app/_(landing)/_types/comparison";

// Tab parser for nuqs
const tabParser = parseAsStringLiteral(["knowhere", "unstructured", "markitdown"] as const);

export default function ComparisonModal() {
  const router = useRouter();
  const params = useParams();
  const [mounted, setMounted] = useState(false);

  const productId = params.productId as string;
  const isValid = isValidProductId(productId) && productId !== "original";

  // Use nuqs for tab state management (default to productId if it's a competitor)
  const defaultTab = productId === "original" ? "knowhere" : (productId as CompetitorProductId);
  const [activeTab, setActiveTab] = useQueryState("tab", tabParser.withDefault(defaultTab));

  // Set mounted state for portal
  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  // Redirect if invalid productId or original
  useEffect(() => {
    if (!isValid) {
      router.push("/");
    }
  }, [isValid, router]);

  // Get current product data based on active tab
  const currentProduct = allProducts.find(
    (product): product is ProductAdvantage => product.id === activeTab
  );

  // Close modal - use router.back() for intercepted routes
  const handleClose = useCallback(
    (e?: React.MouseEvent) => {
      e?.stopPropagation();
      router.back();
    },
    [router]
  );

  // Handle ESC key press
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleClose]);

  // Type-safe tab change handler
  const handleTabChange = (value: string) => {
    const product = allProducts.find(
      (candidate): candidate is ProductAdvantage => candidate.id === value
    );
    if (product) {
      setActiveTab(product.id);
    }
  };

  // Don't render if invalid productId or not mounted
  if (!isValid || !mounted || !currentProduct) {
    return null;
  }

  // Use createPortal to render modal outside of LenisProvider
  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex flex-col bg-black/90"
        onClick={handleClose}
      >
        {/* Header with close button */}
        <header className="flex items-center justify-between p-4">
          <h2 className="text-lg font-semibold text-white">Comparison Results</h2>
          <button
            type="button"
            onClick={handleClose}
            className="rounded-full bg-white/10 p-2 text-white transition-colors hover:bg-white/20"
            aria-label="Close modal"
          >
            <X className="h-6 w-6" />
          </button>
        </header>

        {/* Main content area */}
        {/* biome-ignore lint/a11y/useKeyWithClickEvents: Stop propagation requires click handler */}
        {/* biome-ignore lint/a11y/noStaticElementInteractions: Stop propagation requires click handler */}
        <section
          className="relative flex flex-1 flex-col overflow-auto px-4 pb-4"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mx-auto w-full max-w-6xl flex flex-col flex-1 gap-4">
            {/* Top: Tab Navigation */}
            <div className="flex-shrink-0">
              <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
                <TabsList className="flex w-full max-w-md mx-auto bg-white/5 backdrop-blur-sm border border-white/10 p-1 rounded-xl">
                  {allProducts.map((product) => (
                    <TabsTrigger
                      key={product.id}
                      value={product.id}
                      className={cn(
                        "relative flex-1 text-white/70 data-[state=active]:text-white",
                        "data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:shadow-lg",
                        "transition-all duration-300"
                      )}
                    >
                      {product.tabLabel}
                      {/* Active indicator glow */}
                      {activeTab === product.id && (
                        <motion.div
                          layoutId="activeModalTab"
                          className="absolute inset-0 bg-gradient-to-r from-primary to-accent rounded-lg blur-md opacity-50 -z-10"
                          transition={{ type: "spring", stiffness: 380, damping: 30 }}
                        />
                      )}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            {/* Middle: HTML Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="flex-1 min-h-0"
              >
                <div className="w-full h-[calc(100vh-22rem)] rounded-lg overflow-auto shadow-2xl bg-background">
                  <HTMLShowcaseViewer
                    productId={currentProduct.id}
                    className="w-full h-full min-h-full"
                    onMinimize={handleClose}
                    defaultZoom={100}
                  />
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom: Description and Advantages */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`desc-${activeTab}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, delay: 0.05 }}
                className="flex-shrink-0 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm p-4"
              >
                <h3 className="text-lg font-semibold text-white mb-2">{currentProduct.name}</h3>
                <p className="text-sm text-white/70 mb-3">{currentProduct.description}</p>

                {/* Advantages list */}
                {currentProduct.advantages.length > 0 && (
                  <div className="space-y-2">
                    {currentProduct.advantages.map((advantage) => (
                      <div key={advantage} className="flex items-start gap-2">
                        <div className="flex-shrink-0 mt-0.5">
                          <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-primary" />
                          </div>
                        </div>
                        <span className="text-sm text-white/80">{advantage}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Metrics if available */}
                {currentProduct.metrics.length > 0 && (
                  <div className="mt-3 flex gap-4 text-sm text-white/70">
                    {currentProduct.metrics.map((metric) => (
                      <span key={metric.id}>
                        {metric.label}: {metric.value}
                      </span>
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </section>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
