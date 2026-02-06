/**
 * Shared types for lightbox components
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

export type LightboxProps = {
  images: ComparisonImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export type ComparisonLightboxProps = {
  originalImage: ComparisonImage;
  resultImages: ComparisonImage[];
  initialResultIndex: number;
  isOpen: boolean;
  onClose: () => void;
};

export type LightboxPattern = "fullscreen" | "comparison" | "gallery";
