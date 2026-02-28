export default function LandingPageLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal?: React.ReactNode;
}) {
  return (
    <div
      className="dark min-h-screen bg-background text-foreground"
      // Make the page dark mode by default
      style={
        {
          colorScheme: "dark",
          // Dark mode CSS variables - copied from globals.css
          "--background": "220 20% 6%",
          "--background-secondary": "220 20% 9%",
          "--background-tertiary": "220 20% 12%",
          "--foreground": "0 0% 95%",
          "--card": "220 18% 10%",
          "--card-foreground": "0 0% 95%",
          "--popover": "220 18% 10%",
          "--popover-foreground": "0 0% 95%",
          "--primary": "200 85% 55%",
          "--primary-light": "200 85% 65%",
          "--primary-dark": "200 85% 45%",
          "--primary-foreground": "220 20% 6%",
          "--secondary": "160 75% 50%",
          "--secondary-foreground": "220 20% 6%",
          "--muted": "220 15% 20%",
          "--muted-foreground": "0 0% 70%",
          "--accent": "270 65% 60%",
          "--accent-light": "270 65% 70%",
          "--accent-dark": "270 65% 50%",
          "--accent-foreground": "0 0% 100%",
          "--destructive": "0 80% 60%",
          "--destructive-foreground": "0 0% 100%",
          "--border": "220 15% 18%",
          "--input": "220 18% 10%",
          "--ring": "200 85% 55%",
          "--radius": "0.5rem",
          "--sidebar-background": "220 20% 6%",
          "--sidebar-foreground": "0 0% 95%",
          "--sidebar-primary": "200 85% 55%",
          "--sidebar-primary-foreground": "220 20% 6%",
          "--sidebar-accent": "220 15% 15%",
          "--sidebar-accent-foreground": "0 0% 95%",
          "--sidebar-border": "220 15% 18%",
          "--sidebar-ring": "200 85% 55%",
        } as React.CSSProperties
      }
    >
      {children}
      {modal}
    </div>
  );
}
