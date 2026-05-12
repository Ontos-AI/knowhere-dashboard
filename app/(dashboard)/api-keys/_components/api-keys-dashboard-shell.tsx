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
      compactMobileHeader={true}
      compactTabletHeader={true}
      user={user}
      isBuyCreditsOpen={isBuyCreditsOpen}
      mainClassName="px-[14px] pb-[22px] pt-[18px] sm:px-[30px] sm:pb-6 sm:pt-[22px] lg:px-12 lg:pb-8 lg:pt-8"
      titleNamespace="ApiKeys"
      creditsIconSrc="/icons/api-keys/credits-coin.svg"
    >
      {children}
    </DashboardShell>
  );
};
