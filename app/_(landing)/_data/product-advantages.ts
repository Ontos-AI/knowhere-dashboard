import type { ProductAdvantage } from "@/app/_(landing)/_types/comparison";

/**
 * Knowhere product data (our product)
 */
const knowhereProduct: ProductAdvantage = {
  id: "knowhere",
  name: "Knowhere",
  tabLabel: "Knowhere",
  description:
    "Knowhere is a professional document parsing engine that delivers exceptional accuracy and performance. Built specifically for RAG applications, it preserves document structure and handles complex tables with ease.",
  advantages: [
    "99.8% parsing accuracy with advanced table structure recognition",
    "3x faster processing speed (187ms vs competitors' 350ms+ average)",
    "Preserves semantic relationships and document hierarchy",
    "Handles merged cells and complex table layouts perfectly",
    "Optimized for RAG applications with structured output",
  ],
  metrics: [],
  resultImage: "/comparison/tables/knowhere.html",
  isOurProduct: true,
};

/**
 * Competitor products data (used in landing page comparison tabs)
 */
export const competitorProducts: ProductAdvantage[] = [
  {
    id: "unstructured",
    name: "Unstructured",
    tabLabel: "Unstructured",
    description:
      "Unstructured is an open-source document processing tool that provides basic text extraction. While functional for simple documents, it struggles with complex table structures and loses important semantic information during parsing.",
    advantages: [
      "Open-source and community-driven development",
      "Basic text extraction for simple documents",
      "Supports multiple common file formats",
    ],
    metrics: [],
    resultImage: "/comparison/tables/unstructured.html",
  },
  {
    id: "markitdown",
    name: "Markitdown",
    tabLabel: "Markitdown",
    description:
      "Markitdown focuses on converting documents to Markdown format with a lightweight approach. However, it lacks the sophistication needed for complex document structures and often produces suboptimal results with tables and nested content.",
    advantages: [
      "Simple Markdown conversion workflow",
      "Lightweight and easy to integrate",
      "Good for basic text documents",
    ],
    metrics: [],
    resultImage: "/comparison/tables/markitdown.html",
  },
];

/**
 * All products including Knowhere (used in modal and comparison route page)
 * Knowhere is placed first as our product
 */
export const allProducts: ProductAdvantage[] = [knowhereProduct, ...competitorProducts];

/**
 * @deprecated Use competitorProducts or allProducts instead
 */
export const productAdvantages = competitorProducts;
