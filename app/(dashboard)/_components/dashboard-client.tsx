"use client";

import { PaymentRedirectTracking } from "@providers/payment-redirect-tracking";
import { usePathname, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { Header } from "@/app/(dashboard)/_components/header";
import { Sidebar } from "@/app/(dashboard)/_components/sidebar";
import { ApiKeysDashboardShell } from "@/app/(dashboard)/api-keys/_components/api-keys-dashboard-shell";
import { BillingDashboardShell } from "@/app/(dashboard)/billing/_components/billing-dashboard-shell";
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
  const isBillingRoute = pathname === "/billing" || pathname.startsWith("/billing/");

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

  if (isBillingRoute) {
    return (
      <>
        <Suspense fallback={null}>
          <PaymentRedirectTracking />
        </Suspense>
        <BillingDashboardShell user={user} isBuyCreditsOpen={isBuyCreditsOpen}>
          {children}
        </BillingDashboardShell>
      </>
    );
  }

  return (
    <div className="relative min-h-screen bg-background font-sans text-foreground">
      <Suspense fallback={null}>
        <PaymentRedirectTracking />
      </Suspense>
      <Sidebar user={user} open={sidebarOpen} onOpenChange={setSidebarOpen} />

      <div className="relative z-10 sm:pl-[160px] lg:pl-[200px]">
        <Header onMenuClick={() => setSidebarOpen(true)} />

        <main className="py-6">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">{children}</div>
        </main>
      </div>

      {isBuyCreditsOpen ? <BuyCreditsModal /> : null}
    </div>
  );
}
