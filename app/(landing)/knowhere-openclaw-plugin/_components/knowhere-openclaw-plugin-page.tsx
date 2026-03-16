import { CTASection } from "@app/(landing)/knowhere-openclaw-plugin/_components/cta-section";
import { HeroSection } from "@app/(landing)/knowhere-openclaw-plugin/_components/hero-section";
import { IntegrationSection } from "@app/(landing)/knowhere-openclaw-plugin/_components/integration-section";
import { WorkflowSection } from "@app/(landing)/knowhere-openclaw-plugin/_components/workflow-section";

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
