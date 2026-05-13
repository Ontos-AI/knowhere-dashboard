"use client";

import { DashboardShell } from "@app/(dashboard)/_components/dashboard-shell";
import type { AuthUser } from "@hooks/use-auth";

type WebhooksDashboardShellProps = {
  user: AuthUser;
  children: React.ReactNode;
  isBuyCreditsOpen: boolean;
};

export const WebhooksDashboardShell = ({
  user,
  children,
  isBuyCreditsOpen,
}: WebhooksDashboardShellProps) => {
  return (
    <DashboardShell
      compactMobileHeader={true}
      compactTabletHeader={true}
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      mainClassName="px-[18px] pb-[22px] pt-[22px] sm:px-[30px] sm:pb-6 sm:pt-[22px] lg:px-12 lg:pb-8 lg:pt-8"
      titleNamespace="Webhooks"
      creditsIconSrc="/icons/api-keys/credits-coin.svg"
    >
      {children}
    </DashboardShell>
  );
};
