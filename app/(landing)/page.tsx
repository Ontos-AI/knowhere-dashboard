import { LandingHome } from "@app/(landing)/_components/landing-home";
import { SiteChrome } from "@components/site-chrome";

export default function LandingPage() {
  return (
    <SiteChrome page="landing">
      <LandingHome />
    </SiteChrome>
  );
}
