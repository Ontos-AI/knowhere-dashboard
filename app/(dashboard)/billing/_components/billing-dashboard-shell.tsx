"use client";

import { DashboardShell } from "@app/(dashboard)/_components/dashboard-shell";
import type { AuthUser } from "@hooks/use-auth";

type BillingDashboardShellProps = {
  user: AuthUser;
  children: React.ReactNode;
  isBuyCreditsOpen: boolean;
};

export const BillingDashboardShell = ({
  user,
  children,
  isBuyCreditsOpen,
}: BillingDashboardShellProps) => {
  return (
    <DashboardShell
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      titleNamespace="Billing"
      creditsIconSrc="/icons/usage/summary-remaining.svg"
    >
      {children}
    </DashboardShell>
  );
};
