"use client";

import { Footer } from "@/app/_(landing)/_components/footer";
import { Navbar } from "@/app/_(landing)/_components/navbar";
import { ScrollProgressBar } from "@/app/_(landing)/_components/scroll-progress-bar";
import type { VersusPageData } from "@/app/_(landing)/_data/versus-pages";
import { CTASection } from "@/app/_(landing)/versus/[product]/_components/cta-section";
import { FAQSection } from "@/app/_(landing)/versus/[product]/_components/faq-section";
import { FeatureTableSection } from "@/app/_(landing)/versus/[product]/_components/feature-table-section";
import { HeroSection } from "@/app/_(landing)/versus/[product]/_components/hero-section";
import { LiveDemoSection } from "@/app/_(landing)/versus/[product]/_components/live-demo-section";
import { QuickComparisonSection } from "@/app/_(landing)/versus/[product]/_components/quick-comparison-section";
import { TechnicalDeepDive } from "@/app/_(landing)/versus/[product]/_components/technical-deep-dive";
import { UseCasesSection } from "@/app/_(landing)/versus/[product]/_components/use-cases-section";

type VersusPageClientProps = {
  data: VersusPageData;
};

export function VersusPageClient({ data }: VersusPageClientProps) {
  return (
    <div className="flex flex-col gap-0">
      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Required for JSON-LD structured data
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ComparisonPage",
            name: data.hero.title,
            description: data.hero.subtitle,
            itemListElement: [
              {
                "@type": "Product",
                name: "Knowhere",
                url: "https://knowhere.com",
                description: "Advanced document parsing API",
              },
              {
                "@type": "Product",
                name: data.productName,
                url: `https://knowhere.com/versus/${data.productId}`,
                description: data.hero.subtitle,
              },
            ],
          }),
        }}
      />

      {/* Scroll Progress Bar */}
      <ScrollProgressBar />

      {/* Navbar with custom links */}
      <Navbar customLinks={data.headerNav} />

      {/* Main Content */}
      <main className="min-h-screen">
        {/* Hero Section */}
        <HeroSection data={data.hero} cta={data.cta} />

        {/* Feature Table Section (Phase 2) */}
        {data.featureTable && (
          <FeatureTableSection data={data.featureTable} competitorName={data.productName} />
        )}

        {/* Quick Comparison Section */}
        <QuickComparisonSection data={data.quickComparison} competitorName={data.productName} />

        {/* Live Demo Section */}
        <LiveDemoSection data={data.liveDemo} competitorName={data.productName} />

        {/* Technical Deep Dive (Phase 2) */}
        {data.technicalDeepDive && <TechnicalDeepDive data={data.technicalDeepDive} />}

        {/* Use Cases Section (Phase 2) */}
        {data.useCases && (
          <UseCasesSection data={data.useCases} competitorName={data.productName} />
        )}

        {/* FAQ Section (Phase 2) */}
        {data.faq && <FAQSection data={data.faq} />}

        {/* Testimonials Section (Phase 2) */}
        {/* {data.testimonials && <TestimonialsSection data={data.testimonials} />} */}

        {/* CTA Section */}
        <CTASection data={data.cta} />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
