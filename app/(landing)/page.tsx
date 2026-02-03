import { CodeDemo } from "@app/(landing)/_components/code-demo";
import { CommunitySection } from "@app/(landing)/_components/community-section";
import { CTASection } from "@app/(landing)/_components/cta-section";
import { DataTransformationViz } from "@app/(landing)/_components/data-transformation-viz";
import { EnhancedCapabilities } from "@app/(landing)/_components/enhanced-capabilities";
import { Footer } from "@app/(landing)/_components/footer";
import { HeroSection } from "@app/(landing)/_components/hero/hero-section";
import { Navbar } from "@app/(landing)/_components/navbar";
import { ProductComparison } from "@app/(landing)/_components/product-comparison";
import { ScrollProgressBar } from "@app/(landing)/_components/scroll-progress-bar";
import { TrustIndicators } from "@app/(landing)/_components/trust-indicators";

export default function LandingPage() {
  return (
    <div className="flex flex-col gap-0">
      <ScrollProgressBar />
      <Navbar />
      <HeroSection />
      <TrustIndicators />
      <ProductComparison />
      <EnhancedCapabilities />
      <DataTransformationViz />
      <CodeDemo />
      <CTASection />
      <CommunitySection />
      <Footer />
    </div>
  );
}
