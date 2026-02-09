/**
 * Shared types for comparison components
 */

export type ComparisonImage = {
  src: string; // Image source (for fallback or original input)
  alt: string;
  label: string;
  productId?: string; // Product ID for HTML showcase (e.g., "knowhere", "markitdown", "unstructured", "original-input")
  useHTML?: boolean; // If true, render HTML instead of image
  metrics?: {
    processingTime?: string;
    accuracy?: string;
    description?: string;
    [key: string]: string | undefined;
  };
};
