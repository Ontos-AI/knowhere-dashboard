import { homeNavItems } from "@app/(landing)/claw/_components/claw-content";
import { ClawPage } from "@app/(landing)/claw/_components/claw-page";

export default function LandingPage() {
  return <ClawPage navItems={homeNavItems} showUtilityControls />;
}
