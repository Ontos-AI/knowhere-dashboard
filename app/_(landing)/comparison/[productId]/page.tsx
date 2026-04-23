import type { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  COMPARISON_METADATA,
  isValidProductId,
  PRODUCT_IDS,
  type ProductId,
} from "@/app/_(landing)/_types/comparison";
import { ComparisonPageClient } from "@/app/_(landing)/comparison/[productId]/_components/comparison-page-client";

// Generate metadata for SEO
export async function generateMetadata(props: {
  params: Promise<{ productId: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const productId = params.productId;

  if (!isValidProductId(productId)) {
    return {
      title: "Comparison Not Found",
    };
  }

  const metadata = COMPARISON_METADATA[productId as ProductId];

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
    alternates: {
      canonical: `/comparison/${productId}`,
    },
  };
}

// Generate static params for all product IDs
export function generateStaticParams() {
  return PRODUCT_IDS.map((productId) => ({
    productId,
  }));
}

export default async function ComparisonPage(props: { params: Promise<{ productId: string }> }) {
  const params = await props.params;
  const productId = params.productId;

  // Validate productId
  if (!isValidProductId(productId)) {
    notFound();
  }

  return <ComparisonPageClient productId={productId as ProductId} />;
}
