import { ClawCtaSection } from "@app/(landing)/claw/_components/claw-cta-section";
import { ClawFooter } from "@app/(landing)/claw/_components/claw-footer";
import { ClawHeader } from "@app/(landing)/claw/_components/claw-header";
import { ClawHeroSection } from "@app/(landing)/claw/_components/claw-hero-section";
import { ClawIntegrationSection } from "@app/(landing)/claw/_components/claw-integration-section";
import { ClawWorkflowSection } from "@app/(landing)/claw/_components/claw-workflow-section";

export const ClawPage = () => {
  return (
    <div className="bg-[#fafafa] text-[#09090b]">
      <div className="mx-auto w-full">
        <ClawHeader />
        <main>
          <div className="mx-auto w-full max-w-[1280px]">
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
          </div>
        </main>
      </div>
    </div>
  );
};
