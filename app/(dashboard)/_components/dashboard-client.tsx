"use client";

import { PaymentRedirectTracking } from "@providers/payment-redirect-tracking";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { Header } from "@/app/(dashboard)/_components/header";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import { ApiKeysDashboardShell } from "@/app/(dashboard)/api-keys/_components/api-keys-dashboard-shell";
import { BuyCreditsModal } from "@/app/(dashboard)/billing/_components/buy-credits-modal";
import { SettingsDashboardShell } from "@/app/(dashboard)/settings/_components/settings-dashboard-shell";
import { UsageDashboardShell } from "@/app/(dashboard)/usage/_components/usage-dashboard-shell";
import { WebhooksDashboardShell } from "@/app/(dashboard)/webhooks/_components/webhooks-dashboard-shell";
import type { AuthUser } from "@/hooks/use-auth";
import { useAppConfigContext } from "@/providers/config-provider";

type DashboardClientProps = {
  user: AuthUser;
  children: React.ReactNode;
};

export function DashboardClient({ user, children }: DashboardClientProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { billingEnabled } = useAppConfigContext();
  const isBuyCreditsOpen = billingEnabled && searchParams.get("buy") === "true";
  const isUsageRoute = pathname === "/usage" || pathname.startsWith("/usage/");
  const isApiKeysRoute = pathname === "/api-keys" || pathname.startsWith("/api-keys/");
  const isSettingsRoute = pathname === "/settings" || pathname.startsWith("/settings/");
  const isWebhooksRoute = pathname === "/webhooks" || pathname.startsWith("/webhooks/");
  const isRedesignedDashboardRoute =
    isUsageRoute || isApiKeysRoute || isSettingsRoute || isWebhooksRoute;

  useEffect(() => {
    if (isRedesignedDashboardRoute) {
      return;
    }

    document.body.classList.add("console-tone");
    return () => document.body.classList.remove("console-tone");
  }, [isRedesignedDashboardRoute]);

  if (isUsageRoute) {
    return (
      <>
        <Suspense fallback={null}>
          <PaymentRedirectTracking />
        </Suspense>
        <UsageDashboardShell user={user} isBuyCreditsOpen={isBuyCreditsOpen}>
          {children}
        </UsageDashboardShell>
      </>
    );
  }

  if (isApiKeysRoute) {
    return (
      <>
        <Suspense fallback={null}>
          <PaymentRedirectTracking />
        </Suspense>
        <ApiKeysDashboardShell user={user} isBuyCreditsOpen={isBuyCreditsOpen}>
          {children}
        </ApiKeysDashboardShell>
      </>
    );
  }

  if (isWebhooksRoute) {
    return (
      <>
        <Suspense fallback={null}>
          <PaymentRedirectTracking />
        </Suspense>
        <WebhooksDashboardShell user={user} isBuyCreditsOpen={isBuyCreditsOpen}>
          {children}
        </WebhooksDashboardShell>
      </>
    );
  }

  if (isSettingsRoute) {
    return (
      <>
        <Suspense fallback={null}>
          <PaymentRedirectTracking />
        </Suspense>
        <SettingsDashboardShell user={user} isBuyCreditsOpen={isBuyCreditsOpen}>
          {children}
        </SettingsDashboardShell>
      </>
    );
  }

  return (
    <div className="landing-tone relative min-h-screen bg-background text-foreground">
      <Suspense fallback={null}>
        <PaymentRedirectTracking />
      </Suspense>
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(217,119,6,0.1),transparent_55%)]" />
      {/* 侧边栏 */}
      <Sidebar user={user} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      {/* 主内容区域 */}
      <div className="relative z-10 sm:pl-[160px] lg:pl-[200px]">
        {/* 顶部导航栏 */}
        <Header onMenuClick={() => setSidebarOpen(true)} />

        {/* 页面内容 */}
        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {isBuyCreditsOpen ? <BuyCreditsModal /> : null}
    </div>
  );
}
