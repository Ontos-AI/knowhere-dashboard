/**
 * Shared types for lightbox components
 */

export type ComparisonImage = {
  src: string;
  alt: string;
  label: string;
  metrics?: {
    processingTime?: string;
    accuracy?: string;
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
