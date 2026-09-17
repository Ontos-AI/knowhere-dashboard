import type { Metadata } from "next";
import type { ReactNode } from "react";

/*
  The prototype declares exactly one icon, its own SVG. Browsers pick a declared
  `favicon.ico` over an SVG icon no matter how the candidates are ordered or sized, so
  inheriting the dashboard's icon set here would put the dashboard app icon in the tab.
  Landing routes therefore declare the prototype mark themselves; the dashboard keeps
  `appMetadata`.
*/
export const metadata: Metadata = {
  icons: {
    apple: [{ url: "/images/knowhere/app-icon.png", type: "image/png", sizes: "1024x1024" }],
    icon: [{ url: "/assets/knowhere-favicon.svg", type: "image/svg+xml" }],
  },
};

type LandingPageLayoutProps = {
  children: ReactNode;
  modal?: ReactNode;
};

export default function LandingPageLayout({ children, modal }: LandingPageLayoutProps) {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      {children}
      {modal}
    </div>
  );
}
