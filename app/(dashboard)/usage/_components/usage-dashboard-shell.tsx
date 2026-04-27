"use client";

import { DashboardShell } from "@app/(dashboard)/_components/dashboard-shell";
import type { AuthUser } from "@hooks/use-auth";

type UsageDashboardShellProps = {
  user: AuthUser;
  children: React.ReactNode;
  isBuyCreditsOpen: boolean;
};

export const UsageDashboardShell = ({
  user,
  children,
  isBuyCreditsOpen,
}: UsageDashboardShellProps) => {
  return (
    <DashboardShell
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      titleNamespace="Usage"
      creditsIconSrc="/icons/usage/summary-remaining.svg"
    >
      {children}
    </DashboardShell>
  );
};
