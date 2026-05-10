import { ClawCtaSection } from "@app/(landing)/claw/_components/claw-cta-section";
import { ClawFooter } from "@app/(landing)/claw/_components/claw-footer";
import { ClawHeader } from "@app/(landing)/claw/_components/claw-header";
import { ClawHeroSection } from "@app/(landing)/claw/_components/claw-hero-section";
import { ClawIntegrationSection } from "@app/(landing)/claw/_components/claw-integration-section";
import { ClawWorkflowSection } from "@app/(landing)/claw/_components/claw-workflow-section";

export const ClawPage = () => {
  return (
    <div className="min-h-dvh bg-[#fafafa] text-[#09090b]">
      <ClawHeader />
      <main className="mx-auto w-full min-w-[375px] min-[769px]:max-w-[976px]">
        <ClawHeroSection />
        <div className="-mt-px">
          <ClawWorkflowSection />
        </div>
        <div className="-mt-px">
          <ClawIntegrationSection />
        </div>
        <div className="-mt-px">
          <ClawCtaSection />
        </div>
        <div className="-mt-px">
          <ClawFooter />
        </div>
      </main>
    </div>
  );
};
