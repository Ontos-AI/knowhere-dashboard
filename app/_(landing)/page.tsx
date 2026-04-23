import { CodeDemo } from "@app/_(landing)/_components/code-demo";
import { ComparisonTabs } from "@app/_(landing)/_components/comparison-tabs";
import { CTASection } from "@app/_(landing)/_components/cta-section";
import { DataTransformationViz } from "@app/_(landing)/_components/data-transformation-viz";
import { EnhancedCapabilities } from "@app/_(landing)/_components/enhanced-capabilities";
import { Footer } from "@app/_(landing)/_components/footer";
import { HeroSection } from "@app/_(landing)/_components/hero/hero-section";
import { Navbar } from "@app/_(landing)/_components/navbar";
import { OpenClawPluginSection } from "@app/_(landing)/_components/openclaw-plugin-section";
import { PricingSection } from "@app/_(landing)/_components/pricing-section";
import { ProductComparison } from "@app/_(landing)/_components/product-comparison";
import { ScrollProgressBar } from "@app/_(landing)/_components/scroll-progress-bar";
import { SupportedFormats } from "@app/_(landing)/_components/supported-formats";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <SupportedFormats />
      <CodeDemo />
      <OpenClawPluginSection />
      <ProductComparison />
      <ComparisonTabs />
      {/* <ComparisonCardStack enableAutoPlay={true} /> */}
      {/* <ComparisonCoverflow enableAutoPlay={true} /> */}
      {/* <ComparisonGrid enableAutoPlay={true} /> */}
      {/* <ComparisonSlider enableAutoPlay={true} /> */}
      <EnhancedCapabilities />
      <DataTransformationViz />
      <PricingSection />
      <CTASection />
      {/* <CommunitySection /> */}
      <Footer />
    </div>
  );
}
