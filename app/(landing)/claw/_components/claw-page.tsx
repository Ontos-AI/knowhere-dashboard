import type { ClawNavItem } from "@app/(landing)/claw/_components/claw-content";
import { ClawCtaSection } from "@app/(landing)/claw/_components/claw-cta-section";
import { ClawFooter } from "@app/(landing)/claw/_components/claw-footer";
import { ClawHeader } from "@app/(landing)/claw/_components/claw-header";
import { ClawHeroSection } from "@app/(landing)/claw/_components/claw-hero-section";
import { ClawIntegrationSection } from "@app/(landing)/claw/_components/claw-integration-section";
import { ClawWorkflowSection } from "@app/(landing)/claw/_components/claw-workflow-section";

type ClawPageProps = {
  navItems?: ClawNavItem[];
  showUtilityControls?: boolean;
};

export const ClawPage = ({ navItems, showUtilityControls = false }: ClawPageProps) => {
  return (
    <div className="min-h-dvh bg-white text-[#09090b]">
      <ClawHeader navItems={navItems} showUtilityControls={showUtilityControls} />
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
