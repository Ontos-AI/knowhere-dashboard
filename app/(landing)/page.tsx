import { CodeDemo } from "@app/(landing)/_components/code-demo";
import { CommunitySection } from "@app/(landing)/_components/community-section";
import { ComparisonTabs } from "@app/(landing)/_components/comparison-tabs";
import { ComparisonCardStack } from "@app/(landing)/_components/comparison-variants/comparison-card-stack";
import { CTASection } from "@app/(landing)/_components/cta-section";
import { DataTransformationViz } from "@app/(landing)/_components/data-transformation-viz";
import { EnhancedCapabilities } from "@app/(landing)/_components/enhanced-capabilities";
import { Footer } from "@app/(landing)/_components/footer";
import { HeroSection } from "@app/(landing)/_components/hero/hero-section";
import { Navbar } from "@app/(landing)/_components/navbar";
import { PricingSection } from "@app/(landing)/_components/pricing-section";
import { ProductComparison } from "@app/(landing)/_components/product-comparison";
import { ScrollProgressBar } from "@app/(landing)/_components/scroll-progress-bar";
import { TrustIndicators } from "@app/(landing)/_components/trust-indicators";
import { ComparisonCoverflow } from "@/app/(landing)/_components/comparison-variants/comparison-coverflow";
import { ComparisonGrid } from "@/app/(landing)/_components/comparison-variants/comparison-grid";
import { ComparisonSlider } from "@/app/(landing)/_components/comparison-variants/comparison-slider";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <TrustIndicators />
      <ProductComparison />
      <ComparisonTabs />
      <ComparisonCardStack enableAutoPlay={true} />
      <ComparisonCoverflow enableAutoPlay={true} />
      <ComparisonGrid enableAutoPlay={true} />
      <ComparisonSlider enableAutoPlay={true} />
      <EnhancedCapabilities />
      <DataTransformationViz />
      <CodeDemo />
      <PricingSection />
      <CTASection />
      <CommunitySection />
      <Footer />
    </div>
  );
}
