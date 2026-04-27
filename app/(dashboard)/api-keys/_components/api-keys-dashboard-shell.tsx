"use client";

import { DashboardShell } from "@app/(dashboard)/_components/dashboard-shell";
import type { AuthUser } from "@hooks/use-auth";

type ApiKeysDashboardShellProps = {
  user: AuthUser;
  children: React.ReactNode;
  isBuyCreditsOpen: boolean;
};

export const ApiKeysDashboardShell = ({
  user,
  children,
  isBuyCreditsOpen,
}: ApiKeysDashboardShellProps) => {
  return (
    <DashboardShell
      compactTabletHeader={true}
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      titleNamespace="ApiKeys"
      creditsIconSrc="/icons/api-keys/credits-coin.svg"
    >
      {children}
    </DashboardShell>
  );
};
