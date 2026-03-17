import { CodeDemo } from "@app/(landing)/_components/code-demo";
import { ComparisonTabs } from "@app/(landing)/_components/comparison-tabs";
import { CTASection } from "@app/(landing)/_components/cta-section";
import { DataTransformationViz } from "@app/(landing)/_components/data-transformation-viz";
import { EnhancedCapabilities } from "@app/(landing)/_components/enhanced-capabilities";
import { Footer } from "@app/(landing)/_components/footer";
import { HeroSection } from "@app/(landing)/_components/hero/hero-section";
import { Navbar } from "@app/(landing)/_components/navbar";
import { OpenClawPluginSection } from "@app/(landing)/_components/openclaw-plugin-section";
import { PricingSection } from "@app/(landing)/_components/pricing-section";
import { ProductComparison } from "@app/(landing)/_components/product-comparison";
import { ScrollProgressBar } from "@app/(landing)/_components/scroll-progress-bar";
import { SupportedFormats } from "@app/(landing)/_components/supported-formats";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <SupportedFormats />
      <ProductComparison />
      <ComparisonTabs />
      {/* <ComparisonCardStack enableAutoPlay={true} /> */}
      {/* <ComparisonCoverflow enableAutoPlay={true} /> */}
      {/* <ComparisonGrid enableAutoPlay={true} /> */}
      {/* <ComparisonSlider enableAutoPlay={true} /> */}
      <EnhancedCapabilities />
      <DataTransformationViz />
      <CodeDemo />
      <OpenClawPluginSection />
      <PricingSection />
      <CTASection />
      {/* <CommunitySection /> */}
      <Footer />
    </div>
  );
}
