import type { SiteChromePage } from "@components/site-chrome/links";
import { SiteFooter } from "@components/site-chrome/site-footer";
import { SiteHeader } from "@components/site-chrome/site-header";
import type { ReactNode } from "react";

type SiteChromeProps = {
  page: SiteChromePage;
  children: ReactNode;
};

export const SiteChrome = ({ page, children }: SiteChromeProps) => (
  <div className="kh-site">
    <SiteHeader page={page} />
    <div className="kh-site-main">{children}</div>
    <SiteFooter page={page} />
  </div>
);
