import { CTASection } from "@/app/(landing)/claw/_components/cta-section";
import { HeroSection } from "@/app/(landing)/claw/_components/hero-section";
import { IntegrationSection } from "@/app/(landing)/claw/_components/integration-section";
import { WorkflowSection } from "@/app/(landing)/claw/_components/workflow-section";

export function KnowhereOpenClawPluginPage() {
  return (
    <>
      <HeroSection />
      <WorkflowSection />
      <IntegrationSection />
      <CTASection />
    </>
  );
}
