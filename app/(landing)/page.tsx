import { LandingHome } from "@app/(landing)/_components/landing-home";
import { SiteChrome } from "@components/site-chrome";
import { ArrowRight } from "lucide-react";
import { useTranslations } from "next-intl";

export default function LandingPage() {
  const t = useTranslations("Landing.audioAnnouncement");

  return (
    <SiteChrome page="landing">
      <p className="kh-site-announcement">
        <strong>{t("message")}</strong>
        <a href="#formats">
          {t("viewFormats")}
          <ArrowRight aria-hidden="true" size={14} />
        </a>
      </p>
      <LandingHome />
    </SiteChrome>
  );
}
