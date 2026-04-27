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
      compactTabletHeader={true}
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      titleNamespace="Webhooks"
      creditsIconSrc="/icons/api-keys/credits-coin.svg"
    >
      {children}
    </DashboardShell>
  );
};
