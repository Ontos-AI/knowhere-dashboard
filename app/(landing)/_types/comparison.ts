/**
 * Shared types and constants for comparison routing
 */

// Product IDs
export type ProductId = "original" | "knowhere" | "unstructured" | "markitdown";

// Competitor product IDs (excluding "original")
export type CompetitorProductId = "knowhere" | "unstructured" | "markitdown";

// Metric icon types
export type MetricIcon = "arrow-up" | "zap" | "check";

// Competitor metric type
export type CompetitorMetric = {
  id: string;
  label: string;
  value: string;
  improvement: string;
  icon: MetricIcon;
};

// Product advantage type
export type ProductAdvantage = {
  id: CompetitorProductId;
  name: string;
  tabLabel: string;
  description: string;
  advantages: string[];
  metrics: CompetitorMetric[];
  resultImage: string;
  isOurProduct?: boolean;
};

export const PRODUCT_IDS = ["original", "knowhere", "unstructured", "markitdown"] as const;

// Map productId to image index (for navigation)
export const PRODUCT_INDEX_MAP: Record<ProductId, number> = {
  original: 0,
  knowhere: 1,
  unstructured: 2,
  markitdown: 3,
};

// Map index to productId (for reverse lookup)
export const INDEX_PRODUCT_MAP: Record<number, ProductId> = {
  0: "original",
  1: "knowhere",
  2: "unstructured",
  3: "markitdown",
};

// Metadata configuration for SEO
export type ComparisonMetadata = {
  title: string;
  description: string;
  keywords: string[];
};

export const COMPARISON_METADATA: Record<ProductId, ComparisonMetadata> = {
  original: {
    title: "Original Document - Labor Cost Calculation | Knowhere Comparison",
    description:
      "View the original Excel document converted to HTML - Complex table with merged cells for labor cost calculation.",
    keywords: ["original document", "excel", "labor cost", "complex table"],
  },
  knowhere: {
    title: "Knowhere Document Parsing Results | Performance Comparison",
    description:
      "Knowhere achieves 99.8% accuracy with 187ms processing time and excellent table support for document parsing.",
    keywords: ["knowhere", "document parsing", "high accuracy", "fast processing"],
  },
  unstructured: {
    title: "Unstructured Document Processing Results | Performance Comparison",
    description: "Unstructured document processing with 87.3% accuracy and 420ms processing time.",
    keywords: ["unstructured", "document processing", "comparison"],
  },
  markitdown: {
    title: "Markitdown Conversion Results | Performance Comparison",
    description: "Markitdown markdown conversion with 82.1% accuracy and 356ms processing time.",
    keywords: ["markitdown", "markdown conversion", "comparison"],
  },
};

// Search params type
export type ComparisonSearchParams = {
  zoom?: string; // "50" to "200"
};

// Helper to parse and validate zoom level
export function parseZoomLevel(zoom: string | undefined): number {
  if (!zoom) return 100; // default zoom
  const parsed = parseInt(zoom, 10);
  if (Number.isNaN(parsed)) return 100;
  // Clamp to valid range
  return Math.max(50, Math.min(200, parsed));
}

// Helper to check if productId is valid
export function isValidProductId(productId: string): productId is ProductId {
  return PRODUCT_IDS.includes(productId as ProductId);
}

// Helper to get next product ID
export function getNextProductId(currentId: ProductId): ProductId {
  const currentIndex = PRODUCT_INDEX_MAP[currentId];
  const nextIndex = (currentIndex + 1) % PRODUCT_IDS.length;
  return INDEX_PRODUCT_MAP[nextIndex];
}

// Helper to get previous product ID
export function getPreviousProductId(currentId: ProductId): ProductId {
  const currentIndex = PRODUCT_INDEX_MAP[currentId];
  const prevIndex = (currentIndex - 1 + PRODUCT_IDS.length) % PRODUCT_IDS.length;
  return INDEX_PRODUCT_MAP[prevIndex];
}
