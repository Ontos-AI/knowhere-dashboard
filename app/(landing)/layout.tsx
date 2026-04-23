import type { ReactNode } from "react";

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
