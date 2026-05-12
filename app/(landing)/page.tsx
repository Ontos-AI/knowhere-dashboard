import { homePageDesign } from "@app/(landing)/_components/home-page-design";
import { ClawPage } from "@app/(landing)/claw/_components/claw-page";

export default function LandingPage() {
  return (
    <ClawPage
      navItems={homePageDesign.navItems}
      showUtilityControls={homePageDesign.showUtilityControls}
    />
  );
}
