import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Fragment } from "react";
import {
  getVersusPageData,
  isValidVersusProductId,
  type VersusProductId,
} from "@/app/_(landing)/_data/versus-pages";
import { VersusPageClient } from "@/app/_(landing)/versus/[product]/_components/versus-page-client";

type PageProps = {
  params: Promise<{
    product: string;
  }>;
};

// Static Site Generation - Pre-render pages at build time
export function generateStaticParams() {
  return [{ product: "unstructured" }, { product: "markitdown" }];
}

// SEO Metadata
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { product } = await params;

  // Validate product ID
  if (!isValidVersusProductId(product)) {
    return {
      title: "Not Found",
    };
  }

  const data = getVersusPageData(product);

  return {
    title: data.seo.title,
    description: data.seo.description,
    keywords: data.seo.keywords,

    // Open Graph
    openGraph: {
      title: data.seo.title,
      description: data.seo.description,
      url: `https://knowhere.com/versus/${product}`,
      siteName: "Knowhere",
      images: data.seo.ogImage
        ? [
            {
              url: data.seo.ogImage,
              width: 1200,
              height: 630,
            },
          ]
        : [],
      locale: "en_US",
      type: "website",
    },

    // Twitter Card
    twitter: {
      card: "summary_large_image",
      title: data.seo.title,
      description: data.seo.description,
      images: data.seo.ogImage ? [data.seo.ogImage] : [],
    },

    // Canonical URL
    alternates: {
      canonical: `/versus/${product}`,
    },
  };
}

export default async function VersusPage({ params }: PageProps) {
  const { product } = await params;

  // Validate product ID - return 404 if invalid
  if (!isValidVersusProductId(product)) {
    notFound();
  }

  const data = getVersusPageData(product as VersusProductId);

  return (
    <>
      {/* Preload HTML files for iframes */}
      {data.liveDemo.demos.map((demo) => (
        <Fragment key={demo.label}>
          {demo.originalFile && <link rel="preload" as="fetch" href={demo.originalFile} />}
          <link rel="preload" as="fetch" href={demo.knowhereOutput} />
          <link rel="preload" as="fetch" href={demo.competitorOutput} />
        </Fragment>
      ))}

      <VersusPageClient data={data} />
    </>
  );
}
