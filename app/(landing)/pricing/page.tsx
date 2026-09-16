import {
  BILLABLE_PACK_PAGES,
  PACK_PRICE_LABEL,
} from "@app/(landing)/pricing/_components/pricing-data";
import { PricingHome } from "@app/(landing)/pricing/_components/pricing-home";
import { SiteChrome } from "@components/site-chrome";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

const CANONICAL_ORIGIN = "https://knowhereto.ai";
const CANONICAL_PATH = "/pricing";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("Pricing");
  const title = t("seo.title");
  const description = t("seo.description", {
    packPrice: PACK_PRICE_LABEL,
    packPages: BILLABLE_PACK_PAGES,
  });

  return {
    metadataBase: new URL(CANONICAL_ORIGIN),
    title,
    description,
    alternates: {
      canonical: CANONICAL_PATH,
    },
    openGraph: {
      title,
      description,
      url: CANONICAL_PATH,
      siteName: "Knowhere",
      type: "website",
    },
    twitter: {
      card: "summary",
      title,
      description,
    },
  };
}

export default function PricingPage() {
  return (
    <SiteChrome page="pricing">
      <PricingHome />
    </SiteChrome>
  );
}
